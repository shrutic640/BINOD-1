const axios = require('axios');
const randomInt = require('random-int');
setInterval(makePostRequest, 5000);

async function makePostRequest() {
  const NurseName = "Ishan";
  const MedicareNumber = "123265";
  const PatientName = "Kevin Lee";
  const RoomNumber = "32165";
  const ts = Date.now();
  const light_intensity = randomInt(0,500);
  const temp = randomInt(20,40);
  const motion_detected = randomInt(0,1);
  console.log(ts);
  console.log(light_intensity);
  console.log(temp);
  console.log(motion_detected);
  
  const body = {
    NurseName,
    MedicareNumber,
    PatientName,
    RoomNumber,
    ts,
    light_intensity,
    temp,
    motion_detected
  };

  let res = await axios.post('http://localhost:5000/api/patients/RoomData', body);    

}
makePostRequest();