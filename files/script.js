document.getElementById("pop").addEventListener("click", () => {
  window.open("popup.html", "PomoInfinity", "height=602,width=352");
});

document.getElementById("addbtnalt").addEventListener("click", () => {
  toglenewclock();
});
document.getElementById("closenewclock").addEventListener("click", () => {
  toglenewclock();
});
document.getElementById("addclockbtn").addEventListener("click", () => {
  if (verifyinput()) {
    addclock();
    clearinput();
  } else {
  }
});
function refreshclosenotif() {
  var closenotifs = document.getElementsByClassName("notifclosebtn");
  for (let index = 0; index < closenotifs.length; index++) {
    closenotifs[index].addEventListener("click", () => {
      closenotifs[index].parentElement.style.display = "none";
    });
  }
}
function refreshpauseclock() {
  var pauseclocks = document.getElementsByClassName("clock");

  Array.from(pauseclocks).forEach(clock => {
    var cid = clock.dataset.cid;
    var playButton = clock.getElementsByClassName("playbtn")[0];
    if (playButton) {
      playButton.addEventListener("click", () => {
        pauseclock(cid);
        console.log(cid);
      });
    }
    var closebtn = clock.getElementsByClassName("closebtn")[0];
    if (closebtn) {
      closebtn.addEventListener("click", () => {
        closetimer();
      });
    }
  });
}


function toglenewclock() {
  var newclockform = document.getElementById("newclockform");
  var addbtninform = document.getElementById("addbtnalt");
  if (newclockform.style.display == "none") {
    newclockform.style.display = "grid";
    addbtninform.style.display = "none";
  } else {
    newclockform.style.display = "none";
    addbtninform.style.display = "flex";
  }
}
var clocks = [];

class Clock {
  constructor() {
    this.clockname = document.getElementById("clockname").value;
    this.clocktime = document.getElementById("clocktime").value.split(":");
    [this.clockhrs, this.clockmins, this.clockseconds] = [
      Number(this.clocktime[0]),
      Number(this.clocktime[1]),
      Number(this.clocktime[2]),
    ];
    this.ispaused = false;
    this.isfinished = false;
    this.createdtime = new Date();
    this.clockid = `CID${this.createdtime.getTime()}`;
    this.isactive = true;
  }
  update() {
    if (!this.ispaused) {
      if (this.clockhrs === 0 && this.clockmins === 0 && this.clockseconds === 0) {
        this.isfinished = true;
        return;
      }

      if (this.clockseconds > 0) {
        this.clockseconds--;
      } else {
        this.clockseconds = 59;

        if (this.clockmins > 0) {
          this.clockmins--;
        } else {
          this.clockmins = 59;

          if (this.clockhrs > 0) {
            this.clockhrs--;
          }
        }
      }
    }


  }
  pause() {
    this.ispaused = !this.ispaused;
  }
  close() {
    this.isactive = false
  }

}
function rearrangeclocks() {

  clocks.sort((a, b) => {
    if (a.ispaused === b.ispaused) {
      return 0;
    }
    return a.ispaused ? 1 : -1;
  });

}

function pauseclock(cid) {
  for (let index = 0; index < clocks.length; index++) {
    if (clocks[index].clockid == cid) {
      clocks[index].pause();
    }
  }
  loadactiveclocks();
  rearrangeclocks();
}

function formatNumber(num) {
  return num.toString().padStart(2, "0");
}
function verifyinput() {
  clockname = document.getElementById("clockname").value;
  clocktime = document.getElementById("clocktime").value;
  if (clockname == "" || clocktime == "00:00:00" || clocktime == "") {
    notif("error", "Missing name or time of clock");
    return false;
  }
  return true;
}
function clearinput() {
  document.getElementById("clockname").value = "";
  document.getElementById("clocktime").value = "00:10:00";
}

const storage = chrome.storage.local;
var storedclock = {
  clocks: clocks,
};
async function addclock() {
  const newclock = new Clock();
  clocks.push(newclock);
  loadactiveclocks();
  toglenewclock();
  refreshpauseclock();
}
const clockcont = document.getElementById("clocklistactive");
// loadactiveclocks();
function loadactiveclocks() {
  clockcont.innerHTML = "";
  for (let i = 0; i < clocks.length; i++) {
    const clockitem = `
   
        <div class="clock"  data-cid="${clocks[i].clockid}">
          <span class="clockname">${clocks[i].clockname}</span>
          <div class="clockdet">
        <img src="files/images/${clocks[i].ispaused == true ? "pause" : "play"}.png" class="playbtn" alt="" />
           <span>${formatNumber(clocks[i].clockhrs) +
      ":" +
      formatNumber(clocks[i].clockmins) +
      ":" +
      formatNumber(clocks[i].clockseconds)
      }</span>
            <img
              src="files/images/x.png"
              class="closebtn"
            
              alt=""
            />
          </div>
        </div>
    `;
    clockcont.innerHTML += clockitem;
  }
  refreshpauseclock();
}
function updatemainclock(_clock) {
  document.getElementById("mainhrs").innerHTML = formatNumber(
    _clock.clockhrs == 0 ? _clock.clockmins : _clock.clockhrs
  );
  document.getElementById("mainmin").innerHTML = formatNumber(
    _clock.clockhrs == 0 ? _clock.clockseconds : _clock.clockmins
  );
}
function everysecond() {
  if (clocks.length > 0) {
    for (let i = 0; i < clocks.length; i++) {
      clocks[i].update();
    }

    updatemainclock(clocks[0]);
    loadactiveclocks();
    // rotate sec time
    var timeangel = (clocks[0].clockseconds / 60) * 360;
    cssroot.style.setProperty("--timeangle", `${timeangel}deg`);
  }

}
const cssroot = document.documentElement;
function startbordersec() {
  cssroot.style.setProperty("--timeangle", "0deg");
}
startbordersec();
function ceatetestclock() {
  addclock();
}
ceatetestclock();
//  notification should be clear automaticly
const notifcont = document.getElementById("notifcont");
// notif("success", "this is a success");
// notif("error", "this is a error");
// notif("alert", "this is a  alert");
function notif(type, text) {
  const notif = `<div class="notif notif${type}">
        <img src="files/images/${type}.png" alt="" />
        <span>${text}</span>
        <img class="notifclosebtn" src="files/images/x.png" alt="" srcset="" />
      </div>`;
  notifcont.innerHTML += notif;
  refreshclosenotif();
}
setInterval(everysecond, 1000);
