const payrollRepository = require('../repository/payrollRepository');

const issuePayCheck = (body) => {
    let payCheck = payrollRepository.issuePayCheck(body);
    return payCheck;
};

const allEmp = (body) => {
    let allEmployees = payrollRepository.allEmp(body);
    return allEmployees;
 };

 const addEmp = (body) => {
    let addEmp = payrollRepository.addEmp(body);
    return addEmp;
 };

 const deleteEmp = (body) => {
    let del = payrollRepository.deleteEmp(body);
    return del;
 };

 const updateEmp = (body) => {
    let update = payrollRepository.updateEmp(body);
    return update;
 }

module.exports = {
    issuePayCheck,
    allEmp,
    addEmp,
    deleteEmp,
    updateEmp
};

