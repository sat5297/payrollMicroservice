const express = require('express');
const router = express.Router();
const payrollController = require('../controllers/payrollController');

router.route('/issuePayCheck')
        .get(payrollController.issuePayCheck)
        .post(payrollController.issuePayCheck)

router.route('/allEmp')
        .get(payrollController.allEmp)
        .post(payrollController.allEmp)

module.exports = router;