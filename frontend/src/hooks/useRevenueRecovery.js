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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [metricsRes, eventsRes] = await Promise.all([
        client.get('/dashboard/metrics'),
        client.get('/dashboard/events')
      ]);
      setMetrics(metricsRes.data || metrics);
      setEvents(eventsRes.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const simulateBatch = async () => {
    try {
      await client.post('/batch/simulate-ingestion');
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

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    metrics,
    events,
    auditLogs,
    isLoading,
    error,
    fetchDashboardData,
    simulateBatch,
    triggerDiagnosis,
    executeStep,
    fetchAuditLogs
  };
}
