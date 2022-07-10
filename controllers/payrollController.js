const payrollService = require('../services/payrollService');

const issuePayCheck = async (req,res) => {
    const payCheck = await payrollService.issuePayCheck(req.body);
    res.send(payCheck);
};

const allEmp = async (req,res) => {
    const allEmp = await payrollService.allEmp(req.body);
    res.send(allEmp);
}

module.exports = {
    issuePayCheck,
    allEmp
};