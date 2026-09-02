import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export default function useRevenueRecovery() {
  const [metrics, setMetrics] = useState({
    atRisk: 0,
    recovered: 0,
    rate: 0,
    activeAgents: 0
  });
  const [events, setEvents] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [promises, setPromises] = useState([]);
  const [chartsData, setChartsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsRes, eventsRes, chartsRes] = await Promise.all([
        client.get('/dashboard/metrics'),
        client.get('/dashboard/events'),
        client.get('/analytics/charts').catch(() => ({ data: { data: null } })) // gracefully handle if backend fails
      ]);
      setMetrics(metricsRes.data || metrics);
      setEvents(eventsRes.data || []);
      setChartsData(chartsRes.data || null);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const simulateBatch = async (cohort = 'ALL', count = 120) => {
    try {
      await client.post('/batch/simulate-ingestion', { cohort, count });
      await fetchDashboardData(); // Refresh table and metrics
    } catch (err) {
      setError('Failed to simulate batch ingestion: ' + err.message);
    }
  };

  const triggerDiagnosis = async (leakageEventId) => {
    try {
      const response = await client.post('/recovery/diagnose', { leakageEventId });
      return response.data; // { strategy, workflowId }
    } catch (err) {
      throw new Error(err.message || 'Diagnosis failed');
    }
  };

  const executeStep = async (leakageEventId) => {
    try {
      const response = await client.post('/recovery/execute-step', { leakageEventId });
      return response; // { message, outcome }
    } catch (err) {
      if (err.response && err.response.status === 403) {
         // Halted / Escalated (Max Retries)
         return { outcome: 'ESCALATED', message: err.response.data.message };
      }
      throw new Error(err.message || 'Execution step failed');
    }
  };

  const fetchAuditLogs = async (eventId = null) => {
    try {
      const url = eventId ? `/dashboard/audit-logs?eventId=${eventId}` : '/dashboard/audit-logs';
      const response = await client.get(url);
      setAuditLogs(response.data || []);
    } catch (err) {
      console.error('Failed to fetch audit logs', err);
    }
  };

  const fetchPromises = async () => {
    try {
      const response = await client.get('/promises');
      setPromises(response.data || []);
    } catch (err) {
      console.error('Failed to fetch promises', err);
    }
  };

  const fulfillPromise = async (id) => {
    try {
      await client.post(`/promises/${id}/fulfill`);
      await fetchPromises();
    } catch (err) {
      console.error('Failed to fulfill promise', err);
    }
  };

  const missPromise = async (id) => {
    try {
      await client.post(`/promises/${id}/miss`);
      await fetchPromises();
    } catch (err) {
      console.error('Failed to miss promise', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    metrics,
    events,
    auditLogs,
    chartsData,
    isLoading,
    error,
    fetchDashboardData,
    simulateBatch,
    triggerDiagnosis,
    executeStep,
    fetchAuditLogs,
    promises,
    fetchPromises,
    fulfillPromise,
    missPromise
  };
}
