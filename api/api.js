const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://ivij:Ish%40nvij11@task.c7clx.mongodb.net", {useNewUrlParser:true, useUnifiedTopology: true });
const Patient = require('./models/patient');
const User = require('./models/user');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = 5000;
app.use(express.static('public'));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-RequestedWith, Content-Type, Accept");
    next();
});

app.get('/api/patients', (req, res) => {
    Patient.find({}, (err, patients) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(patients);
        }
    });
});

app.post('/api/patients', (req, res) => {
    const { NurseName,MedicareNumber, PatientName, RoomNumber, RoomData } = req.body;
    const newPatient = new Patient({
        NurseName,
        MedicareNumber,
        PatientName,
        RoomNumber,
        RoomData
    });
    newPatient.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added patient and data');
    });
});


/**app.post('/api/send-command', (req, res) => {
 console.log(req.body);
});*/
app.post('/api/authenticate', (req, res) => {
    const { user, password } = req.body;
    console.log(req.body);
    User.findOne({ NurseName: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (!found) {
            return res.send('Sorry. We cant find any such username');
        }
        else if (found.password != password) {
            return res.send('The password is invalid');
        }
        else {
            return res.json({
                success: true,
                message: 'Authenticated successfully',
                isAdmin: found.isAdmin
            });
        }
    });
});


app.post('/api/register', (req, res) => {
    const { user, password, isAdmin } = req.body;
    console.log(req.body);
    User.findOne({ NurseName: user }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (found) {
            return res.send('User already exists');
        }
        else {
            const newUser = new User({
                NurseName: user,
                password,
                isAdmin
            });
            newUser.save(err => {
                return err
                    ? res.send(err)
                    : res.json({
                        success: true,
                        message: 'Created new user'
                    });
            });
        }
    });
});

app.get('/api/patients/:patientId/patient-history', (req, res) => {
    const { patientId } = req.params;
    Patient.findOne({ "_id": patientId}, (err, patients) => {
        const { RoomData } = patients;
        return err
            ? res.send(err)
            : res.send(RoomData);
    });
});

app.get('/api/users/:user/patients', (req, res) => {
    const { user } = req.params;
    Patient.find({ "NurseName": user }, (err, patients) => {
        return err
            ? res.send(err)
            : res.send(patients);
    });
});



app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
