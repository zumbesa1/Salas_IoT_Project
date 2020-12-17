var app = new Vue({
    el: "#app",
    data: {
        messages: [],
        lastMessage: "",
        eventName: "",
        arrayGasValues: [
          "60"
        ],
        lastTimeGas: "",
        arrayTimestampGas: [
          new Date().getTime()
        ],
        arrayTempValues: [
          "21.00"
        ],        
        lastTimeTemp: "",
        arrayTimestampTemp: [
          new Date().getTime()
        ],
    },
    mounted: function () {
        this.initSse();
        this.createChartGas();
        this.createChartTemp();
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
                    var time = new Date().getTime();

                    if(this.eventName === "temperature"){
                        this.lastTimeTemp = time;
                        this.arrayTimestampTemp.push(this.lastTimeTemp);
                        this.arrayTempValues.push(value);
                        this.createChartTemp();
                        console.log(this.arrayTempValues.length);
                        if(this.arrayTempValues.length > 30){
                          this.arrayTempValues.splice(0,1);
                          this.arrayTimestampTemp.splice(0,1);
                        }
                    }
                    else if(this.eventName === "gasValue"){
                        this.lastTimeGas = time;
                        this.arrayTimestampGas.push(this.lastTimeGas)
                        this.arrayGasValues.push(value);
                        this.createChartGas();
                        console.log(this.arrayGasValues.length);
                        if(this.arrayGasValues.length > 30){
                          this.arrayGasValues.splice(0,1);
                          this.arrayTimestampGas.splice(0,1);
                        }
                    }
                    else{
                        message = "There is no data available";
                        console.log(message)
                    }
                    
                };
            } else {
                this.message = "Your browser does not support server-sent events.";
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
                    data: this.arrayGasValues,
                    lineTension: 0,
                    backgroundColor: 'lightgrey',
                    borderColor: '#007bff',
                    borderWidth: 1,
                    pointBackgroundColor: '#007bff',
                    pointRadius: 2
                  }],
                  labels: this.arrayTimestampGas,
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: false
                      }
                    }]
                  },
                  legend: {
                    display: false
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
                    data: this.arrayTempValues,
                    lineTension: 0,
                    backgroundColor: 'lightpink',
                    borderColor: '#007bff',
                    borderWidth: 1,
                    pointBackgroundColor: '#007bff',
                    pointRadius: 2
                  }],
                  labels: this.arrayTimestampTemp,
                },
                options: {
                  scales: {
                    yAxes: [{
                      ticks: {
                        beginAtZero: false
                      }
                    }]
                  },
                  legend: {
                    display: false
                  }
                }
              })
        },
    }
})
