import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import KPISummary from './components/KPISummary';
import AnalyticsCharts from './components/AnalyticsCharts';
import TransactionTable from './components/TransactionTable';
import PolicyModal from './components/PolicyModal';
import TimelineModal from './components/TimelineModal';
import AuditTimelineView from './components/AuditTimelineView';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [summary, setSummary] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [policy, setPolicy] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filters state
  const [filters, setFilters] = useState({
    state: '',
    risk_band: '',
    search: ''
  });

  // Timeline modal state
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [timelineLogs, setTimelineLogs] = useState([]);

  // Fetch data
  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      // 1. Analytics Summary
      const summaryRes = await fetch('/api/v1/analytics/summary');
      if (summaryRes.ok) {
        const json = await summaryRes.json();
        setSummary(json.data);
      }

      // 2. Charts
      const chartsRes = await fetch('/api/v1/analytics/charts');
      if (chartsRes.ok) {
        const json = await chartsRes.json();
        setChartData(json.data);
      }

      // 3. Policy
      const policyRes = await fetch('/api/v1/policies');
      if (policyRes.ok) {
        const json = await policyRes.json();
        setPolicy(json.data);
      }

      // 4. Transactions
      await fetchTransactions(page, filters);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchTransactions = async (currentPage, currentFilters) => {
    const query = new URLSearchParams({
      page: currentPage,
      limit: 15,
      ...(currentFilters.state && { state: currentFilters.state }),
      ...(currentFilters.risk_band && { risk_band: currentFilters.risk_band }),
      ...(currentFilters.search && { search: currentFilters.search })
    });

    try {
      const res = await fetch(`/api/v1/transactions?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setTransactions(json.data || []);
        setTotal(json.total || 0);
        setTotalPages(json.totalPages || 1);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    setPage(1);
    fetchTransactions(1, newFilters);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    fetchTransactions(newPage, filters);
  };

  const handleTriggerRecovery = async (paymentId) => {
    try {
      const res = await fetch(`/api/v1/transactions/${paymentId}/trigger-recovery`, { method: 'POST' });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(`Error triggering recovery for ${paymentId}:`, err);
    }
  };

  const handleViewTimeline = async (paymentId) => {
    try {
      const res = await fetch(`/api/v1/transactions/${paymentId}`);
      if (res.ok) {
        const json = await res.json();
        setSelectedTimeline(paymentId);
        setTimelineLogs(json.timeline || []);
      }
    } catch (err) {
      console.error(`Error fetching timeline for ${paymentId}:`, err);
    }
  };

  const handleUpdatePolicy = async (policyPayload) => {
    try {
      const res = await fetch('/api/v1/policies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyPayload)
      });
      if (res.ok) {
        const json = await res.json();
        setPolicy(json.data);
      }
    } catch (err) {
      console.error('Error updating policy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefresh={fetchData}
        isRefreshing={isRefreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        
        {activeTab === 'dashboard' ? (
          <>
            <KPISummary summary={summary} isLoading={isLoading} />
            <AnalyticsCharts chartData={chartData} isLoading={isLoading} />
            <TransactionTable
              transactions={transactions}
              total={total}
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              filters={filters}
              onFilterChange={handleFilterChange}
              onTriggerRecovery={handleTriggerRecovery}
              onViewTimeline={handleViewTimeline}
              isLoading={isLoading}
            />
          </>
        ) : activeTab === 'audit' ? (
          <AuditTimelineView />
        ) : (
          <PolicyModal
            policy={policy}
            onUpdatePolicy={handleUpdatePolicy}
            onClose={() => setActiveTab('dashboard')}
          />
        )}

      </main>

      {/* Timeline Modal Overlay */}
      {selectedTimeline && (
        <TimelineModal
          paymentId={selectedTimeline}
          timeline={timelineLogs}
          onClose={() => setSelectedTimeline(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 py-4 text-center text-xs text-slate-500">
        RecoverX Revenue Recovery Control Plane • Submitted for Razorpay Buildathon 2026
      </footer>
    </div>
  );
}
