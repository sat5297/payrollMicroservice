const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
    empID : {
        type: String,
        required: true
    },
    mail : {
        type : String,
        required : true
    }
});

module.exports = new mongoose.model('Payroll', payrollSchema);