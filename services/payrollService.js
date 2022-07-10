const payrollRepository = require('../repository/payrollRepository');

const issuePayCheck = (body) => {
    let payCheck = payrollRepository.issuePayCheck(body);
    return payCheck;
};

const allEmp = (body) => {
    let allEmployees = payrollRepository.allEmp(body);
    return allEmployees;
 }

module.exports = {
    issuePayCheck,
    allEmp
};

