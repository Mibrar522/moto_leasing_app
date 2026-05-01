const express = require('express');
const router = express.Router();
const workflowController = require('../controllers/workflowController');
const { protect, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');

router.use(protect, requireDealerScope);

router.post(
    '/definitions',
    restrictToFeature('FEAT_WORKFLOW_CONFIG'),
    workflowController.saveWorkflowDefinition
);
router.patch(
    '/tasks/:id/approve',
    restrictToFeature('FEAT_WORKFLOW_TASKS'),
    workflowController.approveTask
);
router.patch(
    '/tasks/:id/reject',
    restrictToFeature('FEAT_WORKFLOW_TASKS'),
    workflowController.rejectTask
);

module.exports = router;
