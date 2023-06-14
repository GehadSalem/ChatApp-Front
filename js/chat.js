const baseURL = 'https://chat-app-e2t7.onrender.com/'
const clientIo = io(baseURL)

//Token and headers
const token = `chatBearer__${localStorage.getItem("token")}`
var decoded = jwt_decode(token);
const headers = {
    'Content-Type': 'application/json; charset=UTF-8',
    'authorization': token
}


//images links
const avatar = './avatar/Avatar-No-Background.png'

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
          $('#userPic').attr('src', user.image.secure_url || avatar);
          
        }else{
          alert("fail")
        }
        return user
    }).catch(function (error) {
        console.log(error);
    }) 
}
getUserProfile()

//save socket id
clientIo.emit("updateSocketId", { token })
clientIo.on('auth', data => {
    console.log(data);
})

//collect messageInfo
function sendMessage(destId) {
    console.log({ destId });
    const data = {
        message: $("#messageBody").val(),
        destId,
    }
    axios({
        method: 'post',
        url: `${baseURL}/chat/`,
        data: data,
        headers
    }).then(function (response) {
        console.log({ response });
        const { message, chat } = response.data
        if (message == "Done") {
            console.log("Done");
            if (chat) {
                meImage = chat.POne.image?.secure_url || avatar
                friendImage = chat.PTwo.image?.secure_url || avatar
            }
            const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
            const formattedDate = new Date().toLocaleString('en-US', options);
            const div = document.createElement('div');
            div.className = 'me text-end p-2';
            div.dir = 'rtl';
            div.innerHTML = `
            <li class=" d-inline-block">
                <p class="message-data-time text-left" dir="ltr" id="messageDate">${formattedDate}</p>
                <div class="message other-message float-right">${data.message}</div>
            </li>
            `;
            document.getElementById('messageList').appendChild(div);
            $(".noResult").hide()
            $("#messageBody").val('')
        } else {
            alert("Failed to send this message please check your connection")
        }
    }).catch(function (error) {
        console.log(error);
    });
}

