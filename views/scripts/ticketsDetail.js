function fillTicketDetail() {
    var link = window.location.href;
    var res = link.split("/ticketdetail/");
    var ticket_id=parseInt(res[1]);
    var url1 = '/getticket/'+ticket_id;
    fetch(url1)
        .then((response) => response.json())
        .then(function (result) {
        data=result.data;
        if(data.length)
        {
            setTimeout(function(){ document.getElementById("ticket-id").innerHTML = data[0].ticket_id; },10);
            setTimeout(function(){ document.getElementById("train-num").innerHTML = `<a href="/traindetail/${data[0].train_num}">${data[0].train_num}</a>`; },500);
            setTimeout(function(){ document.getElementById("src").innerHTML = 'Source Station : ' + data[0].src; },1000);
            setTimeout(function(){ document.getElementById("dest").innerHTML = 'Destination Station : ' + data[0].dest; },1500); 
            setTimeout(function(){ document.getElementById("coach-num").innerHTML = 'Coach Number : ' + data[0].Coach_num; },1500); 
            setTimeout(function(){ document.getElementById("seat-num").innerHTML = 'Seat Number : ' +  data[0].Seat_num; },1500); 
            setTimeout(function(){ document.getElementById("seat-type").innerHTML = 'Seat Type : ' +  data[0].Seat_type; },1500); 
            var url1 = '/gettrainname/'+data[0].train_num;
            var url2 = '/gettraindetail/'+data[0].train_num;
            fetch(url1)
                .then( (response) => response.json())
            .then(function (result) {
                var trainName=result.data;
                setTimeout(function(){ document.getElementById("train-name").innerHTML = trainName[0].train_name; },10);
            })

            fetch(url2)
                .then( (response) => response.json())
            .then(function (result) {
                result = result.data;
                var src = data[0].src;
                var dest = data[0].dest;
                let src_dist,dest_dist;
                for(var i=0;i<result.length;i++)
                {
                    if(result[i].src_station===src)
                    {
                        const arr = result[i].arr;
                        const dep = result[i].dep;
                        src_dist = result[i].dist;
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
                        setTimeout(function(){ document.getElementById("src-arr").innerHTML = 'Arrival : ' + arr_time; },500); 
                        setTimeout(function(){ document.getElementById("src-dep").innerHTML = 'Departure : ' + dep_time; },1000); 
                    }
                    if(result[i].src_station.toLowerCase()===dest.toLowerCase())
                    {
                        const arr = result[i].arr;
                        const dep = result[i].dep;
                        dest_dist = result[i].dist;
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
                        setTimeout(function(){ document.getElementById("dest-arr").innerHTML = arr_time; },500); 
                        setTimeout(function(){ document.getElementById("dest-dep").innerHTML = dep_time; },1000);
                    }
                }
                setTimeout(function(){ document.getElementById("distance").innerHTML = dest_dist-src_dist; },1000);
                setTimeout(function(){ document.getElementById("fare").innerHTML = (dest_dist-src_dist)*2; },1000);
            })  
        }
        else
        {
            document.getElementById("ticket-id").innerHTML = 'Not Found'; 
            document.getElementById("train-num").innerHTML = 'Not Found';
            document.getElementById("src").innerHTML = 'Not Found';
            document.getElementById("dest").innerHTML = 'Not Found';
            document.getElementById("train-name").innerHTML = 'Not Found';
            document.getElementById("fare").innerHTML = 'Not Found';
            document.getElementById("distance").innerHTML = 'Not Found';
            document.getElementById("coach-num").innerHTML = 'Not Found';
        }   
    });
}

fillTicketDetail();

