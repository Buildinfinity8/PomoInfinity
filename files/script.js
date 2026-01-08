
var localClocks = [];
const cssroot = document.documentElement;

// --- 1. Polling Loop: Ask background for data every second ---
function syncWithBackground() {
  chrome.runtime.sendMessage({ action: "getClocks" }, (response) => {
    if (response && response.clocks) {
      localClocks = response.clocks;
      
      // Update UI functions
      loadactiveclocks();
      loadinactiveclocks();
      
      if (localClocks.length > 0) {
        // Update Main big clock
        updatemainclock(localClocks[0]);
        // Update CSS animation
        
        var timeangel = (localClocks[0].clockseconds / 60) * 360;
        cssroot.style.setProperty("--timeangle", `${timeangel}deg`);
      }
      else{
        console.log("kaya re mama")
      }
    }
  });
}

// Run sync immediately and then every second
syncWithBackground();
setInterval(syncWithBackground, 1000);

// --- 2. Button Handlers (Send messages instead of calling functions) ---

// ADD CLOCK
async function addclock() {
  const name = document.getElementById("clockname").value;
  const time = document.getElementById("clocktime").value;
  
  // Tell background to create it
  chrome.runtime.sendMessage({ action: "add", name: name, time: time }, () => {
    syncWithBackground(); // Update UI immediately
    toglenewclock();
    clearinput();
  });
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
// PAUSE CLOCK
function pauseclock(cid) {
chrome.runtime.sendMessage({action:"pause",id : cid }, async () => {
  await sleep(200);
  syncWithBackground()
})
}

// CLOSE CLOCK
function closetimer(cid) {
  chrome.runtime.sendMessage({ action: "close", id: cid }, async () => {
  await sleep(200);
  syncWithBackground()
});
}

// RESET CLOCK
function resetclock(cid) {
  chrome.runtime.sendMessage({ action: "reset", id: cid },  async () => {
  await sleep(200);
  syncWithBackground()
});
}
function removeclock(cid) {
  chrome.runtime.sendMessage({ action: "remove", id: cid },  async () => {
  await sleep(200);
  syncWithBackground()
});
}
// --- 3. UI Helpers (Mostly unchanged) ---

function formatNumber(num) {
  return num.toString().padStart(2, "0");
}

function loadactiveclocks() {
  const clockcont = document.getElementById("clocklistactive");
  // Use localClocks array received from background
  const htmlContent = localClocks.map(clock => {
    if (!clock.isactive ) return "";
 if (clock.deleted) 
      return ""
    
    const timeDisplay = `${formatNumber(clock.clockhrs)}:${formatNumber(clock.clockmins)}:${formatNumber(clock.clockseconds)}`;
    const iconName = clock.ispaused ? "pause" : "play"; // Note: I swapped this logic slightly to match standard UI icons

    return `
      <div class="clock" data-cid="${clock.clockid}">
        <span class="clockname">${clock.clockname}</span>
        <div class="clockdet">
          <img src="files/images/${iconName}.png" class="playbtn" alt="Toggle Timer" />
          <span>${timeDisplay}</span>
          <img src="files/images/x.png" class="closebtn" alt="Close Timer" />
        </div>
      </div>
    `;
  }).join('');
  clockcont.innerHTML = htmlContent;
  refreshactiveclockbtn();
}

function loadinactiveclocks() {
  const offclockcont = document.getElementById("clocklistinactive");
  const htmlContent = localClocks.map(clock => {
    if (clock.isactive) return "";
    if (clock.deleted) 
      return ""
    
    
    const timeDisplay = `${formatNumber(clock.clockhrs)}:${formatNumber(clock.clockmins)}:${formatNumber(clock.clockseconds)}`;
    return `
      <div class="inactiveclock" data-cid="${clock.clockid}">
        <span class="clockname">${clock.clockname}</span>
        <div class="clockdet">
        <img src="files/images/reset.png" class="restartbtn" alt="Reset">
          <span>${timeDisplay}</span>
          <img src="files/images/trash.png" class="" alt="Reset">
        </div>
      </div>
    `;
  }).join('');
  offclockcont.innerHTML = htmlContent;
  refreshinactiveclockbtn();
}

function updatemainclock(_clock) {
  if (!_clock) return;

  document.getElementById("mainhrs").innerHTML = _clock.isactive== true?  formatNumber(
    _clock.clockhrs == 0 ? _clock.clockmins : _clock.clockhrs
  ) : formatNumber(0);
  document.getElementById("mainmin").innerHTML = _clock.isactive == true? formatNumber(
    _clock.clockhrs == 0 ? _clock.clockseconds : _clock.clockmins
  ): formatNumber(0);
}

// --- Event Listeners (Keep your existing ones) ---
document.getElementById("pop").addEventListener("click", () => {
  window.open("popup.html", "PomoInfinity", "height=602,width=352");
});
document.getElementById("addbtnalt").addEventListener("click", toglenewclock);
document.getElementById("closenewclock").addEventListener("click", toglenewclock);
document.getElementById("addclockbtn").addEventListener("click", () => {
  if (verifyinput()) addclock();
});
var formats = document.getElementsByClassName("format")

Array.from(formats).forEach((ele)=>{
  ele.addEventListener("click" , ()=>{
  var time = ele.dataset.time
  var text = ele.dataset.text
document.getElementById("clockname").value = text
document.getElementById("clocktime").value = time
  })

})

function verifyinput() {
  let cname = document.getElementById("clockname").value;
  let ctime = document.getElementById("clocktime").value;
  if (cname == "" || ctime == "00:00:00" || ctime == "") {
    notif("error", "Missing name or time");
    return false;
  }
  return true;
}

function clearinput() {
  document.getElementById("clockname").value = "";
  document.getElementById("clocktime").value = "00:10:00";
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

// Keep the button refresh logic
function refreshactiveclockbtn() {
  var activeclocks = document.getElementsByClassName("clock");
  Array.from(activeclocks).forEach(clock => {
    var cid = clock.dataset.cid;
    clock.getElementsByClassName("playbtn")[0]?.addEventListener("click", () => pauseclock(cid));
    clock.getElementsByClassName("closebtn")[0]?.addEventListener("click", () => closetimer(cid));
  });
}

function refreshinactiveclockbtn() {
  var inactiveclocks = document.getElementsByClassName("inactiveclock");
  Array.from(inactiveclocks).forEach(clock => {
    var cid = clock.dataset.cid;
    clock.getElementsByClassName("restartbtn")[0]?.addEventListener("click", () => resetclock(cid));
    clock.getElementsByClassName("trashbtn")[0]?.addEventListener("click", () => removeclock(cid));

  });
}

// Notification logic
const notifcont = document.getElementById("notifcont");
function notif(type, text) {
  const notif = `<div class="notif notif${type}">
        <img src="files/images/${type}.png" alt="" />
        <span>${text}</span>
        <img class="notifclosebtn" src="files/images/x.png" alt="" />
      </div>`;
  notifcont.innerHTML += notif;
  var closenotifs = document.getElementsByClassName("notifclosebtn");
  for (let i = 0; i < closenotifs.length; i++) {
    closenotifs[i].addEventListener("click", function() {
      this.parentElement.style.display = "none";
    });
  }
}