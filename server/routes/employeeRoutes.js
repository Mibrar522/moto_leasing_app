const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { protect, restrictToRoleNames, restrictToFeature, requireDealerScope } = require('../middleware/roleCheck');
const uploadEmployeeDocument = require('../middleware/uploadEmployeeDocument');

router.use(protect, requireDealerScope);

router.get('/', restrictToFeature('FEAT_USER_MGMT'), employeeController.listEmployees);
router.post('/upload-cnic', restrictToRoleNames('SUPER_ADMIN', 'APPLICATION_ADMIN'), restrictToFeature('FEAT_USER_MGMT'), uploadEmployeeDocument.single('employeeDocument'), employeeController.uploadEmployeeDocument);
router.post('/', restrictToRoleNames('SUPER_ADMIN', 'APPLICATION_ADMIN'), restrictToFeature('FEAT_USER_MGMT'), employeeController.createEmployee);
router.put('/:id', restrictToRoleNames('SUPER_ADMIN', 'APPLICATION_ADMIN'), restrictToFeature('FEAT_EMPLOYEE_EDIT'), employeeController.updateEmployee);
router.post('/:id/advances', restrictToRoleNames('SUPER_ADMIN', 'APPLICATION_ADMIN'), restrictToFeature('FEAT_USER_MGMT'), employeeController.createAdvance);
router.post('/:id/generate-salary', restrictToRoleNames('SUPER_ADMIN', 'APPLICATION_ADMIN'), restrictToFeature('FEAT_USER_MGMT'), employeeController.generateSalary);
router.delete('/:id', restrictToRoleNames('SUPER_ADMIN', 'APPLICATION_ADMIN'), restrictToFeature('FEAT_USER_MGMT'), employeeController.deleteEmployee);

module.exports = router;
