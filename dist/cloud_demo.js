var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com

var app = new Vue({
    el: "#app",
    data: {
        successfulLoad: true,
        message: "",
        temperaturSensor: {
        alert : false,
        message: "",      
        lastTime: "",
        lastValue: "",
        values: [],  
        timeCollection: [],
        },
        firstGasSensor: {
        alert : false,
        message: "",
        lastTime: "",
        lastValue: "",
        values: [],
        timeCollection: [],
        },
        secondGasSensor: {
          alert : false,
          message: "",
          lastTime: "",
          lastValue: "",
          values: [],
          timeCollection: [],
        },
        buttonState_0: "unknown", // the state of the button on device 0
        buttonState_1: "unknown", // the state of the button on device 1
        buttonPressCounter: 0,    // how many times the buttons were pressed
        buttonsSync: false,       // true if the buttons were pressed within 1 second
        blinking_0: false,        // true if device 0 is blinking.
        blinking_1: false,        // true if device 0 is blinking.
        // add your own variables here ...
    },
    // This function is executed once when the page is loaded.
    mounted: function () {
        this.initSse();
    },
    methods: {
        // Initialise the Event Stream (Server Sent Events)
        // You don't have to change this function
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = rootUrl + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => {
                    this.successfulLoad = true;
                    this.updateVariables(JSON.parse(event.data));
                };
            } else {
                this.successfulLoad = false;
                this.message = "Es besteht keine Verbindung zu deinem smarten Brandmelder.";
            }
        },
        // react on events: update the variables to be displayed
        updateVariables(ev) {
            // Event "buttonStateChanged"
            this.message = ev.message;
            var formatedTimestamp = new Date(ev.time);
            var hour = formatedTimestamp.getHours().toString();
            var min  = formatedTimestamp.getMinutes().toString();
            var sec  = formatedTimestamp.getSeconds().toString();
            var time = hour + ":" + min +":" + sec + " Uhr";

            if (ev.eventName === "temperature") {
                this.temperaturSensor.lastValue = ev.value;
                this.temperaturSensor.lastTime = time;

                if (ev.alrtDevice === 1) {
                   temperaturSensor.alert++;
                }
            }
            else if (ev.eventName === "gasValue") {
                this.firstGasSensor.lastValue = ev.value;
                this.firstGasSensor.lastTime = time;

                if (ev.alrtDevice === 1) {
                    firstGasSensor.alert++;
                }
            }
            else if (ev.eventName === "gasValue2") {
                this.secondGasSensor.lastValue = ev.value;
                this.secondGasSensor.lastTime = time;

                if (ev.alrtDevice === 1) {
                    secondGasSensor.alert++;
                }
            }
            
        },
        // call the function "blinkRed" in your backend
        blinkRed: function (nr) {
            var duration = 2000; // blinking duration in milliseconds
            axios.post(rootUrl + "/api/device/" + nr + "/function/blinkRed", { arg: duration })
                .then(response => {
                    // Handle the response from the server
                    console.log(response.data); // we could to something meaningful with the return value here ... 
                })
                .catch(error => {
                    alert("Could not call the function 'blinkRed' of device number " + nr + ".\n\n" + error)
                })
        },
        // get the value of the variable "temperature" on the device with number "nr" from your backend
        getTemperature: function (nr) {
            axios.get(rootUrl + "/api/device/" + nr + "/variable/temperature")
                .then(response => {
                    // Handle the response from the server
                    var temp = response.data.result;
                    var time = response.data.timeStamp;
                    if (nr === 0) {
                        this.temperaturSensor.lastValue = temp;
                        this.temperaturSensor.lastTime = time;
                    }
                    else {
                        console.log("unknown device number: " + nr);
                    }
                })
                .catch(error => {
                    alert("Could not read the button state of device number " + nr + ".\n\n" + error)
                })
        }
    }
})
