var app = new Vue({
    el: "#app",
    data: {
      messages: [],
      lastMessage: "",
      successfulLoad: false,
      eventName: "",
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
      }
    },
    mounted: function () {
        this.initSse();
        this.createChartGas();
        this.createChartGas2();
        this.createChartTemp();
        this.resetMessages();
    },
    methods: {
        initSse: function () {
            if (typeof (EventSource) !== "undefined") {
                var url = window.location.origin + "/api/events";
                var source = new EventSource(url);
                source.onmessage = async (event) => { 
                  console.log(event);
                  this.updateVariables(event);
                  this.successfulLoad = true;
                  this.message = "Verbindung zu deinem smarten Brandmelder ist aktiv.";
                };
            } else {
                this.successfulLoad = false;
                this.message = "Es besteht keine Verbindung zu deinem smarten Brandmelder.";
            }
        },
        updateVariables(event){
          this.eventName = JSON.parse(event.data).eventName;                    
                    this.message = JSON.parse(event.data).message;
                    var value = JSON.parse(event.data).value;
                    var formatedTimestamp = new Date(JSON.parse(event.data).time);
                    var hour = formatedTimestamp.getHours().toString();
                    var min  = formatedTimestamp.getMinutes().toString();
                    var sec  = formatedTimestamp.getSeconds().toString();
                    var time = hour + ":" + min +":" + sec + " Uhr";
                    var alertDevice = JSON.parse(event.data).alrtDevice;
                    console.log(alertDevice);
                    console.log(this.temperaturSensor.alert);

                    

                    if(this.eventName === "temperature"){
                        this.temperaturSensor.lastTime = time;
                        this.temperaturSensor.lastValue = value;
                        this.temperaturSensor.timeCollection.push(this.temperaturSensor.lastTime);
                        this.temperaturSensor.values.push(this.temperaturSensor.lastValue);
                        this.createChartTemp();
                        if(this.temperaturSensor.values.length > 35){
                          this.temperaturSensor.values.splice(0,1);
                          this.temperaturSensor.timeCollection.splice(0,1);
                        }
                        if (alertDevice === 1) {
                          this.temperaturSensor.alert = true;
                          this.temperaturSensor.message = "Die Temperatur steigt zu schnell. Bitte nachsehen!";
                       }
                    }
                    else if(this.eventName === "gasValue"){
                        
                      this.firstGasSensor.lastTime = time;
                      this.firstGasSensor.lastValue = value;
                      this.firstGasSensor.timeCollection.push(this.firstGasSensor.lastTime);
                      this.firstGasSensor.values.push(this.firstGasSensor.lastValue);
                      this.createChartGas();
                      if(this.firstGasSensor.values.length > 35){
                        this.firstGasSensor.values.splice(0,1);
                        this.firstGasSensor.timeCollection.splice(0,1);
                      }
                      if(alertDevice === 1 ){
                        this.firstGasSensor.alert++; 
                      }
                      if(this.firstGasSensor.alert > 39){
                        this.firstGasSensor.message = "In Ihrer Wohnung ist der Kohlenstoffmonoxidanteil zu hoch.";
                      }
                        
                    }
                    else if(this.eventName === "gasValue2"){
                      this.secondGasSensor.lastTime = time;
                      this.secondGasSensor.lastValue = value;
                      this.secondGasSensor.timeCollection.push(this.secondGasSensor.lastTime);
                      this.secondGasSensor.values.push(this.secondGasSensor.lastValue);
                      this.createChartGas2();
                      if(this.secondGasSensor.values.length > 35){
                        this.secondGasSensor.values.splice(0,1);
                        this.secondGasSensor.timeCollection.splice(0,1);
                      }
                      if(alertDevice === 39 ){
                        this.secondGasSensor.alert++; 
                      }
                      if(this.secondGasSensor.alert > 39){
                        this.secondGasSensor.message = "In Ihrer Wohnung ist der Kohlenstoffmonoxidanteil zu hoch.";
                      }
                    }
                    else{
                        message = "There is no data available";
                        console.log(message)
                    }
        },
        createChartGas: function() {
            'use strict'
  
            feather.replace();          
            var ctx = document.getElementById('myChartGas');
              var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                  datasets: [{
                    data: this.firstGasSensor.values,
                    lineTension: 0,
                    backgroundColor: 'lightgrey',
                    borderColor: 'black',
                    borderWidth: 1,
                    pointBackgroundColor: '#007bff',
                    pointRadius: 2
                  }],
                  labels: this.firstGasSensor.timeCollection,
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        suggestedMin: 0,
                        suggestedMax: 600,
                        stepSize: 50
                      }
                    }]
                  },
                  legend: {
                    display: true,
                    legend: "CO | CO2"
                  }
                }
              })
        },
        createChartGas2: function() {
          'use strict'
  
            feather.replace();          
            var ctx = document.getElementById('myChartGas2');
              var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                  datasets: [{
                    data: this.secondGasSensor.values,
                    lineTension: 0,
                    backgroundColor: 'lightgrey',
                    borderColor: 'black',
                    borderWidth: 1,
                    pointBackgroundColor: '#007bff',
                    pointRadius: 2
                  }],
                  labels: this.secondGasSensor.timeCollection,
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        suggestedMin: 0,
                        suggestedMax: 600,
                        stepSize: 50
                      }
                    }]
                  },
                  legend: {
                    display: true,
                    legend: "CO | CO2"
                  }
                }
              })
        },
        createChartTemp: function() {
            'use strict'
  
            feather.replace();     
            var ctx = document.getElementById('myChartTemp');
              var myChart = new Chart(ctx, {
                type: 'line',
                data: {
                  datasets: [{
                    label: 'Temp (°C)',
                    data: this.temperaturSensor.values,
                    lineTension: 0,
                    backgroundColor: 'lightpink',
                    borderColor: 'red',
                    borderWidth: 1,
                    pointBackgroundColor: '#007bff',
                    pointRadius: 2
                  }],
                  labels: this.temperaturSensor.timeCollection,
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        suggestedMin: 0,
                        suggestedMax: 30,
                        stepSize: 1
                      }
                    }]
                  },
                  legend: {
                    display: true,
                    legend: "Temp"
                  }
                }
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
