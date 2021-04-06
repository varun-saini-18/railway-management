function loadHTMLTable(data) {

    let tableHtml = `<tr>
    <th>Station</th>
    <th>Arrival</th>
    <th>Departure</th>
    <th>Distance</th>
    </tr>`;

    data.forEach(function ({src_station, arr, dep, dist}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${src_station}</td>`;
        let arr_time = String(Math.ceil(parseInt(arr)/60));
        let arr_time_min = parseInt(arr)%60;
        if(arr_time_min<10)
            arr_time += ':0';
        else
            arr_time += ':';                       
        arr_time+=arr_time_min;
        let dep_time = String(Math.ceil(parseInt(dep)/60));
        let dep_time_min = parseInt(dep)%60;
        if(dep_time_min<10)
            dep_time += ':0';
        else
            dep_time += ':';                       
        dep_time+=dep_time_min;
        tableHtml += `<td>${arr_time}</td>`;
        tableHtml += `<td>${dep_time}</td>`;
        tableHtml += `<td>${dist}</td>`;
        tableHtml += "</tr>";
    });
    document.getElementById("table").innerHTML = tableHtml;
}

function func() {
    var link = window.location.href;
    var res = link.split("/traindetail/");
    var train_num = parseInt(res[1]);
    var url1 = '/gettrainname/' + train_num;
    var url2 = '/gettraindetail/' + train_num;
    fetch(url1)
        .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var result = data.data;
        if(result.length)
        {
            setTimeout(function(){ document.getElementById("train-detail").innerHTML = '<h4> Here are details of: <h3>' + result[0].train_name + `(${train_num})</h3></h4>`; },1000);
            fetch(url2)
                .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                var result = data.data;
                loadHTMLTable(result);
            });
        }
        else
        {
            document.getElementById('id01').style.display='block';
            document.getElementById("table").innerHTML = "";
        }
    });
    
}

func();