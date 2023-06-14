const baseURL = 'https://chat-app-e2t7.onrender.com/'

//Token and headers
const friendId = localStorage.getItem("friendId");
console.log(friendId);
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

function getFriendProfile() {
  axios({
      method: 'get',
      url: `${baseURL}/user/friendProfile/${friendId}`,
      headers
  }).then(function (response) {
      const {message, user} = response.data
      console.log(response);
      if (user.isDeleted) {
        document.getElementById("isDeleted").innerHTML = "<p class='text-center p-3 mb-0 undefiendUser'>Undefiend</p>"
        document.getElementById("profilePicUpdate").setAttribute("src", `${avatar}`);
        $('#actionButtons').attr('class', 'd-none')
      }else if (message == "Done") {
        
        $('#firstNameContent').text(user.firstName);
        $('#lastNameContent').text(user.lastName);
        $('#userNameContent').text(user.userName);
        $('#bioContent').text(user.userBio);
        $('#statusContent').text(user.status);
        $('#roleContent').text(user.role);
        $('#genderContent').text(user.gender);
        $('#ageContent').text(user.age);


        document.getElementById("profilePicUpdate").setAttribute("src", `${user.image.secure_url}` || `${avatar}`);
      }else{
        alert("fail")
      }
      return user
  }).catch(function (error) {
      console.log(error);
  }) 

}
getFriendProfile()

