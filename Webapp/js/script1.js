//------------------------------------ Main initialization function ------------------------------------\\

function init() {
    // Button for requesting permissions on iOS devices
    var btn = document.getElementById("requestBtn");
    btn.addEventListener( "click", permission );
}


//------------------------------------------ Sensor settings ------------------------------------------\\

function handleDeviceOrientationEvent(event) {
    var b = precise(event.beta);
    var g = precise(event.gamma);
    var a = precise(event.alpha);

    var text = document.getElementById("DeviceOrientation_Text");
    text.innerText = "Alpha:" + a + "\n, Beta:" + b + "\n, Gamma:" + g;
}

function handleDeviceMotionEvent(event) {
    var x = precise(event.acceleration.x);
    var y = precise(event.acceleration.y);
    var z = precise(event.acceleration.z);

    var text = document.getElementById("DeviceMotion_Text");
    text.innerText = "X:" + x + "\n, Y:" + y + "\n, Z:" + z;
}

function device_orientation_switched() {
    var checkBox = document.getElementById("DeviceOrientation_Switch");
    if (checkBox.checked == true){
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleDeviceOrientationEvent, false);
        }
    } else {
        if (window.DeviceOrientationEvent) {
            window.removeEventListener('deviceorientation', handleDeviceOrientationEvent, false);
        }
    }
}

function device_motion_switched() {
    var checkBox = document.getElementById("DeviceMotion_Switch");
    if (checkBox.checked == true){
        if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', handleDeviceMotionEvent, false);
        }
    } else {
        if (window.DeviceMotionEvent) {
            window.removeEventListener('devicemotion', handleDeviceMotionEvent, false);
        }
    }
}


//--------------------------------------- Helper functions ---------------------------------------\\

function precise(x) {
    return x.toPrecision(6);
}


//------------------------------ Permission request for iOS devices ------------------------------\\

function permission() {
    console.log("Request for permissions");

    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
        // (optional) Do something before API request prompt.
        DeviceMotionEvent.requestPermission()
            .then( response => {
                // (optional) Do something after API prompt dismissed.
                /*if ( response == "granted" ) {
                    window.addEventListener( "devicemotion", (e) => {
                        // do something for 'e' here.
                    })
                }*/
            })
            .catch( console.error )
    } else {
        alert( "DeviceMotionEvent is not defined" );
    }

    if ( typeof( DeviceOrientationEvent ) !== "undefined" && typeof( DeviceOrientationEvent.requestPermission ) === "function" ) {
        // (optional) Do something before API request prompt.
        DeviceOrientationEvent.requestPermission()
            .then( response => {
                // (optional) Do something after API prompt dismissed.
                /*if ( response == "granted" ) {
                    window.addEventListener( "devicemotion", (e) => {
                        // do something for 'e' here.
                    })
                }*/
            })
            .catch( console.error )
    } else {
        alert( "DeviceOrientationEvent is not defined" );
    }
}
