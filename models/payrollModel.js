const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    empID : {
        type: String,
        required: true
    },
    empMail : {
        type : String,
        required : true
    }
});

module.exports = new mongoose.model('Payroll', payrollSchema);