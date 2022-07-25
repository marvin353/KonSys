//------------------------------------ Global Variables and Init Functions ------------------------------------\\

var ctw_value = "table"; //"car", "walk"
var defaultTags = {};

cwt();
//------------------------------------ HTML Element Event Listeners ------------------------------------\\

document.getElementById("requestBtn").addEventListener("click", permission);

document.getElementById("tableBtn").addEventListener("click", () => {
    ctw_value = "table";
    cwt();
});
document.getElementById("carBtn").addEventListener("click", () => {
    ctw_value = "car";
    cwt();
});
document.getElementById("walkBtn").addEventListener("click", () => {
    ctw_value = "walk";
    cwt();
});

document.getElementById("Upload_Switch").onchange = function () {
    if (this.checked) {
        start_recording();
    } else {
        stop_recording();
    }
};
/*document
  .getElementById("DeviceOrientation_Switch")
  .addEventListener("change", device_orientation_switched);
document
  .getElementById("DeviceMotion_Switch")
  .addEventListener("change", device_motion_switched);*/

//------------------------------------ Mobile Meta Data and Sensors ------------------------------------\\

const MobileDetect = require("mobile-detect");
const mobile = new MobileDetect(window.navigator.userAgent);

if (mobile.mobile()) {
    defaultTags.mobile = mobile.mobile();
}

if (mobile.userAgent()) {
    defaultTags.browser = mobile.userAgent();
}

const sensors = {
    deviceorientation: {
        listener: function (/** @type {DeviceOrientationEvent} */ evt) {
            if (evt.alpha === null) return;
            record(
                evt.type,
                {
                    alpha: evt.alpha,
                    beta: evt.beta,
                    gamma: evt.gamma
                },
                evt.timeStamp + performance.timing.navigationStart
            );
        }
    },
    devicemotion: {
        listener: function (/** @type {DeviceMotionEvent} */ evt) {
            if (evt.acceleration.x === null) return;
            record(
                evt.type,
                {
                    x0: evt.acceleration.x,
                    y0: evt.acceleration.y,
                    z0: evt.acceleration.z,
                    x: evt.accelerationIncludingGravity.x,
                    y: evt.accelerationIncludingGravity.y,
                    z: evt.accelerationIncludingGravity.z,
                    alpha: evt.rotationRate.alpha,
                    beta: evt.rotationRate.beta,
                    gamma: evt.rotationRate.gamma
                },
                evt.timeStamp + performance.timing.navigationStart
            );
        }
    }
};


//------------------------------------ Data Collection ------------------------------------\\

const datasetCollector = require("edge-ml").datasetCollector;

async function start_recording() {
    for (const [sensor, fun] of Object.entries(sensors)) {
        fun.collector = await datasetCollector(
            "https://app.edge-ml.org", // Backend-URL
            "zfOAqoW+L7b/NzeoMPtdqqn8jVkk5G9Iy8dzT27eCEnm+GiYlHwd1BMz6mcLJPZfupbs0n75xttwqwsCOceJig==", // API-Key
            sensor, // Name for the dataset
            false, // False to provide own timestamps
            Object.assign({ participantId: "UnknownID" }, defaultTags), // Metadata: {} to omit
            "KonSysLabels_" + ctw_value // Labeling and label for the whole dataset. Format: {labeling}_{label}
        );
        window.addEventListener(sensor, fun.listener, true);
    }
}

async function stop_recording() {
    for (const [sensor, fun] of Object.entries(sensors)) {
        window.removeEventListener(sensor, fun.listener, true);
        await fun.collector.onComplete();
    }
}

function record(eventtype, fields, eventtime) {
    // time at which the event happend
    for (const [key, value] of Object.entries(fields)) {
        sensors[eventtype].collector.addDataPoint(eventtime, key, value);
    }
}


//------------------------------------ Ask for Permissions (iOS) ------------------------------------\\

function permission() {
    console.log("Request for permissions");

    if (
        typeof DeviceMotionEvent !== "undefined" &&
        typeof DeviceMotionEvent.requestPermission === "function"
    ) {
        DeviceMotionEvent.requestPermission()
            .then((response) => {})
            .catch(console.error);
    } else {
        alert("DeviceMotionEvent is not defined");
    }

    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
        DeviceOrientationEvent.requestPermission()
            .then((response) => {})
            .catch(console.error);
    } else {
        alert("DeviceOrientationEvent is not defined");
    }
}

//------------------------------------ Helper Functions ------------------------------------\\

function cwt() {
    var tableBtn = document.getElementById("tableBtn");
    var walkBtn = document.getElementById("walkBtn");
    var carBtn = document.getElementById("carBtn");

    tableBtn.style.background = "#aaaaaa";
    carBtn.style.background = "#aaaaaa";
    walkBtn.style.background = "#aaaaaa";

    switch (ctw_value) {
        case "car":
            carBtn.style.background = "#00cc00";
            break;
        case "table":
            tableBtn.style.background = "#00cc00";
            break;
        case "walk":
            walkBtn.style.background = "#00cc00";
            break;
        default:
            break;
    }
}
