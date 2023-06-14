const baseURL = 'https://chat-app-e2t7.onrender.com/'

const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'authorization': `chatBearer__${localStorage.getItem('token')}`
}



// const userID = localStorage.getItem('userID')


$('#saveChanges').click( () => {
  const oldPassword = $('#oldPassword').val();
  const newPassword = $('#newPassword').val();
  const cPassword = $('#cPassword').val();

  const data = {
    oldPassword,
    newPassword,
    cPassword
  }

  console.log({data});

  axios({
    method: 'patch',
    url: `${baseURL}/user/password`,
    data: data,
    headers
  }).then(function (response) {
    console.log({response});
    const {message} = response.data
    if(message == 'Done') {
      alert("Done")
      window.location.href = 'profile.html';
    } else {
      console.log('In-valid old password');
      alert(message)
    }
  }).catch(function (error) {
    console.log(error);
  })
});