// receive message notifier
clientIo.on("receiveMessage", ({message, id}) => {
    
    if ( document.querySelector(`#about_${id}`)){
        const notifier = document.querySelector(`#about_${id}`);
        const span = document.createElement('span');
        span.className = 'd-inline ms-2';
        span.id = `notifier_${id}`;
        span.innerHTML=`
        <i class="fa-solid fa-circle text-danger" style="font-size: 10px;"></i>
        <span class="visually-hidden">New alerts</span>
        `
        notifier.appendChild(span);
    }
    
    const options = { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    const formattedDate = new Date().toLocaleString('en-US', options);

    if ( document.querySelector('[data-new-id="currentChatList"]')) {
        const div = document.createElement('div');
        div.className = 'myFriend p-2';
        div.dir = 'ltr';
        div.innerHTML= `
            <p class="message-data-time text-left" id="messageDate">${formattedDate}</p>
            <div class="message my-message">${message}</div>                                    
        `;
        messageList.appendChild(div);
        $("#startChat").attr("class", "d-none")
    }
    
});

// ******************************************************************** Show chat conversation
function showData(chat) {
    const messageList = document.getElementById('messageList');
    messageList.setAttribute('data-new-id', 'currentChatList');
    messageList.innerHTML = '';
    if (chat.messages?.length) {
        $(".noResult").hide()
        for (const message of chat.messages) {
            // Parse the sendDate string into a Date object
            const sendDate = new Date(message.sendDate);
            // Format the date string in the desired format
            const formattedDate = sendDate.getDate() + ' ' + sendDate.toLocaleString('default', { month: 'short' }) + ' ' + sendDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
            // Update the sendDate property of the message object with the formatted date string
            message.sendDate = formattedDate;
            if (message.from._id.toString() == decoded.id) {
                const div = document.createElement('div');
                div.className = 'me text-end p-2 pb-0';
                div.dir = 'rtl';
                div.innerHTML = `
                <li class="clearfix">
                    <p class="message-data-time text-right" id="messageDate" dir="ltr">${message.sendDate}</p>
                    <div class="message other-message float-right">${message.message}</div>
                </li>
                
                `;
                messageList.appendChild(div);
            } else {
                const div = document.createElement('div');
                div.className = 'myFriend p-2 pb-0';
                div.dir = 'ltr';
                div.innerHTML = `
                <li class="clearfix">
                    <p class="message-data-time text-left" id="messageDate" >${message.sendDate}</p>
                    <div class="message my-message">${message.message}</div>                                    
                </li>  
                `;
                messageList.appendChild(div);
            }
        }
    } else {
        const div = document.createElement('div');
        div.className = 'noResult text-center  p-2';
        div.dir = 'ltr';
        div.innerHTML = `
        <span class="mx-2" id="startChat">Say Hi to start the conversation.</span>
        `;
        document.getElementById('messageList').appendChild(div);
    }
}

//get chat conversation between 2 users and pass it to ShowData fun
function displayChatUser(userId) {
    console.log({userId});
    axios({
        method: 'get',
        url: `${baseURL}/chat/ovo/${userId}`,
        headers
    }).then(function (response) {
        const { chat, destUser } = response.data
        console.log(destUser);
        if (chat) {
            if (chat.POne._id.toString() == decoded.id) {
                document.getElementById('displayChatName').innerHTML = `
                <img src="${chat.PTwo.image?.secure_url || avatar}" alt="avatar">
                <div class="chat-about">
                    <h6 class="mb-0 chatFirstName">${chat.PTwo.firstName}</h6>
                    <p class="mb-0 chatUserName" onclick="setUserId('${chat.PTwo._id}')">${chat.PTwo.userName}</p>
                </div>
                `
            } else {
                document.getElementById('displayChatName').innerHTML = `
                <img src="${chat.POne.image?.secure_url || avatar}" alt="avatar">
                <div class="chat-about">
                    <h6 class="mb-0 chatFirstName">${chat.POne.firstName}</h6>
                    <p class="mb-0 chatUserName" onclick="setUserId('${chat.POne._id}')">${chat.POne.userName}</p>
                </div>
                `
            }
            if ($(`#notifier_${chat.POne._id}`).hasClass('d-inline') || $(`#notifier_${chat.PTwo._id}`).hasClass('d-inline')) {
                $(`#notifier_${id}`).attr('class', 'd-none')
            }
            showData(chat)
        }else if (destUser.isDeleted) {
            document.getElementById('displayChatName').innerHTML = `
                <img src="${avatar}" alt="avatar">
                <div class="chat-about">
                    <h6 class="mb-0 chatFirstName">undefiend</h6>
                    <p class="mb-0 chatUserName" onclick="setUserId('${destUser._id}')">@undefiend</p>
                </div>
                `
                document.getElementById('messageList').innerHTML = "<p class='text-center undefiendUser'> Undefiend User</p>"
        }else{
            showData(0)
            document.getElementById('displayChatName').innerHTML = `
                <img src="${destUser.image?.secure_url || avatar}" alt="avatar">
                <div class="chat-about">
                    <h6 class="mb-0 chatFirstName">${destUser.firstName}</h6>
                    <p class="mb-0 chatUserName" onclick="setUserId('${destUser._id}')">@${destUser.userName}</p>
                </div>
                `
        }
        document.getElementById("sendMessage").setAttribute("onclick", `sendMessage('${userId}')`);
    }).catch(function (error) {
        console.log(error);
    });
}

// ********************************************************* Show Users list 
// Display Users
function filterUsers(users = [], searchTerm = '') {
    return users.filter(user => {
        if (!user || !user.firstName) {
            return false;
        }
        const firstName = user.firstName.toLowerCase();
        return firstName.includes(searchTerm.toLowerCase());
    });
}

function showUsersData(users = []) {
    let cartonna = ''
    for (let i = 0; i < users.length; i++) {
        cartonna += `
        <li onclick="displayChatUser('${users[i]._id}')" class="clearfix d-flex align-items-center toggelList" data-user-id="${users[i]._id}">
            <img src="${users[i].image?.secure_url || avatar}" alt="avatar">
            
            <div class="about ps-3" id="about_${users[i]._id}">
                <div class=" d-inline">
                    <h6 class="name mb-0">${users[i].firstName}</h6>
                    <p class="userName mb-0 friendProfile"><a class="nav-link me-3" onclick="setUserId('${users[i]._id}')" id="userName">@${users[i].userName}</a></p>
                </div>                                      
            </div>
        </li>
        `
    }
    document.getElementById('chatUsers').innerHTML = cartonna;
    document.getElementById('usersList').innerHTML = cartonna; 
}

function handleSearchInput(event, users) {
    const searchTerm = event.target.value;
    if (searchTerm === '') {
        showUsersData(users);
    } else {
        const filteredUsers = filterUsers(users, searchTerm);
        showUsersData(filteredUsers);
    }
}

function getUsersData() {
    axios({
        method: 'get',
        url: `${baseURL}/user/`,
        headers
    }).then(function (response) {
        console.log({ D: response.data });
        const { users } = response.data
        showUsersData(users)
        
        const searchInput = document.getElementById("searchinput");
        searchInput.addEventListener("input", (event) => {
            handleSearchInput(event, users);
        });
    }).catch(function (error) {
        console.log(error);
    });
}

getUsersData();
function setUserId(userId) {
    localStorage.setItem("friendId", userId);
    window.location.href = 'userProfile.html';
}

$("#toggelUsersList").click(() => {
    $("#usersList").toggleClass('bg-light border usersList');
});
