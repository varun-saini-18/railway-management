function loadHTMLTable(data) {
    const table = document.querySelector('table tbody');

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='14'>No Data</td></tr>";
        return;
    }

    let tableHtml = "";

    data.forEach(function ({src_station, arr, dep, dist}) {
        tableHtml += "<tr>";
        tableHtml += `<td>${src_station}</td>`;
        tableHtml += `<td>${arr}</td>`;
        tableHtml += `<td>${dep}</td>`;
        tableHtml += `<td>${dist}</td>`;
        tableHtml += "</tr>";
    });
    table.innerHTML = tableHtml;
}

function func() {
    var link = window.location.href;
    var res = link.split("/traindetail/");
    var train_num = parseInt(res[1]);
    setTimeout(function(){ document.getElementById("train-num").innerHTML = train_num; },1000);
    var url1 = '/gettraindetail/' + train_num;
    var url2 = '/gettrainname/' + train_num;
    fetch(url1)
        .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var result = data.data;
        loadHTMLTable(result);
    });
    fetch(url2)
        .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        var result = data.data;
        setTimeout(function(){ document.getElementById("train-name").innerHTML = result[0].train_name; },1000);
    });
}

func();