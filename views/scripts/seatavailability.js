$.getJSON("https://api.ipify.org?format=json",
                                    function(data) {
    $("#ip-addr").html(data.ip);
})

function loadHTMLTable(data) {

    if (data.length === 0) {
        // table.innerHTML = "<tr><td class='no-data' colspan='14'>No Data</td></tr>";
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
                        document.getElementById(`${data[i]}-src-arr`).innerHTML = result[j].arr;
                        document.getElementById(`${data[i]}-src-dep`).innerHTML = result[j].dep;
                    }
                    if(result[j].src_station.toLowerCase()===dest.toLowerCase())
                    {
                        document.getElementById(`${data[i]}-dest`).innerHTML = dest;
                        document.getElementById(`${data[i]}-dest-arr`).innerHTML = result[j].arr;
                        document.getElementById(`${data[i]}-dest-dep`).innerHTML = result[j].dep;
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

