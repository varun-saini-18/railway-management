// // To specify the starting index
// var start = -1; 

// function myFunc() {
//     var email = document.getElementById('search_state').value;
//     window.location.href = "http://localhost:3000/user_panel/"+email;
// }

// // This function is called to load initial users when the page loads.
// func();

// function func() {
//     start=start+1;
//     var url = '/users_list/'+start;
//     fetch(url)
//         .then(function (response) {
//         return response.json();
//     })
//     .then(function (data) {
//         const users = data.users;
//         console.log(users);
//         for(var i=0;i<users.length;i++)
//         {
//             var url = 'href="/user_panel/'+users[i].email + '"'
//             $('#dynamic_list').append(' <div class="card"><a class="link"' + url +'><div class="center"><h2>'+users[i].name+'</h2></div></a></div><br>');
//         }
//     })
// }

// var working = false;
// console.log('Yes')

// // This function gets call whenever scrollbar touches bottom
// $(window).scroll(function() {
//     if ($(this).scrollTop() + 1 >= $('body').height() - $(window).height()) {
//         if (working == false) {
//             working = true;
//             start=start+1;
//             console.log(start*4+22)
//             var url = '/users_list/'+start;
//             fetch(url)
//             .then(function (response) {
//                 return response.json();
//             })
//             .then(function (data) {
//                 const users = data.users;
//                 console.log(users);
//                 for(var i=0;i<users.length;i++)
//                 {
//                     var url = 'href="/user_panel/'+users[i].email + '"'
//                     $('#dynamic_list').append(' <div class="card"><a class="link"' + url +'><div class="center"><h2>'+users[i].name+'</h2></div></a></div><br>');
//                 }
                
//             })
//             setTimeout(function() {
//                 working = false;
//             }, 100)
//         }
//     }
// })

// function loadHTMLTable(data) {
//     const table = document.querySelector('table tbody');

//     if (data.length === 0) {
//         table.innerHTML = "<tr><td class='no-data' colspan='14'>No Data</td></tr>";
//         return;
//     }

//     let tableHtml = "";

//     data.forEach(function ({ticket_id,train_num, src, dest}) {
//         tableHtml += "<tr>";
//         tableHtml += `<td>${train_num}</td>`;
//         tableHtml += `<td>${src}</td>`;
//         tableHtml += `<td>${dest}</td>`;
//         tableHtml += `<td><a href="/ticketdetail/${train_num}">View</a></td>`;
//         tableHtml += "</tr>";
//     });

//     table.innerHTML = tableHtml;
// }

function func() {
    var link = window.location.href;
    var res = link.split("/ticketdetail/");
    var ticket_id=parseInt(res[1]);
    var url = '/getticket/'+ticket_id;
    fetch(url)
        .then((response) => response.json())
    .then(function (result) {
        data=result.data;
        setTimeout(function(){ document.getElementById("ticket-id").innerHTML = data[0].ticket_id; },10);
        setTimeout(function(){ document.getElementById("train-num").innerHTML = data[0].train_num; },500);
        setTimeout(function(){ document.getElementById("src").innerHTML = data[0].src; },1000);
        setTimeout(function(){ document.getElementById("dest").innerHTML = data[0].dest; },1500); 
        var url = '/gettrainname/'+data[0].train_num;
        fetch(url)
            .then( (response) => response.json())
        .then(function (result) {
            var trainName=result.data;
            setTimeout(function(){ document.getElementById("train-name").innerHTML = trainName[0].train_name; },10);
        })       
    })
}

func();

