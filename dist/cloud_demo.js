var rootUrl = window.location.origin; // get the root URL, e.g. https://example.herokuapp.com

var app = new Vue({
    el: "#app",
    data: {
        successfulLoad: false,
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
        alert : 0,
        message: "",
        lastTime: "",
        lastValue: "",
        values: [],
        timeCollection: [],
        },
        secondGasSensor: {
          alert : 0,
          message: "",
          lastTime: "",
          lastValue: "",
          values: [],
          timeCollection: [],
        },
        // add your own variables here ...
    },
    // This function is executed once when the page is loaded.
    mounted: function () {
        this.initSse();
        this.resetMessage();
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
                    this.message = "Verbindung zu deinem smarten Brandmelder ist aktiv.";
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
                   this.temperaturSensor.alert = true;
                   this.temperaturSensor.message = "Die Temperatur steigt. Bitte nachsehen!";
                }
            }
            else if (ev.eventName === "gasValue") {
                this.firstGasSensor.lastValue = ev.value;
                this.firstGasSensor.lastTime = time;

                if (ev.alrtDevice === 1) {
                    this.firstGasSensor.alert++;
                    console.log(this.firstGasSensor.alert);
                }
                if(this.firstGasSensor.alert > 5){
                    this.firstGasSensor.message = "Bitte nachschauen ob alles in Ordnung ist!";
                }
            }
            else if (ev.eventName === "gasValue2") {
                this.secondGasSensor.lastValue = ev.value;
                this.secondGasSensor.lastTime = time;

                if (ev.alrtDevice === 1) {
                    this.secondGasSensor.alert++;
                }
                if(this.secondGasSensor.alert > 39){
                    this.secondGasSensor.message = "Bitte nachschauen ob alles in Ordnung ist!";
                }
            }
            
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
        },
        resetMessages(){
            this.temperaturSensor.alert = false;;
            this.temperaturSensor.message = "";
            this.firstGasSensor.alert = 0;
            this.firstGasSensor.message = "";
            this.secondGasSensor.alert=0;
            this.secondGasSensor.message = "";
        }
    }
})
