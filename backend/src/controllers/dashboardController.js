const LeakageEvent = require('../models/LeakageEvent');
const RecoveryWorkflow = require('../models/RecoveryWorkflow');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');

exports.getMetrics = async (req, res) => {
  try {
    const allEvents = await LeakageEvent.find({});
    const allWorkflows = await RecoveryWorkflow.find({});

    let atRisk = 0;
    let recovered = 0;
    let activeAgents = 0;

    allEvents.forEach(event => {
      atRisk += event.riskAmount;
      if (event.status === 'RECOVERED') {
        recovered += event.riskAmount;
      }
    });

    activeAgents = allWorkflows.filter(wf => wf.currentStep < 4).length;
    
    let rate = 0;
    if (atRisk > 0) {
      rate = parseFloat(((recovered / atRisk) * 100).toFixed(1));
    }

    res.status(200).json({
      status: 'success',
      data: {
        atRisk,
        recovered,
        rate,
        activeAgents
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.getAuditLogs = async (req, res) => {
  try {
    const { eventId } = req.query;
    
    let query = {};
    if (eventId) {
      query.leakageEventId = eventId;
    }

    // Return chronologically sorted logs
    const logs = await ImmutableAuditLog.find(query).sort({ timestamp: 1 });
    
    res.status(200).json({
      status: 'success',
      data: logs
    });
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await LeakageEvent.find({}).sort({ createdAt: -1 }).limit(50);
    res.status(200).json({
      status: 'success',
      data: events
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
