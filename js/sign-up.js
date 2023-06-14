const baseURL = 'https://chat-app-e2t7.onrender.com/'

$('#signUp').click( () => {
  const firstName = $('#firstName').val();
  const lastName = $('#lastName').val();
  const email = $('#email').val();
  const password = $('#password').val();
  const cPassword = $('#cPassword').val();
  const age = $('#age').val();
  const gender = $("input[type='radio'][name='gender']:checked").val();
 
  const phone = $('#phone').val();

  const data = {
    firstName,
    lastName,
    email,
    password,
    cPassword,
    age,
    gender,
    phone
  }

  console.log({data});

  axios({
    method: 'post',
    url: `${baseURL}/auth/signup`,
    data: data,
    headers: {'Content-Type': 'application/json; charset=utf-8'}
  }).then(function (response) {
    console.log({response});
    const {message} = response.data
    if(message == 'Done') {
      alert("Done")
      window.location.href = 'sign-in.html';
    } else if (message == 'Email Exist') {
      alert("Email Exist")
    } else {
      console.log('fail to sign up');
      alert(message)
    }
  }).catch(function (error) {
    console.log(error);
  })
});


// axios({
//   method: 'get',
//   url: `${baseURL}/auth/confirmEmail/${token}`,
//   data: data,
//   headers
// }).then(function (response) {
//   console.log({response});
//   const {message, token} = response.data
//   if(message == "Done") {
//     localStorage.setItem("token", token);
//     window.location.href = 'sign-in.html';
//     console.log(data);
//   } else {
//     console.log('In-valid email or password');
//     alert(message)
//   }
// }).catch(function (error) {
//   console.log(error);
// });