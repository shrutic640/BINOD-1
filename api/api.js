const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://ivij:Ish%40nvij11@task.c7clx.mongodb.net", {useNewUrlParser:true, useUnifiedTopology: true });
const Patient = require('./models/patient');
const Record = require('./models/record');
const Profile = require('./models/profile');
const User = require('./models/user');
const Review = require('./models/review');
const Menu = require('./models/menu');
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




app.get('/api/reviews', (req, res) => {
    Review.find({}, (err, reviews) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(reviews);
        }
    });
});


app.get('/api/menus', (req, res) => {
    Menu.find({}, (err, menus) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(menus);
        }
    });
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

app.get('/api/profiles', (req, res) => {
    Profile.find({}, (err, profiles) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(profiles);
        }
    });
});


app.get('/api/records', (req, res) => {
    Record.find({}, (err, records) => {
        if (err == true) {
            return res.send(err);
        } else {
            return res.send(records);
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


app.post('/api/records', (req, res) => {
    const { FirstName,LastName, Email, PhoneNum, DateOfBirth,Address,Age,Sex,DateOfAddmission} = req.body;
    const newRecord = new Record({
        FirstName,
        LastName,
        Email,
        PhoneNum,
        DateOfBirth,
        Address,
        Age,
        Sex,
        DateOfAddmission
    });
    newRecord.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added patient and data');
    });
});


app.post('/api/reviews', (req, res) => {
    const { NurseName, review } = req.body;
    const newReview = new Review({
        NurseName,
        review
    });
    newReview.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added review');
    });
});



app.post('/api/menus', (req, res) => {
    const { FoodPreference, FoodItem } = req.body;
    const newMenu = new Menu({
        FoodPreference,
        FoodItem
    });
    newMenu.save(err => {
        return err
            ? res.send(err)
            : res.send('successfully added food item');
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

app.post('/api/profiles', (req, res) => {
    const { NurseName,FirstName, LastName, Email, PhoneNum,EmployType, DateOfBirth } = req.body;
    console.log(req.body); 
    
    Profile.findOne({ NurseName: NurseName }, (err, found) => {
        if (err) {
            return res.send(err);
        }
        else if (found) {
            return res.send('Profile already exists');
        }
        else
        {
            const newProfile = new Profile({
                NurseName : NurseName,
                FirstName,
                LastName,
                Email,
                PhoneNum,
                EmployType,
                DateOfBirth
            });

            newProfile.save(err => {
                return err
                    ? res.send(err)
                    : res.send('successfully added profile and data');
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


app.get('/api/users/:user/reviews', (req, res) => {
    const { user } = req.params;
    Reveiw.find({ "NurseName": user }, (err, reveiws) => {
        return err
            ? res.send(err)
            : res.send(reveiws);
    });
});


app.get('/api/menus/:menuId/menu-history', (req, res) => {
    const { menuId } = req.params;
    Menu.findOne({ "_id": menuId}, (err, menus) => {
        const { FoodCalories } = menus;
        return err
            ? res.send(err)
            : res.send(FoodCalories);
    });
});


app.get('/api/users/:user/menus', (req, res) => {
    const { user } = req.params;
    Menu.find({ "NurseName": user }, (err, menus) => {
        return err
            ? res.send(err)
            : res.send(menus);
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

app.get('/api/profiles/:profileId/profile-history', (req, res) => {
    const { profileId } = req.params;
    Profile.findOne({ "_id": profileId}, (err, profiles) => {
        return err
            ? res.send(err)
            : res.send();
    });
});

app.get('/api/records/:recordId/record-history', (req, res) => {
    const { recordId } = req.params;
    Record.findOne({ "_id": recordId}, (err, records) => {
        return err
            ? res.send(err)
            : res.send();
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


app.get('/api/users/:user/profiles', (req, res) => {
    const { user } = req.params;
    Profile.find({ "NurseName": user }, (err, profiles) => {
        return err
            ? res.send(err)
            : res.send(profiles);
    });
});

app.post('/api/patients/RoomData', (req, res) => {
        
    console.log(req.body.ts)
    console.log(req.body.light_intensity)
    console.log(req.body.temp)
    console.log(req.body.motion_detected)
    const NurseName = req.body.NurseName;
    const MedicareNumber = req.body.MedicareNumber;
    const PatientName = req.body.PatientName;
    const ts = req.body.ts;
    const light_intensity = req.body.light_intensity;
    const temp = req.body.temp;
    const motion_detected = req.body.motion_detected;

    console.log(ts)
    console.log(light_intensity)
    console.log(temp)
    console.log(motion_detected)

    Patient.findOne({ "PatientName": PatientName }, (err, patient) => {
    if (err) {
        console.log(err)
    }
        const { RoomData } = patient;
        console.log(RoomData);

        RoomData.push({ ts, light_intensity, temp, motion_detected });

        console.log(RoomData)
        patient.RoomData = RoomData;
        console.log(patient.RoomData);
    
    
    patient.save(err => {
        return err
            ? res.send(err)
            : res.send(RoomData);
    });
});
})

 
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
