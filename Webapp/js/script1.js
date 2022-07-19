function requestAction() {
    DeviceOrientationEvent.requestPermission()
        .then(response => {
            if (response == 'granted') {
                window.addEventListener('deviceorientation', (e) => {
                    // do something with e
                })
            }
        })
        .catch(console.error)
}

function handleMotionEvent(event) {
    var b = event.beta;
    var g = event.gamma;
    var a = event.alpha;

    var text = document.getElementById("text");
    text.innerText = "Alpha:" + a + ", Beta:" + b + ", Gamma:" + g;
}

function switched() {
    var checkBox = document.getElementById("myCheck");
    if (checkBox.checked == true){
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleMotionEvent, false);
        }
    } else {
        if (window.DeviceOrientationEvent) {
            window.removeEventListener('deviceorientation', handleMotionEvent, false);
        }
    }
}


function onClick() {
    var checkBox = document.getElementById("myCheck");

    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        // Handle iOS 13+ devices.
        DeviceOrientationEvent.requestPermission()
            .then((state) => {
                if (state === 'granted') {
                    window.addEventListener('deviceorientation', handleMotionEvent, false);
                } else {
                    console.error('Request to access the orientation was rejected');
                }
            })
            .catch(console.error);
    } else {
        // Handle regular non iOS 13+ devices.
        window.addEventListener('deviceorientation', handleMotionEvent,false);
    }
}

/*if ( location.protocol != "https:" ) {
location.href = "https:" + window.location.href.substring( window.location.protocol.length );
}*/
function permission () {
    if ( typeof( DeviceMotionEvent ) !== "undefined" && typeof( DeviceMotionEvent.requestPermission ) === "function" ) {
        // (optional) Do something before API request prompt.
        DeviceMotionEvent.requestPermission()
            .then( response => {
                // (optional) Do something after API prompt dismissed.
                if ( response == "granted" ) {
                    window.addEventListener( "devicemotion", (e) => {
                        // do something for 'e' here.
                    })
                }
            })
            .catch( console.error )
    } else {
        alert( "DeviceMotionEvent is not defined" );
    }
}
const btn = document.getElementById( "request" );
btn.addEventListener( "click", permission );