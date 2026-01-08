
// background.js

let clocks = [];

// --- 1. The Clock Logic (Moved here) ---
class Clock {
    constructor(name, timeStr, savedData = {}) {
        this.createdtime = savedData.createdtime ?  savedData.createdtime : new Date().getTime().toString();
        this.clockid = savedData.clockid || `CID${this.createdtime}`;
        this.clockname = name;

        this.clocktime = timeStr.split(":");
        if (savedData.clockhrs !== undefined) {
            this.clockhrs = savedData.clockhrs;
            this.clockmins = savedData.clockmins;
            this.clockseconds = savedData.clockseconds;
        }
        else {
            const parts = timeStr.split(":");
            this.clockhrs = Number(parts[0]);
            this.clockmins = Number(parts[1]);
            this.clockseconds = Number(parts[2]);
        }
        this.ispaused = savedData.ispaused !== undefined ? savedData.ispaused : false;
        this.isfinished = savedData.isfinished !== undefined ? savedData.isfinished : false;
        this.isactive = savedData.isactive !== undefined ? savedData.isactive : true;
        this.deleted = savedData.exists !== undefined ? savedData.exists : false;
    }

    update() {
        if (!this.ispaused && this.isactive) {
            if (this.clockhrs === 0 && this.clockmins === 0 && this.clockseconds === 0) {
                
                this.close()
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

    pause() { this.ispaused = !this.ispaused; }
    close() { this.isactive = false; this.ispaused = true; }
    reset() {
        [this.clockhrs, this.clockmins, this.clockseconds] = [
            Number(this.clocktime[0]),
            Number(this.clocktime[1]),
            Number(this.clocktime[2]),
        ];
        this.ispaused = false;
        this.isfinished = false;
        this.isactive = true;
    }

}

// --- 2. The Main Loop (Runs forever in background) ---
setInterval(() => {
    if (clocks.length > 0) {
        clocks.forEach(clock => clock.update());
    }

    // adding the badge 
    if (clocks.length > 0 && clocks[0].isactive && !clocks[0].ispaused) {
        if (clocks[0].clockhrs > 0) {
            var text = clocks[0].clockhrs.toString().padStart(2, "0") + ":" + clocks[0].clockmins.toString().padStart(2, "0");
        } else {
            var text = clocks[0].clockmins.toString().padStart(2, "0") + ":" + clocks[0].clockseconds.toString().padStart(2, "0");
        }

        chrome.action.setBadgeText({ text: text });
        chrome.action.setBadgeBackgroundColor({ color: "#282828ff" });
    }
    else {
        chrome.action.setBadgeText({ text: "" }); // Clear it if paused
    }
    saveclocks();
}, 1000);
function deletectime(clock) {
    index = clocks.indexOf(clock)
    if (index > -1) {
        clocks.splice(index, 1);

    }

}
function saveclocks() {
    chrome.storage.local.set({ pomoClocks: clocks })
}
function getsavedclocks() {

    chrome.storage.local.get(["pomoClocks"]).then((result) => {
        var pomoclocks = result.pomoClocks
        console.log(pomoclocks);
        pomoclocks.forEach(clock => {
            const newclock = new Clock(clock.clockname, clock.clocktime.join(":"), clock)
            clocks.push(newclock);
        });
    })
}
chrome.runtime.onStartup.addListener(() => {
    console.log("i run alone");
    getsavedclocks()
})
chrome.runtime.onInstalled.addListener(() => {
    console.log("i  alone");
    getsavedclocks()
})





chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // A. Popup asks for data to draw the UI
    if (request.action === "getClocks") {
        sendResponse({ clocks: clocks });
    }

    // B. Popup wants to add a clock
    else if (request.action === "add") {
        const newClock = new Clock(request.name, request.time);
        clocks.push(newClock);
        sendResponse({ status: "success" });
    }

    // C. Popup wants to pause/close/reset
    else {
        const targetClock = clocks.find(c => c.clockid === request.id);
        if (targetClock) {
            if (request.action === "pause") targetClock.pause();
            if (request.action === "close") targetClock.close();
            if (request.action === "reset") targetClock.reset();
            if (request.action === "remove") deletectime(targetClock);

            // Sort logic (rearrange) inside background now
            clocks.sort((a, b) => {
                if (a.ispaused === b.ispaused) return 0;
                return a.ispaused ? 1 : -1;
            });
        }
        sendResponse({ status: "updated" });
    }
});
