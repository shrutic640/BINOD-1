$('#navbar').load('navbar.html');
$('#footer').load('footer.html');
const API_URL = 'http://localhost:5000/api';
const MQTT_URL = 'http://localhost:5001/send-command';

const patients = JSON.parse(localStorage.getItem('patients')) || [];
const users = JSON.parse(localStorage.getItem('users')) || [];
const profiles = JSON.parse(localStorage.getItem('profiles')) || [];


$.get(`${API_URL}/reviews`).then(response => {
  response.forEach(review => {
    $('#reviews tbody').append(`      
    <tr>         
    <td>${review.NurseName}</td>        
     <td>${review.review}</td>     
      </tr>`
    );
  });
}).catch(error => {
  console.error(`Error: ${error}`);
});


$.get(`${API_URL}/menus`).then(response => {
  response.forEach(menu => {
    $('#menus tbody').append(`      
            <tr>         
            <td>${menu.FoodPreference}</td>        
             <td>${menu.FoodItem}</td>     
             <td> 
             
              </tr>`
    );
  });
}).catch(error => {
  console.error(`Error: ${error}`);
});


  
$.get('/auth/google/user', (res)=>{
  console.log("get runs");
  const logGoogle = localStorage.getItem('logGoogle');
  console.log("Log google is apparently "+logGoogle);
  if (logGoogle){
      console.log("This is true");
      localStorage.setItem('user',res.name);
      localStorage.setItem('isAdmin',res.isAdmin);
      localStorage.setItem('isAuthenticated',true);
  }
});


const currentUser = localStorage.getItem('user');

if (localStorage.getItem('logGoogle')) {
  const currentUser = localStorage.getItem('user');
  $.get(`${API_URL}/users/${currentUser}/patients`)
  .then(response => {
    response.forEach((patient)=> {
    $('#patients tbody').append(`
    <tr data-patient-id=${patient._id}>
          <td>${patient.NurseName}</td>
          <td>${patient.MedicareNumber}</td>
            <td>${patient.PatientName}</td>
            <td>${patient.RoomNumber}</td>
          </tr>`
  );
});
$('#patients tbody tr').on('click', (e) => {
  const patientId = e.currentTarget.getAttribute('data-patient-id');
  $.get(`${API_URL}/patients/${patientId}/patient-history`)
    .then(response => {
      response.map(RoomData => {
        $('#historyContent').append(`
        <tr>
          <td>${RoomData.ts}</td>
          <td>${RoomData.light_intensity}</td>
          <td>${RoomData.temp}</td>
          <td>${RoomData.motion_detected}</td>
        </tr>
      `);
      });
      $('#historyModal').modal('show');
    });
});
})
.catch(error => {
console.error(`Error: ${error}`);
});
}


