const LeakageEvent = require('../models/LeakageEvent');
const RecoveryWorkflow = require('../models/RecoveryWorkflow');
const ImmutableAuditLog = require('../models/ImmutableAuditLog');

exports.diagnoseRCA = async (req, res) => {
  try {
    const { leakageEventId } = req.body;
    
    if (!leakageEventId) {
      return res.status(400).json({ status: 'error', message: 'leakageEventId is required' });
    }

    const event = await LeakageEvent.findOne({ id: leakageEventId });
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Leakage event not found' });
    }

    // In a real production system, this is where we'd call LangChain/LLaMA/OpenAI API.
    // Simulating RCA logic:
    let recommendedStrategy = 'Dynamic Retry Sequencer';
    if (event.channel === 'OVERDUE_INVOICE') recommendedStrategy = 'Hinglish Voice AI Call';
    else if (event.channel === 'CHECKOUT_ABANDONED') recommendedStrategy = 'WhatsApp Discount Offer';
    else if (event.channel === 'FAILED_SUBSCRIPTION') recommendedStrategy = 'Smart Dunning Email';

    // Create workflow state
    let workflow = await RecoveryWorkflow.findOne({ leakageEventId: event.id });
    if (!workflow) {
      workflow = await RecoveryWorkflow.create({
        leakageEventId: event.id,
        currentStep: 2, // Moves to Step 2: Safety Check
        assignedStrategy: recommendedStrategy
      });
    }

    // Update Event status
    event.status = 'IN_PROGRESS';
    await event.save();

    await ImmutableAuditLog.create({
      leakageEventId: event.id,
      actor: 'RCA_ENGINE',
      logMessage: `RCA completed. Recommended strategy: ${recommendedStrategy}`,
      payload: { strategy: recommendedStrategy }
    });

    res.status(200).json({ 
      status: 'success', 
      data: {
        strategy: recommendedStrategy,
        workflowId: workflow.id
      }
    });

  } catch (error) {
    console.error('Error diagnosing RCA:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during diagnosis' });
  }
};

exports.executeStep = async (req, res) => {
  try {
    const { leakageEventId } = req.body;

    if (!leakageEventId) {
      return res.status(400).json({ status: 'error', message: 'leakageEventId is required' });
    }

    const event = await LeakageEvent.findOne({ id: leakageEventId });
    const workflow = await RecoveryWorkflow.findOne({ leakageEventId });

    if (!event || !workflow) {
      return res.status(404).json({ status: 'error', message: 'Leakage event or workflow not found' });
    }

    // Step 2: Stopping Rule & Safety Check
    if (workflow.currentStep === 2) {
      // Evaluate Rules
      if (workflow.retriesCount >= 3) {
        workflow.stopRuleTriggered = true;
        workflow.currentStep = 4;
        event.status = 'ESCALATED';
        await Promise.all([workflow.save(), event.save()]);

        await ImmutableAuditLog.create({
          leakageEventId: event.id,
          actor: 'STOPPING_RULE_CHECK',
          logMessage: 'Max retries (3) reached. Halting workflow and escalating.',
          reasonCode: 'MAX_RETRIES_EXCEEDED'
        });

        return res.status(403).json({ status: 'error', message: 'Workflow halted. Max retries exceeded.' });
      }

      // Check passed, move to intervention
      workflow.currentStep = 3;
      await workflow.save();

      await ImmutableAuditLog.create({
        leakageEventId: event.id,
        actor: 'STOPPING_RULE_CHECK',
        logMessage: 'Safety checks passed. Proceeding to intervention.',
      });

      return res.status(200).json({ status: 'success', message: 'Safety check passed. Moved to step 3.' });
    }

    // Step 3: Execution Intervention
    if (workflow.currentStep === 3) {
      workflow.retriesCount += 1;
      
      // Simulating intervention outcome
      let outcomeStatus = 'RECOVERED';
      let outcomeMessage = `Action [${workflow.assignedStrategy}] executed successfully.`;
      
      // Example of simulating a failure escalation path for Payment Degradation
      if (event.channel === 'PAYMENT_DEGRADATION' && workflow.retriesCount >= 3) {
        outcomeStatus = 'ESCALATED';
        outcomeMessage = `Action [${workflow.assignedStrategy}] failed after 3 retries.`;
      }

      workflow.currentStep = 4;
      event.status = outcomeStatus;

      await Promise.all([workflow.save(), event.save()]);

      await ImmutableAuditLog.create({
        leakageEventId: event.id,
        actor: 'AI_AGENT',
        logMessage: outcomeMessage,
        payload: { action: workflow.assignedStrategy, attempt: workflow.retriesCount }
      });

      return res.status(200).json({ status: 'success', message: outcomeMessage, outcome: outcomeStatus });
    }

    res.status(400).json({ status: 'error', message: 'Invalid workflow state for execution.' });

  } catch (error) {
    console.error('Error executing step:', error);
    res.status(500).json({ status: 'error', message: 'Internal server error during execution' });
  }
};
