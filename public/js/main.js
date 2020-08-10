const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const rootName = document.getElementById('room-name');
const userList = document.getElementById('users');

//依据url获取用户登录的房间和用户名
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//加入房间
socket.emit('joinRoom', { username, room });

//获取从服务器发送的room和users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//获得从服务器发送的消息
socket.on('message', (message) => {
  outputMessage(message);
  //滚动条
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//监听消息提交 submit
chatForm.addEventListener('submit', (e) => {
  //取消默认提交事件
  e.preventDefault();
  //获取提交的消息
  const msg = e.target.elements.msg.value;
  socket.emit('chatMessage', msg);
  //清空input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

//创建outputMessage函数 输出消息到dom
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">
        ${message.username}<span>${message.time}</span>
    </p>
    <p class="text">
        ${message.text}
    </p>
    `;
  chatMessages.appendChild(div);
}

//输入房间姓名
function outputRoomName(room) {
  rootName.innerHTML = room;
}

//输出对应的房间里面的用户
function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join('')}
    `;
}
