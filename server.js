const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const Axios = require("axios")

const UseController = require('./controllers/userController');

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


dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 8500;
const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, {

    useNewUrlParser: true,
    useUnifiedTopology: true,

}, (error) => {
    if (error) {
        console.log('Database Error: ', error.message);
        //errorlevelLogger('Database Error: ' + error.message + " TimeStamp :" + getTimeStamp())
    }
});
app.use(express.static('./public'))
mongoose.connection.once('open', () => {
    console.log('Database Connection Sucessfull');
    // warnlevellogger('Database Connection Sucessfull For Micto Service User Management: ' + " TimeStamp :" + getTimeStamp())
});
app.listen(PORT, () => {

    console.log(`Server is up and runnig on PORT ${PORT}`);
    // warnlevellogger(`Micro Service User Controller Server is up and running on PORT ${PORT}` + " TimeStamp :" + getTimeStamp())
});
app.use('/user', UseController());




app.get('/', (req, res) => {
    res.send('Server Running in kuberntes on Pawani')
    
  })