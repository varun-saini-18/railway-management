$.getJSON("https://api.ipify.org?format=json",
                                    function(data) {
    $("#ip-addr").html(data.ip);
})

function bookTicket(id)
{
    let train_num = id.split("-book-ticket");
    train_num = train_num[0];
    let src = document.getElementById(`${train_num}-src`).innerText;
    let dest = document.getElementById(`${train_num}-dest`).innerText;
    document.getElementById(`modal-h1`).innerHTML = 'Wait....';
    document.getElementById(`modal-h4`).innerHTML = 'We are trying to book your ticket!';
    document.getElementById(`modal-h5`).innerHTML = 'Thanks for showing patience.';
    document.getElementById(`modal-span`).innerHTML = '';
    document.getElementById('id01').style.display='block';
    const url = '/bookticket';
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            "train_num" : train_num,
            "src" : src,
            "dest" : dest
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())  
    .then(json =>  json.data)
    .then((data) => {
        if(!!data.id)
        {
            document.getElementById(`modal-h1`).innerHTML = 'Success';
            document.getElementById(`modal-h4`).innerHTML = 'Your ticket was successfuly booked!';
            document.getElementById(`modal-h5`).innerHTML = `See your ticket <a href="/ticketdetail/${data.id}">"here"</a>`;
            document.getElementById(`modal-span`).innerHTML = `<span onclick="document.getElementById('id01').style.display='none'"class="w3-button w3-display-topright">x</span>`;    
        }
        else
        {
            document.getElementById(`modal-h1`).innerHTML = 'Sorry';
            document.getElementById(`modal-h4`).innerHTML = 'There was some issue while booking your ticket!';
            document.getElementById(`modal-h5`).innerHTML = 'You can try again!';
            document.getElementById(`modal-span`).innerHTML = `<span onclick="document.getElementById('id01').style.display='none'"class="w3-button w3-display-topright">x</span>`;    
        }
    })
}

function loadHTMLTable(data) {

    if (data.length === 0) {
        document.getElementById(`modal-h1`).innerHTML = 'Oh ho!';
        document.getElementById(`modal-h4`).innerHTML = 'Sorry there are no trains on this route.';
        document.getElementById(`modal-h5`).innerHTML = 'Please try other routes.';
        document.getElementById(`modal-span`).innerHTML = `<span onclick="document.getElementById('id01').style.display='none'"class="w3-button w3-display-topright">x</span>`;
        document.getElementById('id01').style.display='block';
        document.getElementById("table").innerHTML = "";
        return;
    }

    let tableHtml = `<tr>
    <th>Train Number</th>
    <th>Source</th>
    <th>Source Arr</th>
    <th>Source Dep</th>
    <th>Destination</th>
    <th>Destination Arr</th>
    <th>Destination Dep</th>
    <th>Book Ticket?</th>
    </tr>`;

    data.forEach(function (data) {
        tableHtml += "<tr>";
        tableHtml += `<td><a href="/traindetail/${data}">${data}</a></td>`;
        tableHtml += `<td id="${data}-src"></td>`;
        tableHtml += `<td id="${data}-src-arr"></td>`;
        tableHtml += `<td id="${data}-src-dep"></td>`;
        tableHtml += `<td id="${data}-dest"></td>`;
        tableHtml += `<td id="${data}-dest-arr"></td>`;
        tableHtml += `<td id="${data}-dest-dep"></td>`;
        tableHtml += `<td ><button id="${data}-book-ticket" onClick="bookTicket(this.id);">Book Ticket</button></td>`;
        tableHtml += "</tr>";
    });
    document.getElementById("table").innerHTML = tableHtml;
}

function searchTrains() {
    var src = document.getElementById("src").value;
    var dest = document.getElementById("dest").value;
    var url = `/searchtrains/${src}+${dest}`;
    
    fetch(url)
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        data = data.data;
        document.getElementById("table").style.display = "";
        loadHTMLTable(data);
        for(let i=0;i<data.length;i++)
        {
            var url1 = '/gettraindetail/' + data[i];
            // var url2 = '/gettrainname/' + train_num;
            fetch(url1)
                .then(function (response) {
                return response.json();
            })
            .then(function (data1) {
                var result = data1.data;
                for(let j=0;j<result.length;j++)
                {
                    if(result[j].src_station.toLowerCase()===src.toLowerCase())
                    {
                        document.getElementById(`${data[i]}-src`).innerHTML = src;
                        let arr_time = String(Math.ceil(parseInt(result[j].arr)/60));
                        let arr_time_min = parseInt(result[j].arr)%60;
                        if(arr_time_min<10)
                            arr_time += ':0';
                        else
                            arr_time += ':';                       
                        arr_time+=arr_time_min;
                        let dep_time = String(Math.ceil(parseInt(result[j].dep)/60));
                        let dep_time_min = parseInt(result[j].dep)%60;
                        if(dep_time_min<10)
                            dep_time += ':0';
                        else
                            dep_time += ':';                       
                        dep_time+=dep_time_min;
                        document.getElementById(`${data[i]}-src-arr`).innerHTML = arr_time;
                        document.getElementById(`${data[i]}-src-dep`).innerHTML = dep_time;
                    }
                    if(result[j].src_station.toLowerCase()===dest.toLowerCase())
                    {
                        document.getElementById(`${data[i]}-dest`).innerHTML = dest;
                        let arr_time = String(Math.ceil(parseInt(result[j].arr)/60));
                        let arr_time_min = parseInt(result[j].arr)%60;
                        if(arr_time_min<10)
                            arr_time += ':0';
                        else
                            arr_time += ':';                       
                        arr_time+=arr_time_min;
                        let dep_time = String(Math.ceil(parseInt(result[j].dep)/60));
                        let dep_time_min = parseInt(result[j].dep)%60;
                        if(dep_time_min<10)
                            dep_time += ':0';
                        else
                            dep_time += ':';                       
                        dep_time+=dep_time_min;
                        document.getElementById(`${data[i]}-dest-arr`).innerHTML = arr_time;
                        document.getElementById(`${data[i]}-dest-dep`).innerHTML = dep_time;
                    }
                }
            });
        }
    })
}

function loadStations()
{
    fetch('/getstations')
    .then(response => response.json())
    .then(data => {
        data = data.data;
        let src = '<option value="0">Select Src</option>';
        let dest = '<option value="0">Select Dest</option>';
        for(let i=0;i<data.length;i++)
        {
            src+=`<option value="${data[i].name}">${data[i].name}</option>`
            dest+=`<option value="${data[i].name}">${data[i].name}</option>`
        }
        document.getElementById("src").innerHTML = src;
        document.getElementById("dest").innerHTML = dest;
    });
}


loadStations();

