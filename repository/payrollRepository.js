if(process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv').config({path : `${__dirname}/../.env`});
}
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const { resolve, reject } = require('promise');
const req = require('express/lib/request');

const client = new MongoClient(process.env.DATABASE_URL, {
    useNewUrlParser: true, useUnifiedTopology: true 
});

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN
    }
  });

const issuePayCheck = async(body) => {
    let searchOptions = {};
    if(body.empID != null && body.empID !== ""){
        searchOptions.empID = body.empID;
    }
    if(body.empName != null && body.empName !== ""){
        searchOptions.empName = body.empName;
    }
    if(body.empManagerID != null && body.empManagerID !== ""){
        searchOptions.empManagerID = body.empManagerID;
    }
    if(body.empManager != null && body.empManager !== ""){
        searchOptions.empManager = body.empManager;
    }
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("employee").collection("payroll");
            try{
                    await payrollCollection.findOneAndUpdate(searchOptions, {$set : {status : body.status}} , {new: true, upsert: true}).then((res) => {
                        paySalary(body.empID);
                        resolve("Updated Status Successfully");
                    });
            }
            catch{
                    reject("Error in promise");
            }
        });
    });
};

const paySalary = (empID) => {
    console.log(empID);
    client.connect(async err => {
        const salaryCollection = client.db("employee").collection("salary");
        try{
            const totalSalary = await salaryCollection.find({empID}).toArray();
            console.log(totalSalary);
            var mailOptions = {
                from: 'satrat5297@gmail.com',
                to: totalSalary[0].mail,
                subject: `Salary Credited for Employee ${totalSalary[0].empID}`,
                text: 'Your Salary has been credited to your account.'
            };
            transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
            });
        }
        catch{
            console.log("Payment Mail Failure");
        }
    })
};

const allEmp = async(body) => {
    let searchOptions = {};
    if(body.empManagerID != null && body.empManagerID !== ""){
        searchOptions.empManagerID = body.empManagerID;
    }
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("employee").collection("payroll");
            try{
                    const emp = await payrollCollection.find(searchOptions).toArray();
                    resolve(emp);
            }
            catch{
                    reject("Error in promise");
            }
        });
    });
}

module.exports = {
    issuePayCheck,
    allEmp
};