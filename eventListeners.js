// react on the "getTemperature" Event
function getTemperature (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    let evData = ev.data; // the data from the argon event: "pressed" or "released"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event
    let alrtDevice = 0;

    // helper variables that we need to build the message to be sent to the clients
    let message = "Verbindung zu deinem smarten Brandmelder ist aktiv.";
    var floatValue = parseFloat(evData);
    var correctednewTempValue = ((floatValue - 4)*10)/10;
    correctedoldTempValue = correctednewTempValue;
    let newTempValue = correctednewTempValue.toString();
    let difference = correctednewTempValue-correctedoldTempValue;
    if( difference > 1.5 ){
        alrtDevice = 1;
    }
    else{
        alrtDevice = 0;
    }

    // send data to all connected clients
    sendData("temperature", newTempValue, message, evDeviceId, evTimestamp, alrtDevice);
}

// react on the "getGasValue" Event
function getGasValue (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    var evData = ev.data; // the data from the argon event: "gasvalue"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at); // the timestamp of the event
    let alrtDevice = 0;
    if( evData > 300 ){
        alrtDevice = 1;
    }
    else{
        alrtDevice = 0;
    }
    
    // helper variables that we need to build the message to be sent to the clients
    let message = "Verbindung zu deinem smarten Brandmelder ist aktiv.";
    // send data to all connected clients
    sendData("gasValue", evData, message, evDeviceId, evTimestamp, alrtDevice);
}

// react on the "getGasValue" Event
function getGasValue2 (event) {
    // read variables from the event
    let ev = JSON.parse(event.data);
    var evData = ev.data; // the data from the argon event: "pressed" or "released"
    let evDeviceId = ev.coreid; // the device id
    let evTimestamp = Date.parse(ev.published_at);
    let alrtDevice = 0;
    if( evData > 300 ){
        alrtDevice = 1;
    }
    else{
        alrtDevice = 0;
    }
    // helper variables that we need to build the message to be sent to the clients
    let message = "Verbindung zu deinem smarten Brandmelder ist aktiv.";
    // send data to all connected clients
    sendData("gasValue2", evData, message, evDeviceId, evTimestamp, alrtDevice);
}



// send data to the clients.
// You don't have to change this function
function sendData(evName, evData, message, evDeviceId, evTimestamp, alrtDevice) {
    
    // map device id to device nr
    let nr = exports.deviceIds.indexOf(evDeviceId)

    // the message that we send to the client
    let data = {
        eventName: evName,
        value: evData,
        message: message,
        deviceId: nr,
        time: evTimestamp,
        alrtDevice: alrtDevice
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