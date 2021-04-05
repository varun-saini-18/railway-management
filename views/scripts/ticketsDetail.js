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
            setTimeout(function(){ document.getElementById("src").innerHTML = data[0].src; },1000);
            setTimeout(function(){ document.getElementById("dest").innerHTML = data[0].dest; },1500); 
            setTimeout(function(){ document.getElementById("coach-num").innerHTML = data[0].Coach_num; },1500); 
            setTimeout(function(){ document.getElementById("seat-num").innerHTML = data[0].Seat_num; },1500); 
            setTimeout(function(){ document.getElementById("seat-type").innerHTML = data[0].Seat_type; },1500); 
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
                        setTimeout(function(){ document.getElementById("src-arr").innerHTML = arr; },500); 
                        setTimeout(function(){ document.getElementById("src-dep").innerHTML = dep; },1000); 
                    }
                    if(result[i].src_station.toLowerCase()===dest.toLowerCase())
                    {
                        const arr = result[i].arr;
                        const dep = result[i].dep;
                        dest_dist = result[i].dist;
                        setTimeout(function(){ document.getElementById("dest-arr").innerHTML = arr; },500); 
                        setTimeout(function(){ document.getElementById("dest-dep").innerHTML = dep; },1000);
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
        }   
    });
}

fillTicketDetail();

