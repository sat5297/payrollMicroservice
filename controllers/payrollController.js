const payrollService = require('../services/payrollService');

const issuePayCheck = async (req,res) => {
    const payCheck = await payrollService.issuePayCheck(req.body);
    res.send(payCheck);
};

const allEmp = async (req,res) => {
    const allEmp = await payrollService.allEmp(req.body);
    res.send(allEmp);
};

const addEmp = async (req,res) => {
    const addEmp = await payrollService.addEmp(req.body);
    res.send(addEmp);
};

const deleteEmp = async (req,res) => {
    const del = await payrollService.deleteEmp(req.body);
    res.send(del);
};

const updateEmp = async (req,res) => {
    const update = await payrollService.updateEmp(req.body);
    res.send(update);
};

module.exports = {
    issuePayCheck,
    allEmp,
    addEmp,
    deleteEmp,
    updateEmp
};