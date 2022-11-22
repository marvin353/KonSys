//------------------------------------ Global Variables and Init Functions ------------------------------------\\

var ctw_value = "table"; //"car", "walk"
var defaultTags = {};

var alpha = 0;
var beta = 0;
var gamma = 0;
var x = 0;
var y = 0;
var z = 0;
var x0 = 0;
var y0 = 0;
var z0 = 0;

cwt();
//------------------------------------ HTML Element Event Listeners ------------------------------------\\

document.getElementById("requestBtn").addEventListener("click", permission);

document.getElementById("Upload_Switch").onchange = function () {
  if (this.checked) {
    start_prediction();
  } else {
    stop_prediction();
  }
};

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
  devicemotion: {
    listener: function (/** @type {DeviceMotionEvent} */ evt) {
      if (evt.acceleration.x === null) return;

      alpha = evt.rotationRate.alpha;
      beta = evt.rotationRate.beta;
      gamma = evt.rotationRate.gamma;
      x = evt.accelerationIncludingGravity.x;
      y = evt.accelerationIncludingGravity.y;
      z = evt.accelerationIncludingGravity.z;
      x0 = evt.acceleration.x;
      y0 = evt.acceleration.y;
      z0 = evt.acceleration.z;

      document.getElementById("DeviceMotion_Text").innerText = alpha;
    }
  }
};

//------------------------------------ Data Collection ------------------------------------\\

/*const datasetCollector = require("edge-ml").datasetCollector;
 */
async function start_prediction() {
  for (const [sensor, fun] of Object.entries(sensors)) {
    window.addEventListener(sensor, fun.listener, true);
  }
}

async function stop_prediction() {
  for (const [sensor, fun] of Object.entries(sensors)) {
    window.removeEventListener(sensor, fun.listener, true);
  }
}

const { Predictor } = require("edge-ml");
const { score } = require("./EdgeMLRndForrest_javascript");

const p = new Predictor(
  (input) => score(input),
  ["alpha", "beta", "gamma", "x0", "y0", "z0", "x", "y", "z"], // sensors
  100, // window size
  ["car", "walk", "table"], // labels
  {
    scale: [
      19.352500000000003,
      0.1525,
      0.19352500000000003,
      1.0,
      0.7064562270234316,
      0.52741242,
      0.9438882405513817,
      1.5825,
      2.37,
      2.1375,
      36.16,
      0.36375,
      0.3616,
      1.0,
      1.04433588992871,
      1.1388326325000002,
      1.2238741396992037,
      2.2775,
      2.6625,
      2.1550000000000002,
      15.614999999999998,
      0.16375,
      0.15614999999999998,
      1.0,
      0.9522026620469596,
      0.9393641949999999,
      0.930195123222176,
      2.4475,
      3.115,
      2.9175,
      94.87499999999999,
      0.9125,
      0.94875,
      1.0,
      0.8694905491289409,
      0.7913674425,
      1.3939325238160039,
      0.6875,
      2.81,
      2.53,
      367.3025,
      3.7075,
      3.673025,
      1.0,
      1.2069170720707714,
      1.5115038099999998,
      4.226379522931828,
      3.3000000000000003,
      6.34,
      4.2875000000000005,
      131.995,
      1.4949999999999992,
      1.3199499999999986,
      1.0,
      0.9151081334547534,
      0.8686545299999999,
      1.1058347861194981,
      5.172499999999999,
      1.2975000000000012,
      1.25,
      26.58,
      0.24625000000000002,
      0.2657999999999999,
      1.0,
      22.274688915836435,
      500.30070076000004,
      23.10043066475372,
      47.7025,
      54.977500000000006,
      43.857499999999995,
      65.65,
      0.83375,
      0.6565000000000001,
      1.0,
      20.283448655756075,
      415.11548980750007,
      20.88635433524221,
      42.7375,
      51.065,
      45.57,
      130.97249999999997,
      1.4725,
      1.309725,
      1.0,
      19.780589889177563,
      394.26538844250007,
      21.28313307048203,
      33.940000000000005,
      48.190000000000005,
      39.205
    ],
    center: [
      -0.29000000000000004,
      0.0,
      -0.0029,
      100.0,
      0.17371027312426385,
      0.030175414999999997,
      0.2565905394910363,
      0.315,
      0.655,
      -0.335,
      1.37,
      0.01,
      0.0137,
      100.0,
      0.1924433665447708,
      0.037034495,
      0.3838714434904469,
      0.595,
      0.84,
      -0.24,
      4.68,
      0.05,
      0.046799999999999994,
      100.0,
      0.34450461217678446,
      0.11868367,
      0.40548114206677155,
      0.855,
      1.11,
      -0.965,
      -43.21500000000001,
      -0.4125,
      -0.43215000000000015,
      100.0,
      0.18272149088133746,
      0.033387494999999996,
      0.6098443361905149,
      0.01,
      1.15,
      -0.87,
      -324.895,
      -3.2375000000000003,
      -3.24895,
      100.0,
      0.1989999373308819,
      0.039600979999999994,
      3.597622664900909,
      -2.12,
      4.035,
      -3.68,
      -905.02,
      -9.03,
      -9.0502,
      100.0,
      0.34334307992483915,
      0.11788465999999996,
      9.058789597519237,
      -8.135000000000002,
      9.79,
      -9.79,
      0.08500000000000002,
      0.0,
      0.0008500000000000003,
      100.0,
      1.0230625472400707,
      1.046710215,
      1.070198303346283,
      2.625,
      3.035,
      -2.57,
      0.13999999999999999,
      0.005,
      0.0013999999999999998,
      100.0,
      1.4064848052855168,
      1.9781996549999998,
      1.7914784939784538,
      3.4450000000000003,
      5.02,
      -3.485,
      -0.48499999999999993,
      0.0,
      -0.004849999999999999,
      100.0,
      0.5045184004988037,
      0.25454564,
      1.2410788238416617,
      0.41,
      2.95,
      -0.645
    ],
    name: "RobustScaler"
  }, // scaler
  {
    // other options
    windowingMode: "sample"
  }
);

setInterval(() => {
  p.addDatapoint("alpha", alpha);
  p.addDatapoint("beta", beta);
  p.addDatapoint("gamma", gamma);
  p.addDatapoint("x0", x0);
  p.addDatapoint("y0", y0);
  p.addDatapoint("z0", z0);
  p.addDatapoint("x", x);
  p.addDatapoint("y", y);
  p.addDatapoint("z", z);

  p.predict()
    .then((x) => x)
    .catch((e) => console.log(e.message));
}, 250);

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

  var prediction_label = document.getElementById("prediction");

  switch (ctw_value) {
    case "car":
      prediction_label.innerText = "Car";
      break;
    case "table":
      //tableBtn.style.background = "#00cc00";
      prediction_label.innerText = "Table";
      break;
    case "walk":
      prediction_label.innerText = "Walk";
      //walkBtn.style.background = "#00cc00";
      break;
    default:
      break;
  }
}
