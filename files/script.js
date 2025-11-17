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
  addclock();
});
function refreshclosenotif() {
  var closenotifs = document.getElementsByClassName("notifclosebtn");
  for (let index = 0; index < closenotifs.length; index++) {
    closenotifs[index].addEventListener("click", () => {
      closenotifs[index].parentElement.style.display = "none";
    });
  }
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
const storage = chrome.storage.local;
var storedclock = {
  clocks: clocks,
};
async function addclock() {
  var clockname = document.getElementById("clockname").value;
  var clocktime = document.getElementById("clocktime").value;
  var newdate = new Date();
  var clockid = `CID${newdate.getTime()}`;
  const clock = [clockname, clocktime, clockid];
  clocks.push(clock);

  try {
    await storage.set(storedclock);
    console.log(storedclock);
    const storageresult = await storage.get(["clocks"]);
    notif("success", "Data saved");
    toglenewclock();
  } catch (error) {
    notif("error", `Error saving : ${error}`);
  }
}
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
