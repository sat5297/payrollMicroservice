const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

router.route('/issuePayCheck')
        .post(payrollController.issuePayCheck)

router.route('/allEmp')
        .post(payrollController.allEmp)
        .get(payrollController.allEmp)

router.route('/addEmp')
        .post(payrollController.addEmp)

router.route('/delete')
        .post(payrollController.deleteEmp)
        .delete(payrollController.deleteEmp)

router.route('/update')
        .post(payrollController.updateEmp)
        .patch(payrollController.updateEmp)

module.exports = router;