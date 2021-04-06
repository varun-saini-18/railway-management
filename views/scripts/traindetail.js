function loadHTMLTable(data) {

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='14'>No Data</td></tr>";
        return;
    }

    let tableHtml = `<tr>
    <th>Station</th>
    <th>Arrival</th>
    <th>Departure</th>
    <th>Distance</th>
    </tr>`;

    data.forEach(function ({src_station, arr, dep, dist}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${src_station}</td>`;
        tableHtml += `<td>${arr}</td>`;
        tableHtml += `<td>${dep}</td>`;
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
        setTimeout(function(){ document.getElementById("train-detail").innerHTML = '<h4> Here is detail for: <h3>' + result[0].train_name + `(${train_num})</h3></h4>`; },1000);
    });
    fetch(url2)
        .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var result = data.data;
        loadHTMLTable(result);
    });
}

func();