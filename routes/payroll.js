const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

router.route('/issuePayCheck')
        .post(payrollController.issuePayCheck)

router.route('/allEmp')
        .post(payrollController.allEmp)

router.route('/addEmp')
        .post(payrollController.addEmp)

router.route('/delete')
        .post(payrollController.deleteEmp)

router.route('/update')
        .post(payrollController.updateEmp)

module.exports = router;