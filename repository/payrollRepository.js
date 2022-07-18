if(process.env.NODE_ENV !== 'production'){
    const dotenv = require('dotenv').config({path : `${__dirname}/../.env`});
}
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const Payroll = require('../models/payrollModel');

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
    const payroll = new Payroll(body);
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
    console.log(payroll, searchOptions,"issue paycheck");
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("payroll").collection("payroll");
            try{
                    await payrollCollection.findOneAndUpdate(searchOptions, {$set : {"empPayStatus" : payroll.empPayStatus}} , {new: true, upsert: true}).then((res) => {
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
        const salaryCollection = client.db("payroll").collection("payroll");
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
    console.log(searchOptions, body);
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("payroll").collection("payroll");
            try{
                const emp = await payrollCollection.find(searchOptions).toArray();
                resolve(emp);
            }
            catch{
                reject("Error in promise");
            }
        });
    });
};

const addEmp = async(body) => {
    const payroll = new Payroll(body);
    console.log(body, payroll,"Add");
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("payroll").collection("payroll");
            try{
                await payrollCollection.insertOne(payroll).then((res)=>{
                    console.log(res);
                    if(res.acknowledged){
                        resolve("Employee inserted successfully in Payroll Database.");
                    }else{
                        resolve("Insertion Unsuccessfully.");
                    }
                });
            }
            catch{
                    reject("Error in promise");
            }
        });
    });
};

const updateEmp = async (body) => {
    console.log(body);
    const payroll = new Payroll(body);
    let searchOptions = {};
    if(body.empID != null && body.empID !== ""){
        searchOptions.empID = body.empID;
    }
    // if(body.mail != null && body.mail !== ""){
    //     searchOptions.mail = body.mail;
    // }
    console.log(body, searchOptions, payroll);
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("payroll").collection("payroll");
            try{
                await payrollCollection.findOneAndUpdate(searchOptions, {$set : {"empMail" : payroll.empMail}}).then((res) => {
                    console.log(res);
                    resolve("Updated in Payroll Database.");
                });
            }
            catch{
                reject("Unable to update in Payroll Databse.");
            }
        });
    });
};

const deleteEmp = async (body) => {
    const payroll = new Payroll(body);
    let searchOptions = {};
    if(body.empID != null && body.empID !== ""){
        searchOptions.empID = body.empID;
    }
    console.log(body,searchOptions);
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("payroll").collection("payroll");
            try{
                await updateManager(payroll);
                await payrollCollection.deleteOne(searchOptions).then((res) => {
                    if(res.acknowledged){
                        resolve("Deleted the Employee from Payroll Database");
                    }else{
                        resolve("Unable to delete the Employee from Payroll Database");
                    }
                });
            }
            catch{
                reject("Error in Promise");
            }
        });
    });
};

const updateManager = async (payroll) => {
    let searchOptions = {};
    if(payroll.empID != null && payroll.empID !== ""){
        searchOptions.empManagerID = payroll.empID;
    }
    return new Promise((resolve,reject) => {
        client.connect(async err => {
            const payrollCollection = client.db("payroll").collection("payroll");
            try{
                await payrollCollection.updateMany(searchOptions, 
                    {$set : {empManagerID : payroll.empManagerID, empManager : payroll.empManager }}).then((res) => {
                        console.log(res);
                        resolve("Updated the Manager in Payroll Database");
                })
            }
            catch{
                reject("Error in Promise");
            }
        });
    });
};

module.exports = {
    issuePayCheck,
    allEmp,
    addEmp,
    deleteEmp,
    updateEmp
};