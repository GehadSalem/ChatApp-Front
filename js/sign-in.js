const baseURL = 'https://chat-app-e2t7.onrender.com/'
const headers = {'Content-Type': 'application/json; charset=utf-8'}



$('#signIn').click( () => {
  const email = $('#email').val();
  const password = $('#password').val();

  const data = {
    email,
    password
  }

  console.log({data});

  axios({
    method: 'post',
    url: `${baseURL}/auth/signin`,
    data: data,
    headers
  }).then(function (response) {
    console.log({response});
    const {message, token} = response.data
    if (message == "Done") {
      localStorage.setItem("token", token);
      window.location.href = 'chat.html';
    }else {
      console.log('In-valid email or password');
      alert(message)
    }
  }).catch(function (error) {
    console.log(error);
    alert("confirm email first")
    
  })
});




$('#sendEmail').click( () => {
    const email = $('#email').val();
  
    const data = {
        email
      }
    console.log({data});
  
    axios({
      method: 'get',
      url: `${baseURL}/auth/forgotPassword`,
      data: data,
      headers
    }).then(function (response) {
      console.log({response});
      const {message} = response.data
      if(message == "Done") {
        window.location.href = 'confirm-forgot-password.html';
        console.log(data);
      }else {
        console.log('In-valid email');
        alert(message)
      }
    }).catch(function (error) {
      console.log(error);
    })
  });