const mqtt = require('mqtt');
const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const Patient = require('./models/patient');
const randomCoordinates = require('random-coordinates');
const rand = require('random-int');
mongoose.connect("mongodb+srv://ivij:Ish%40nvij11@task.c7clx.mongodb.net", {useNewUrlParser:true, useUnifiedTopology: true });


const bodyParser = require('body-parser');
const app = express();
const port = 5001;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
 extended: true
}));

app.use(express.static('public'));
app.use((req, res, next) => {
 res.header("Access-Control-Allow-Origin", "*");
 res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
 next();
});
app.use(express.static(`${__dirname}/public/generated-docs`));
app.get('/docs', (req, res) => {
 res.sendFile(`${__dirname}/public/generated-docs/index.html`);
});
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
client.on('connect', () => {
    client.subscribe('/RoomData');
 console.log('mqtt connected');
});
/**
* @api {post}/send-command AllDevices An array of all devices
* @apiGroup Device
* @apiSuccessExample {String} Success-Response:
* {
*  published new message
* }
* @apiErrorExample {string} Error-Response:
* {
* null
* }
*/



app.post('/send-command', (req, res) => {
    const { patientId, command } = req.body;
    const topic = `/218303945/command/${patientId}`;
    client.publish(topic, command, () => {
    res.send('published new message');
    });
});



app.post('/send-mealType', (req, res) => {
    const { patientName, mealtype } = req.body;
    const topic = `/218303945/mealtype/${patientName}`;
    client.publish(topic, mealtype, () => {
    res.send('published new message');
    });
   })

   
app.post('/send-specialInstructions', (req, res) => {
    const { patientName, specialinstructions } = req.body;
    const topic = `/218303945/specialinstructions/${patientName}`;
    client.publish(topic, specialinstructions, () => {
        res.send('published new message');
    });
});

client.on('message', (topic, message) => {
    if (topic == '/RoomData') {
    const data = JSON.parse(message);
   
    Patient.findOne({"PatientName": data.patientId }, (err, patient) => {
    if (err) {
    console.log(err)
    }
   
    const { RoomData } = patient;
    const { ts, light_intensity, temp, motion_detected} = data;
    RoomData.push({ ts, light_intensity, temp, motion_detected });
    patient.RoomData = RoomData;
    patient.save(err => {
    if (err) {
    console.log(err)
    }
    });
    });
    }
});

/**
* @api {put}/sensor-data
* @apiGroup Device
* @apiSuccessExample {json} Input:
*[
* {
*  "deviceId": "iPhone"
* }
*]
* @apiSuccessExample {json} Success:
* published new message
* @apiErrorExample {string} Error-Response:
* {
* null
* }
*/
app.put('/room-data', (req, res) => {
    const { patientId } = req.body;
    const ts = new Date().getTime();
    const light_intensity = rand(0, 500);
    const temp = rand(20, 40);
    const motion_detected = rand(0, 1);
    const topic = `/RoomData`;
    const message = JSON.stringify({ patientId, ts, light_intensity, temp, motion_detected });
    client.publish(topic, message, () => {
    res.send('published new message');
    });
   });
   
   

app.listen(port, () => {
 console.log(`listening on port ${port}`);
});