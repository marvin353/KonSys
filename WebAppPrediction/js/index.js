//------------------------------------ Global Variables and Init Functions ------------------------------------\\

//------------------------------------ HTML Element Event Listeners ------------------------------------\\

document.getElementById("requestBtn").addEventListener("click", permission);

/*document
  .getElementById("DeviceOrientation_Switch")
  .addEventListener("change", device_orientation_switched);
document
  .getElementById("DeviceMotion_Switch")
  .addEventListener("change", device_motion_switched);*/

var measure_values = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0];

function handleMotionEvent(event) {
    measure_values[0] = event.rotationRate.alpha;
    measure_values[1] = event.rotationRate.beta;
    measure_values[2] = event.rotationRate.gamma;
    measure_values[3] = event.accelerationIncludingGravity.x;
    measure_values[4] = event.accelerationIncludingGravity.y;
    measure_values[5] = event.accelerationIncludingGravity.z;
    measure_values[6] = event.acceleration.x;
    measure_values[7] = event.acceleration.y;
    measure_values[8] = event.acceleration.z;

    //var text = document.getElementById("text");
    //text.innerText = "Alpha:" + a + ", Beta:" + b + ", Gamma:" + g;
}

function switched() {
    var checkBox = document.getElementById("myCheck");
    if (checkBox.checked == true) {
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", handleMotionEvent, false);
        }
    } else {
        if (window.DeviceOrientationEvent) {
            window.removeEventListener("deviceorientation", handleMotionEvent, false);
        }
    }
}

const { Predictor } = require("edge-ml");
const { score } = require("./EdgeMLDecTree_javascript");
const p = new Predictor(
    (input) => score(input),
    ["alpha", "beta", "gamma", "x0", "y0", "z0", "x", "y", "z"],
    100,
    [
        "62d96e3bc11866001371c055",
        "62d96e3bc11866001371c056",
        "62d96e3bc11866001371c057"
    ]
);

do_prediction();

function do_prediction() {
    setInterval(() => {
        p.addDatapoint("alpha", measure_values[0]);
        p.addDatapoint("beta", measure_values[1]);
        p.addDatapoint("gamma", measure_values[2]);
        p.addDatapoint("x0", measure_values[3]);
        p.addDatapoint("y0", measure_values[4]);
        p.addDatapoint("z0", measure_values[5]);
        p.addDatapoint("x", measure_values[6]);
        p.addDatapoint("y", measure_values[7]);
        p.addDatapoint("z", measure_values[8]);

        p.predict()
            .then((x) => x)
            .catch((e) => console.log(e.message));
    }, 250);
}

async function store_acc_measurements(event) {
    var y = event.accelerationIncludingGravity.y;
    var z = event.accelerationIncludingGravity.z;
    acc_z.push(z);
    acc_y.push(y);
}

function predict(measurement) {
    console.log(RandomForestClassifier(measurement));
}

var intervalId = window.setInterval(function () {
    if (acc_z.length > 2) {
        var z_mean = getMean(acc_z);
        var y_std = getStandardDeviation(acc_y);
        acc_z = [];
        acc_y = [];
        var clf = new RandomForestClassifier();
        var prediction = clf.predict([y_std, z_mean]);
        if (prediction == 2) {
            document.getElementById("status").innerHTML =
                "Sie Joggen, bravo! &#127939";
        } else if (prediction == 1) {
            document.getElementById("status").innerHTML =
                "Achtung: Sie gehen, da geht mehr &#57857";
        } else if (prediction == 0) {
            document.getElementById("status").innerHTML =
                "Setzen Sie sich in Bewegung!";
        } else {
            document.getElementById("status").innerHTML = "";
        }
    }
}, 2000);

function controlActivity() {
    var checked = document.getElementById("switch2").checked;

    if (checked) {
        console.log(typeof window.DeviceMotionEvent);
        if (
            typeof window.DeviceMotionEvent !== undefined &&
            typeof window.DeviceMotionEvent.requestPermission === "function"
        ) {
            window.DeviceMotionEvent.requestPermission()
                .then((response) => {
                    if (response == "granted") {
                        window.addEventListener(
                            "devicemotion",
                            store_acc_measurements,
                            false
                        );
                    }
                })
                .catch(console.error);
        }
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

function getStandardDeviation(array) {
    var n = array.length;
    var mean = array.reduce((a, b) => a + b) / n;
    return Math.sqrt(
        array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
    );
}

function getMean(array) {
    var n = array.length;
    return array.reduce((a, b) => a + b) / n;
}
