var socket = io()

/* 접속 되었을 때 실행 */
socket.on('connect', function() {
    var name = prompt('반갑습니다!','');
    //사용자의 입력갑슬 받아오는 것

    if(!name){
        name = '익명';
    }

    socket.emit('newUser', name);
});

socket.on('update', function(data) {
    console.log(`${data.name}: ${data.message}`);
    var chat = document.getElementById('chat')
    var message = document.createElement('div')
    var node = document.createTextNode(`${data.name}: ${data.message}`)
    var className = ''

    switch(data.type) {
        case 'message':
          className = 'other';
          break;
    
        case 'connect':
          className = 'connect';
          break;
    
        case 'disconnect':
          className = 'disconnect';
          break;
    }

    message.classList.add(className);
    message.appendChild(node);
    chat.appendChild(message);
});


/* 전송 함수 */
function send() {
  // 입력되어있는 데이터 가져오기
  var message = document.getElementById('test').value;
  console.log(message);
  
  // 가져왔으니 데이터 빈칸으로 변경
  document.getElementById('test').value = '';

   // 내가 전송할 메시지 클라이언트에게 표시
   var chat = document.getElementById('chat')
   var msg = document.createElement('div')
   var node = document.createTextNode(message)
   msg.classList.add('me')
   msg.appendChild(node)
   chat.appendChild(msg)

  socket.emit('message', {type: 'message', massage: message}); //on은 수신 emit는 전송-이벤트명에 신경쓰면 돼
}

