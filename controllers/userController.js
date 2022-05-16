const express = require('express');
const router = express.Router();
var _ = require("underscore");
const bcrypt = require('bcrypt');
let User = require('../models/user')
const Axios = require("axios")

function infolevellogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function warnlevellogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}


function generalLevelLogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function fatalLevelLogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function errorlevelLogger(text) {
    const slack = Axios.post(
        'https://hooks.slack.com/services/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', {
        text: text
    }
    );
}

function getTimeStamp() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();

    // prints date in YYYY-MM-DD format


    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return (year + "-" + month + "-" + date + " at " + hours + ":" + minutes + ":" + seconds);
}



const saltRounds = 10;
module.exports = function () {

    router.post("/alertTest", function (req, res) {
        errorlevelLogger("Su[")
        res.status(201).send("Done");
    })

    
    router.post('/add_user', function (req, res) {
        let UserData = new User(req.body);
        User.find(function (err, data) {
            if (!err) {
                var filtered = _.where(data, { Email: req.body.Email });
                var TotalNumberOfUser = Object.keys(filtered).length;

                if (TotalNumberOfUser > 0) {
                    var data = {
                        Status: "Email",
                        Message: "Email Already Exists In The Database"
                    }
                    //generalLevelLogger("Email Already Exists In The Database" + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                } else {
                    bcrypt.hash(req.body.Password, saltRounds, function (err, hash) {
                        UserData.Password = hash
                        UserData.save()
                            .then(User => {
                                var data = {
                                    Status: "Sucess",
                                    Message: "User Created Sucessfully"
                                }
                               // generalLevelLogger("User Created Sucessfully" + " TimeStamp :" + getTimeStamp())
                                res.status(201).send(data);
                            }).catch(err => {
                                var data = {
                                    Status: "Fail",
                                    Message: "Unexpected Error PLease Contact System Admin"

                                }
                              //  errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                                res.status(200).send(data);
                            });
                    })
                }
            } else {
                var data = {
                    Status: "Faiil",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
              //  errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            }
        })
    })
    router.post('/login', function (req, res) {
        User.find({ Email: req.body.Email }, function (err, data) {
            if (!err) {
                var filtered = _.where(data, { Email: req.body.Email });
                var TotalNumberOfUser = Object.keys(filtered).length;
                if (TotalNumberOfUser == 0) {
                    var data = {
                        Status: "Fail",
                        Message: "Invalid Email"
                    }
                   // generalLevelLogger("Invalid Email" + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                } else {
                    hash = filtered[0].Password
                    password = req.body.Password

                    bcrypt.compare(password, hash, function (err, result) {
                        console.log(req.body.Password)

                        if (result == true) {
                            var data = {
                                Status: "Sucess",
                                Message: "Login Sucessfull"
                            }
                            res.status(200).send(data);

                        } else {
                            var data = {
                                Status: "Fail",
                                Message: "Invalid Credentails"
                            }
                           // generalLevelLogger("Invalid Credentails" + " TimeStamp :" + getTimeStamp())
                            res.status(200).send(data);
                        }
                    });

                }

            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
                //errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            }
        })
    })
    router.post('/get_UserData', function (req, res) {
        console.log(req.body)
        User.find(function (err, data) {
            if (!err) {
                var filtered = _.where(data, { Email: req.body.id });
                var TotalNumberOfUser = Object.keys(filtered).length;
                console.log(filtered)
                if (TotalNumberOfUser == 0) {
                    var data = {
                        Status: "Fail",
                        Message: "Invalid Email"
                    }
                   // generalLevelLogger("Invalid Email" + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                } else {
                    console.log(filtered)
                    var data = {
                        Status: "Sucess",
                        Message: "user Data Retrived",
                        data: filtered
                    }
                   // generalLevelLogger("User Data Retrived" + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                }
            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
               // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);
            }
        })
    })



    router.post('/updateUser', function (req, res) {
        try {
            User.updateOne({ Email: req.body.Email }, { Full_Name: req.body.Full_Name, Age: req.body.Age, Phone: req.body.Phone, Sex: req.body.sex }, function (err, docs) {
                if (!err) {
                    var data = {
                        Status: "Sucess",
                        Message: "User Data Updated"
                    }
                   // generalLevelLogger("User Data Updated" + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                } else {
                    var data = {
                        Status: "Fail",
                        Message: "Unexpected Error PLease Contact System Admin"
                    }
                   // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                    res.status(200).send(data);
                }
            })
        } catch {
            var data = {
                Status: "Fail",
                Message: "Unexpected Error PLease Contact System Admin"
            }
           // warnlevellogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
            res.status(200).send(data);

        }
    })




    router.get('/get_all_Users', function (req, res) {
        console.log(req.body)
        User.find(function (err, data) {
            if (!err) {
                var data = {
                    Status: "Sucess",
                    Message: "user Data Retrived",
                    data: data
                }
                res.status(200).send(data);
              //  generalLevelLogger("User Data Rerived" + " TimeStamp :" + getTimeStamp())

            } else {
                var data = {
                    Status: "Fail",
                    Message: "Unexpected Error PLease Contact System Admin"
                }
               // errorlevelLogger("Unexpected Error PLease Contact System Admin " + err + " TimeStamp :" + getTimeStamp())
                res.status(200).send(data);

            }

        })
    })



    return router;
}