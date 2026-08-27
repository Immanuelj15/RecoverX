import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import KPISummary from './components/KPISummary';
import RecoveryPipeline from './components/RecoveryPipeline';
import AIInsightCard from './components/AIInsightCard';
import TransactionTable from './components/TransactionTable';
import AnalyticsCharts from './components/AnalyticsCharts';
import TimelineModal from './components/TimelineModal';
import PolicyModal from './components/PolicyModal';
import AIDecisionsView from './components/AIDecisionsView';
import ModelInsightsView from './components/ModelInsightsView';
import AuditTimelineView from './components/AuditTimelineView';
import { Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [summary, setSummary] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [policy, setPolicy] = useState(null);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [filterState, setFilterState] = useState('');
  const [filterRisk, setFilterRisk] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchDashboardData = async () => {
    setIsRefreshing(true);
    try {
      const [sumRes, chartsRes, polRes] = await Promise.all([
        fetch('/api/v1/analytics/summary').then((r) => r.json()),
        fetch('/api/v1/analytics/charts').then((r) => r.json()),
        fetch('/api/v1/policies').then((r) => r.json())
      ]);

      if (sumRes.status === 'success') setSummary(sumRes.data);
      if (chartsRes.status === 'success') setChartsData(chartsRes.data);
      if (polRes.status === 'success') setPolicy(polRes.data);
    } catch (err) {
      console.error('Error fetching dashboard summary data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    const query = new URLSearchParams({
      page,
      limit: 15,
      ...(filterState && { state: filterState }),
      ...(filterRisk && { risk_band: filterRisk }),
      ...(searchQuery && { search: searchQuery })
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, filterState, filterRisk, searchQuery]);

  const handleTriggerRecovery = async (paymentId) => {
    try {
      showToast(`Executing AI recovery workflow for payment ${paymentId}...`);
      const res = await fetch(`/api/v1/transactions/${paymentId}/trigger-recovery`, {
        method: 'POST'
      });
      const json = await res.json();
      if (res.ok && json.status === 'success') {
        showToast(`✓ Recovery workflow complete for ${paymentId}!`);
        fetchTransactions();
        fetchDashboardData();
      } else {
        showToast(`⚠️ Workflow executed: ${json.error || 'Check policy guardrails'}`);
      }
    } catch (err) {
      showToast(`Error triggering recovery: ${err.message}`);
    }
  };

  const handleSavePolicy = async (policyData) => {
    try {
      const res = await fetch('/api/v1/policies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      });
      if (res.ok) {
        showToast('✓ Guardrail Policy updated successfully!');
        fetchDashboardData();
      }
    } catch (err) {
      console.error('Error updating policy:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F7F9FC] text-[#111827] antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'settings') {
            setIsPolicyOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
      />

      {/* Main App Container */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Navbar */}
        <Navbar
          onRefresh={fetchDashboardData}
          isRefreshing={isRefreshing}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* Toast Notification Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0C2651] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-[#1C4991] flex items-center gap-2 animate-bounce">
            <Sparkles className="w-4 h-4 text-[#635BFF]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-8 max-w-[1400px] w-full mx-auto">
          {/* Overview Dashboard View */}
          {activeTab === 'overview' && (
            <div>
              {/* Page Title & Subtitle */}
              <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Revenue Recovery</h1>
                  <p className="text-sm text-[#667085] mt-1">
                    Monitor failed payments, XGBoost probability scoring, Groq reasoning, and policy controls.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPolicyOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-[#0C2651] bg-[#EEF4FF] hover:bg-[#D0E2FF] border border-[#C7D7FE] rounded-lg transition-all"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#2D6CDF]" />
                    <span>Guardrail Policies</span>
                  </button>
                </div>
              </div>

              {/* 4 Top KPI Metric Cards */}
              <KPISummary summary={summary} isLoading={isRefreshing} />

              {/* AI Recovery Insight Card */}
              <AIInsightCard onOpenPolicy={() => setIsPolicyOpen(true)} />

              {/* Recovery Pipeline Flow */}
              <RecoveryPipeline summary={summary} />

              {/* Performance Charts */}
              <AnalyticsCharts chartsData={chartsData} isLoading={isRefreshing} />

              {/* Transaction Control Table */}
              <TransactionTable
                transactions={transactions}
                total={total}
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                onSelectTransaction={(t) => setSelectedTransaction(t)}
                onTriggerRecovery={handleTriggerRecovery}
                filterState={filterState}
                setFilterState={setFilterState}
                filterRisk={filterRisk}
                setFilterRisk={setFilterRisk}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* Payments & Cases View */}
          {activeTab === 'payments' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Payments & Recovery Cases</h1>
                <p className="text-sm text-[#667085] mt-1">
                  Comprehensive audit table of all failed payments, recovery scores, and intervention statuses.
                </p>
              </div>

              <TransactionTable
                transactions={transactions}
                total={total}
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
                onSelectTransaction={(t) => setSelectedTransaction(t)}
                onTriggerRecovery={handleTriggerRecovery}
                filterState={filterState}
                setFilterState={setFilterState}
                filterRisk={filterRisk}
                setFilterRisk={setFilterRisk}
                isLoading={isLoading}
              />
            </div>
          )}

          {/* AI Decisions View */}
          {activeTab === 'ai-decisions' && (
            <AIDecisionsView transactions={transactions} />
          )}

          {/* Analytics View */}
          {activeTab === 'analytics' && (
            <div>
              <div className="mb-8">
                <h1 className="text-3xl font-extrabold text-[#111827] tracking-tight">Recovery Analytics</h1>
                <p className="text-sm text-[#667085] mt-1">
                  In-depth revenue recovery performance, failure reason breakdown, and payment method stats.
                </p>
              </div>
              <AnalyticsCharts chartsData={chartsData} isLoading={isRefreshing} />
            </div>
          )}

          {/* Audit Trail View */}
          {activeTab === 'audit-trail' && (
            <AuditTimelineView />
          )}

          {/* Model Insights View */}
          {activeTab === 'model-insights' && (
            <ModelInsightsView />
          )}
        </main>
      </div>

      {/* Timeline Inspector Modal */}
      {selectedTransaction && (
        <TimelineModal
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}

      {/* Policy Guardrail Settings Modal */}
      {isPolicyOpen && (
        <PolicyModal
          policy={policy}
          onClose={() => setIsPolicyOpen(false)}
          onSave={handleSavePolicy}
        />
      )}
    </div>
  );
}
