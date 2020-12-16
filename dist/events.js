
var app = new Vue({
    el: "#app",
    data: {
        messages: [],
        lastMessage: "",
        eventName: "",
        arrayGasValues: [],
        arrayTempValues: []
    },
    mounted: function () {
        this.initSse();
    },
    methods: {
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = window.location.origin + "/api/events";
                var source = new EventSource(url);
                source.onmessage = (event) => { 
                    this.messages.push(event.data);
                    this.lastMessage = event.data;
                    this.eventName = JSON.parse(event.data).eventName;
                    var value = JSON.parse(event.data).value;
                    var message = JSON.parse(event.data).message;
                    console.log(this.eventName + ": " + value);  
                    
                    if(this.eventName === "temperature"){
                        this.arrayTempValues.push(value);
                    }
                    else if(this.eventName === "gasValue"){
                        this.arrayGasValues.push(value);
                    }
                    else{
                        message = "There is no data available";
                        console.log(message)
                    }
                    console.log(this.eventName);

                };
            } else {
                this.message = "Your browser does not support server-sent events.";
            }
        }
    }
})
