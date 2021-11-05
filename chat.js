const fs = require('fs'); //파일과 관련된 처리
const express = require('express');
const socket = require('socket.io');
var http = require('http');

const app = express();
// app.set('port', process.env.PORT || 3000);

const server = http.createServer(app);
const io = socket(server);

// let socketList = [];

app.use('/css', express.static(`./static/css`));
app.use('/js', express.static(`./static/js`)); 
// 위 코드는 정적파일을 제공하기위해 미들웨어를 사용하는 코드입니다.
// 실행되는 서버코드기준 디렉토리의 static 폴더 안의 css폴더는 외부 클라이언트들이 /css경로로 액세스 할 수 있습니다

app.get('/', function(request,response){ 
    /*
    express에서 get방식으로 호출 get(경로, 함수) - 경로를 지정해주고 함수를 작성해야합니다. 
    request는 클라이언트에서 전달된 데이터와 정보들이 담겨있습니다
    response에는 클라이언트에게 응답을 위한 정보가 들어있스빈다.
    response.send(전달 데이터)-> 전달할 데이터를 send를 통해 전달하면 다시 클라이언트로 서버가 데이트를 돌려줍니다
    */
    console.log('유저가 접속했습니다');
    // response.send('Hello, express server');
    fs.readFile('./static/index.html', function(err, data){
        if(err){
            response.send('에러');
        }else{
            response.writeHead(200, {'Context-Type':'text/html'});
            response.write(data);
            response.end();
        }
    })
});


io.on('connection', function(socket){ //접속과 동시에 콜백함수로 전달되는 소켓
    console.log('User Join'); 

    socket.on('newUser', function(name){
        console.log(name+'님이 접속하였습니다.');

        socket.name = name;

        io.sockets.emit('update', {type: 'connect', name: 'SERVER', message: name+'님이 접속하였습니다.'});
    });

    socket.on('message', function(data){
        data.name = socket.name;
        console.log(data);

        socket.broadcast.emit('update', data);
    });
    
    socket.on('disconnect', function(){ //disconnect 접속이 끊어지면 자동으로 실행
        console.log(socket.name + '님이 나가셨습니다.');

        socket.broadcast.emit('update', {type: 'disconnect', name: 'SERVER', message: socket.name+"님이 나가셨습니다."}); 
        // 본인을 제외한 나머지 유저에게 데이터를 전송
        //io.sockets.emit()-> 모든 유저 socket.broadcast,emit-> 본인을 제외한 나머지 모두
    });
})


server.listen(3000, function(){
    console.log('Server on!');
});

// io.on('connection', function(socket){
//     socketList.push(socket);
//     console.log('User Join'); 

//     let roomName = null;

//     socket.on('join', function(data){
//         roomName = data;
//         socket.join(data);
//     });

//     socket.on('message', function(msg){
//         io.sockets.in(roomName).emit('message', data);
//         console.log(data);
//     });

//     socket.on('disconnect', function(){
//         console.log('클라이언트 접속 종료');
//     });
// })