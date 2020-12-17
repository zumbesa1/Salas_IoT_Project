//remember the Values to send them tu frontend
var arrayGasValues = {
    name : "gasValue",
    values: []
}
var arrayTempValues = {
    name : "tempValues",
    values : [ ]
};


// react on the "getTemperature" Event
function getTemperature (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "pressed" or "released"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event

    // helper variables that we need to build the message to be sent to the clients
    let message = "Verbindung zu deinem smarten Feuernmelder ist aktiv.";
    var floatValue = parseFloat(evData);
    var correctedTempValue = ((floatValue - 4)*10)/10;
    let newTempValue = correctedTempValue.toString();
    
    // push value into correct array
    arrayTempValues.values.push(newTempValue);

    // send data to all connected clients
    sendData("temperature", newTempValue, message, evDeviceId, evTimestamp);
}

// react on the "getGasValue" Event
function getGasValue (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    var evData = ev.data; // the data from the argon event: "pressed" or "released"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event
    
    // push the gasValues into the correct Array
    arrayGasValues.values.push(evData);
    // helper variables that we need to build the message to be sent to the clients
    let message = "Verbindung zu deinem smarten Feuernmelder ist aktiv.";
    // send data to all connected clients
    sendData("gasValue", evData, message, evDeviceId, evTimestamp);
}

// react on the "getGasValue" Event
function getGasValue2 (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    var evData = ev.data; // the data from the argon event: "pressed" or "released"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at);
    // push the gasValues into the correct Array
    arrayGasValues.values.push(evData);
    // helper variables that we need to build the message to be sent to the clients
    let message = "Verbindung zu deinem smarten Feuernmelder ist aktiv.";
    // send data to all connected clients
    sendData("gasValue2", evData, message, evDeviceId, evTimestamp);
}



// send data to the clients.
// You don't have to change this function
function sendData(evName, evData, message, evDeviceId, evTimestamp) {
    
    // map device id to device nr
    let nr = exports.deviceIds.indexOf(evDeviceId)

    // the message that we send to the client
    let data = {
        eventName: evName,
        value: evData,
        message: message,
        deviceId: nr,
        time: evTimestamp
    };

    // send the data to all connected clients
    exports.sse.send(data)
}

exports.deviceIds = [];
exports.sse = null;

// export your own functions here as well
exports.getGasValue = getGasValue;
exports.getGasValue2 = getGasValue2;
exports.getTemperature = getTemperature;