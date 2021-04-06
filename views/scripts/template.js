var header = `<header class="w3-container w3-theme w3-padding" id="myHeader">
<i onclick="w3_open()" class="fa fa-bars w3-xlarge w3-button w3-theme"></i>
<div class="w3-center">
  <h4>PROJECT BY VARUN SAINI</h4>
  <h1 class="w3-xxxlarge w3-animate-bottom">RAILWAY MANAGEMENT SYSTEM</h1>
  <!-- <div class="w3-padding-32">
    <button class="w3-btn w3-xlarge w3-dark-grey w3-hover-light-grey" onclick="document.getElementById('id01').style.display='block'" style="font-weight:900;">LEARN W3.CSS</button>
  </div> -->
</div>
</header>`;

var footer = `<footer style="height:50px;bottom:0%;width:100%;" class="w3-container w3-black w3-padding-10">
<p>Project by <a href="https://www.linkedin.com/in/varun-sainii/" target="_blank">Varun Saini</a></p>
</footer>`;

var nav = `<nav class="w3-sidebar w3-bar-block w3-card w3-animate-left w3-center" style="display:none" id="mySidebar">
<h1 class="w3-xxxlarge w3-text-theme">Side Navigation</h1>
<button class="w3-bar-item w3-button" onclick="w3_close()"> <i class="fa fa-remove"></i></button>
<a href="/" class="w3-bar-item w3-button">Home</a>
<a href="/myticketslist" class="w3-bar-item w3-button">My Tickets</a>
<a href="/seatavailability" class="w3-bar-item w3-button">Seat Availability</a>
<a href="/users/logout" class="w3-bar-item w3-button">Logout</a>
</nav>`;

document.getElementById("header").innerHTML = header;
document.getElementById("footer").innerHTML = footer;
document.getElementById("nav").innerHTML = nav;



// Side navigation
function w3_open() {
  var x = document.getElementById("mySidebar");
  x.style.width = "100%";
  x.style.fontSize = "40px";
  x.style.paddingTop = "10%";
  x.style.display = "block";
}
function w3_close() {
  document.getElementById("mySidebar").style.display = "none";
}

// Tabs
function openCity(evt, cityName) {
  var i;
  var x = document.getElementsByClassName("city");
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  var activebtn = document.getElementsByClassName("testbtn");
  for (i = 0; i < x.length; i++) {
    activebtn[i].className = activebtn[i].className.replace(" w3-dark-grey", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " w3-dark-grey";
}

var mybtn = document.getElementsByClassName("testbtn")[0];
// mybtn.click();

// Accordions
function myAccFunc(id) {
  var x = document.getElementById(id);
  if (x.className.indexOf("w3-show") == -1) {
    x.className += " w3-show";
  } else {
    x.className = x.className.replace(" w3-show", "");
  }
}

// Slideshows
var slideIndex = 1;

function plusDivs(n) {
  slideIndex = slideIndex + n;
  showDivs(slideIndex);
}

function showDivs(n) {
  var x = document.getElementsByClassName("mySlides");
  if (n > x.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = x.length };
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  // x[slideIndex - 1].style.display = "block";
}

showDivs(1);

// Progress Bars
function move() {
  var elem = document.getElementById("myBar");
  var width = 5;
  var id = setInterval(frame, 10);
  function frame() {
    if (width == 100) {
      clearInterval(id);
    } else {
      width++;
      elem.style.width = width + '%';
      elem.innerHTML = width * 1 + '%';
    }
  }
}


