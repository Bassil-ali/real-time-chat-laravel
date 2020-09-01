/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');


import Echo from "laravel-echo"

window.io = require('socket.io-client');

window.Echo = new Echo({
    broadcaster: 'socket.io',
    host: window.location.hostname + ':6001'
});
let onlineUserLength = 0;
window.Echo.join('online')
       .here((users) =>{

           onlineUserLength = users.length;
           if(users.length >1){
               $('#no-online-users').css('display','none');
           }
           let userId = $('meta[name=user-id]').attr('content');

           users.forEach(function (user) {
               if(user.id == userId){
                   return;
               }
               $('#online-users').append(`<li id="user-${user.id}" class="list-group-item">${user.name}</li>`);

           })

       })
       .joining((user) =>{
           onlineUserLength++;
           $('#no-online-users').css('display','none');

           $('#online-users').append(`<li  id="user-${user.id}" class="list-group-item">${user.name}</li>`);
       })
        .leaving((user) =>{
            onlineUserLength--;
            if(onlineUserLength =1){
                $('#no-online-users').css('display','block');
            }
          $('#user-' + user.id).remove();
        });
$('#chat-text').keypress(function(e){
    if(e.which ==13){
        e.preventDefault();
        let body =$(this).val();
        let url =$(this).data('url');
        let userName =$('meta[name=user-name]').attr('content');
        $(this).val('');
        let data= {
            '_token': $('meta[name=csrf-token]').attr('content'),
            body
        }

        $('#chat').append(`<div class="mt-4 w-50 text-white p-3 rounded float-right bg-primary"><p>${userName}</p><p>${body}</p></div> <div class="clearfix"></div>`)

        $.ajax({
            url :url,
            method:'post',
            data:data
        })
    }

});
window.Echo.channel('laravel_database_chat-group')

    .listen('MessageDelivered',(e) => {

         $('#chat').append(`  <div class="mt-4 w-50 text-white p-3 rounded float-left bg-secondary }}">
                     <p style="color:#333333;" >${e.message.user.name}</p>
                     <p>${e.message.body}</p>
                 </div>
                 <div class="clearfix"></div>`

         )

    });
