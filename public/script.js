let ul = document.querySelector('#messages > ul');

$(function () {
    var socket = io();
    $('#send').click(function (e) {
        const message = $('#write-msg').val();
        if(message=='')return false;
        let msg = {
            message: message,
        };
        socket.emit('chatMessage', msg);
        $('#write-msg').val('');
        return false;
    });

    socket.on('init', (data) => {
        data.forEach((msg) => {
            addMessage(msg);
        });
    });

    socket.on('chatMessage', function (msg) {
        addMessage(msg);
    });
});

function addMessage(msg) {
    let li = document.createElement("li");
    li.setAttribute("id", "msg");
    let span = document.createElement("span");
    span.setAttribute("id", "time");
    span.innerText = `${msg.date}`;
    li.innerText = `${msg.message}`;
    li.appendChild(span);
    ul.appendChild(li);
    scrolly();
}

function scrolly() {
    let element = document.getElementById("messages");
    element.scrollTop = element.scrollHeight;
}