else if (currentUser) {
  console.log(currentUser)
  $.get(`${API_URL}/users/${currentUser}/patients`)
    .then(response => {
      response.forEach((patient) => {
        $('#patients tbody').append(`
          <tr data-patient-id=${patient._id}>
          <td>${patient.NurseName}</td>
          <td>${patient.MedicareNumber}</td>
            <td>${patient.PatientName}</td>
            <td>${patient.RoomNumber}</td>
          </tr>`
        );
      });
      $('#patients tbody tr').on('click', (e) => { 
        const patientId = e.currentTarget.getAttribute('data-patient-id');
        $.get(`${API_URL}/patients/${patientId}/patient-history`)
          .then(response => {
            response.map(RoomData => {
              $('#historyContent').append(`
              <tr>
                <td>${RoomData.ts}</td>
                <td>${RoomData.light_intensity}</td>
                <td>${RoomData.temp}</td>
                <td>${RoomData.motion_detected}</td>
              </tr>
            `);
            });
            $('#historyModal').modal('show');
          });
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
} else {
  const path = window.location.pathname;
  if (path !== '/login' && path !== '/registration') {
    location.href = '/login';
  }
}

if (currentUser) {
  console.log(currentUser)
  $.get(`${API_URL}/users/${currentUser}/profiles`)
    .then(response => {
      response.forEach((profile) => {
        $('#profiles tbody').append(`
          <tr data-profile-id=${profile._id}>
          <td>${profile.NurseName}</td>
          <td>${profile.FirstName}</td>
            <td>${profile.LastName}</td>
            <td>${profile.Email}</td>
            <td>${profile.PhoneNum}</td>
            <td>${profile.EmployType}</td>
            <td>${profile.DateOfBirth}</td>
          </tr>`
        );
      });
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
} 




$('#add-review').on('click', () => {
  const NurseName = $('#NurseName').val();
  const review = $('#review').val();
  const body = {
    NurseName,
    review
  };

  $.post(`${API_URL}/reviews`, body)
    .then(response => {
      location.href = '/reviews';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
})



$('#send-command').on("click", function () {
  const command = $('#command').val();
  const patientName = $('#patientName').val();
  $.post(`${MQTT_URL}/send-command`, { patientName, command })
      .then(response => {
          console.log(response);
      })
  console.log(`command is ${command}`);
});


$('#send-command').on("click", function () {
  const mealtype = $('#mealtype').val();
  const patientName = $('#patientName').val();
  $.post(`${MQTT_URL}/send-mealType`, { patientName, mealtype })
      .then(response => {
          console.log(response);
      })
  console.log(`command is ${mealtype}`);
});

$('#send-command').on("click", function () {
  const specialinstructions = $('#specialinstructions').val();
  const patientName = $('#patientName').val();
  $.post(`${MQTT_URL}/send-specialinstructions`, { patientName, specialinstructions })
      .then(response => {
          console.log(response);
      })
  console.log(`command is ${specialinstructions}`);
});

$('#add-patient').on('click', () => {
  const NurseName = $('#NurseName').val();
  const MedicareNumber = $('#MedicareNumber').val();
  const PatientName = $('#PatientName').val();
  const RoomNumber = $('#RoomNumber').val();
  const RoomData = [];
  const body = {
    NurseName,
    MedicareNumber,
    PatientName,
    RoomNumber,
    RoomData
};

  $.post(`${API_URL}/patients`, body)
    .then(response => {
      location.href = '/device-list';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
})

$('#add-record').on('click', () => {
  const FirstName = $('#FirstName').val();
  const LastName = $('#LastName').val();
  const Email = $('#Email').val();
  const PhoneNum = $('#PhoneNum').val();
  const DateOfBirth = $('#DateOfBirth').val();
  const Address = $('#Address').val();
  const Age = $('#Age').val();
  const Sex = $('#Sex').val();
  const DateOfAddmission = $('#DateOfAddmission').val();


  const body = {
    FirstName,
    LastName,
    Email,
    PhoneNum,
    DateOfBirth,
    Address,
    Age,
    Sex,
    DateOfAddmission
};

  $.post(`${API_URL}/records`, body)
    .then(response => {
      location.href = '/record';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
})

$.get(`${API_URL}/records`).then(response => 
  {
     response.forEach(record => {
        $('#records tbody').append(`
        <tr>
           <td>${record.FirstName}</td>
           <td>${record.LastName}</td>
           <td>${record.Email}</td>
           <td>${record.PhoneNum}</td>
           <td>${record.DateOfBirth}</td>
           <td>${record.Address}</td>
           <td>${record.Age}</td>
           <td>${record.Sex}</td>
           <td>${record.DateOfAddmission}</td>

        </tr>`
        );
     });
  })
  .catch(error => {
   console.error(`Error: ${error}`);
  });

$('#add-profile').on('click', () => {
  const NurseName = $('#NurseName').val();
  const FirstName = $('#FirstName').val();
  const LastName = $('#LastName').val();
  const Email = $('#Email').val();
  const PhoneNum = $('#PhoneNum').val();
  const EmployType = $('#EmployType').val();
  const DateOfBirth = $('#DateOfBirth').val();
  const body = {
    NurseName,
    FirstName,
    LastName,
    Email,
    PhoneNum,
    EmployType,
    DateOfBirth
};

  $.post(`${API_URL}/profiles`, body)
    .then(response => {
      location.href = '/profile';
    })
    .catch(error => {
      console.error(`Error: ${error}`);
    });
})

$('#new-profile').on('click', () => {
  location.href = '/addProfile';
})
/** 
$('#send-command').on('click', function () {
  const deviceId = $('#deviceId').val();
  const command = $('#command').val();

  $.post(`${MQTT_URL}`, { deviceId, command })
    .then((response) => {
      if (response.success) {
        location.href = '/';
      }
    })
});
*/
$('#register').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  const confirm = $('#confirm').val();

  if (password !== confirm) {
    $('#message').append('<p class="alert alert-danger">Passwords do not match</p>');
  } 

  else if (user.length == 0) {
    $('#message').append('<p class="alert alert-danger">You forgot to write username</p>');
  }

  else if (password.length == 0) {
    $('#message').append('<p class="alert alert-danger">You forgot to write password</p>');
  }

  else if (password.length < 6) {
    $('#message').append('<p class="alert alert-danger">Passwords should be Atleast 6 letters</p>');
  }
  else {
    $.post(`${API_URL}/register`, { user, password })
      .then((response) => {
        if (response.success) {
          location.href = '/login';
        } else {
          $('#message').append(`<p class="alert alert-danger">${response}</p>`);
        }
      });
  }
});



/*$('#login').on('click',function(){
    const username = $('#username').val();
    const password = $('#password').val();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const exist = users.find(user => user.username === username);
    const exists = users.find(user => user.password === password);
    if(exist == undefined )
    {
        $("#message").text("User doesn't exist");
    }
    else
    {
        if(exists == undefined)
        {
            $("#message").text("Password does not match.");
        }
        else
        {
            localStorage.setItem('isAuthenticated', JSON.stringify(true));
            location.href = '/'
        }
    }
});*/
$('#login').on('click', () => {
  const user = $('#user').val();
  const password = $('#password').val();
  $.post(`${API_URL}/authenticate`, { user, password })
    .then((response) => {
      if (response.success) {
        localStorage.setItem('user', user);
        localStorage.setItem('isAdmin', response.isAdmin);
        location.href = '/profileDisplay';
      } else {
        $('#message').append(`<p class="alert alert-danger">${response}
   </p>`);
      }
    });
});

$('#Googlelogin').on('click', (req,res)=> {
  localStorage.setItem('logGoogle',true);
  location.href ='/auth/google';
});

const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('logGoogle');
  location.href = '/';
}
