const baseURL = 'https://chat-app-e2t7.onrender.com/'

//Token and headers
const token = `chatBearer__${localStorage.getItem("token")}`
var decoded = jwt_decode(token);
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'authorization': token
}



//images links
let avatar = './avatar/Avatar-No-Background.png'

function getUserProfile() {
    axios({
        method: 'get',
        url: `${baseURL}/user/${decoded.id}`,
        headers
    }).then(function (response) {
        const {message, user} = response.data
        console.log(response);
        
        if (message == "Done") {
          $('#firstName').text(user.firstName);
          $('#userName').text('@'+user.userName);
          $('#firstNameContent').text(user.firstName);
          $('#lastNameContent').text(user.lastName);
          $('#userNameContent').text(user.userName);
          $('#bioContent').text(user.userBio);
          $('#emailContent').text(user.email);
          $('#phoneContent').text(user.phone);
          $('#statusContent').text(user.status);
          $('#roleContent').text(user.role);
          $('#genderContent').text(user.gender);
          $('#ageContent').text(user.age);


          document.getElementById("profilePicUpdate").setAttribute("src", `${user.image.secure_url}` || `${avatar}`);
          document.getElementById("userPic").setAttribute("src", `${user.image.secure_url}` || `${avatar}`);
        }else{
          alert("fail")
        }
        return user
    }).catch(function (error) {
        console.log(error);
    }) 

}
getUserProfile()

$('#editProfile').click( () => {
  $(".inputChange").attr('class', 'w-50 d-inline form-control text-info border-info');
  $(".pChange").attr('class', 'd-none');

  const firstNameText = $("#firstNameContent").text();
  const lastNameText = $("#lastNameContent").text();
  const userNameText = $("#userNameContent").text();
  const bioText = $("#bioContent").text();
  const phoneText = $("#phoneContent").text();
  const ageText = $("#ageContent").text();
  
  $("#firstNameInput").val(firstNameText);
  $("#lastNameInput").val(lastNameText);
  $("#userNameInput").val(userNameText);
  $("#bioInput").val(bioText);
  $("#phoneInput").val(phoneText);
  $("#ageInput").val(ageText);

  $("#editProfile").attr('class', 'd-none');
  $("#saveChanges").attr('class', 'd-inline-block btn btn-dark mt-4');

})

$('#saveChanges').click( () => {


  const firstName = $('#firstNameInput').val();
  const lastName = $('#lastNameInput').val();
  const userName = $('#userNameInput').val();
  const userBio = $('#bioInput').val();
  const phone = $('#phoneInput').val();
  const gender = $('#genderInput').val();
  const age = $('#ageInput').val();

  const data = {
    firstName,
    lastName,
    userName,
    userBio,
    phone,
    gender,
    age
  }


  axios({
    method: 'post',
    url: `${baseURL}/user/${decoded.id}`,
    data,
    headers
  }).then(function (response) {
    console.log({response});
    const {message} = response.data
    if(message == "Done") {
      window.location.href = 'profile.html'
    } else {
      console.log('failed to update');
      alert(message)
    }
  }).catch(function (error) {
    console.log(error);
  })
});

const form = document.getElementById("uploadForm")

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  console.log([...formData]);

  axios({
      method: 'patch',
      url: `${baseURL}/user/updateProfilePic`,
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
        'authorization': `chatBearer__${localStorage.getItem('token')}`
      }
    }).then(function (response) {
      console.log({response});
      const {message, user} = response.data
      if(message == "Done") {
        // $("#profilePicUpdate").attr('src', user.image.secure_url)
        window.location.href = 'profile.html'
      } else {
        console.log('failed to upload');
        alert(message)
      }
    }).catch(function (error) {
      console.log(error);
    })
})



// deactivate or soft delete
$('#deactivate').click( () => {

  axios({
    method: 'patch',
    url: `${baseURL}/user`,
    headers
  }).then(function (response) {
    const {message} = response.data
    console.log(message);
    if(message == "Done") {
      alert("your account is deactivated");
      localStorage.removeItem("mytime")
      window.location.href = 'sign-up.html'
    } else {
      console.log('failed to update');
      alert(message)
    }
  }).catch(function (error) {
    console.log(error);
  })
});