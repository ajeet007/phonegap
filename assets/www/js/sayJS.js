/**
 * Created by 60923 on 19/01/2016.
 */
var commentVal = "";
var urlVal = "";
var countMsg = 0;
var intervalValue = 0;
var awakeVale = 5000;
var elTime = "";
var frequencyVal = 0;
var interval = null;
var conInterval = null;
var msgInterval = null;
var lowBrightnessInterval = null;
var batteryStatus = {};
var deviceID = null;
var wakeupTime=60000;
var actualWakeupTime=0;
$(document).on('ready', function () {
    $('.wakeup').change(function() {
        if($(this).val() == "1"){
            $('#awakeTime').val("").attr("selected", "selected");
            $('#awakeTime').attr("disabled","disabled");
        }
        else{
            $('#awakeTime').removeAttr('disabled');
        }
    });
    $("#send_btn").click(function () {
        clearInterval(conInterval);
        $("#massageVal").text('');
        $('.countMSG').text('');
        commentVal = $("#comment").val();
        if(Math.floor($("#comment").val()) == $("#comment").val() && $.isNumeric($("#comment").val()))
        {
            commentVal=generate_random_data(commentVal);
        }
        else{
            alert("Message size should ba a number.");
            return false;
        }
        if (parseInt($("#comment").val()) > 5000) {
            alert("Message size should be less than 500 byte.");
            return false;
        }
        if ($("#wakeupTime").val() == "") {
            alert("Wakeup time not selected.");
            return false;
        }
        else{
            if(($("#wakeupTime").val() != "1")){
                if($("#awakeTime").val()==""){
                    alert("Awake time not selected.");
                    return false;
                }
            }
        }
        urlVal = $("#url").val();
        intervalValue = $("#intervalValue").val();
        frequencyVal = $("#frequency").val();
        awakeVale = $("#awakeTime").val();
        wakeupTime=$("#wakeupTime").val();
        actualWakeupTime=parseInt(wakeupTime)+parseInt(awakeVale);
       /* var stringLen = byteLength(commentVal);
        if (parseInt(stringLen) > 500) {
            alert("Message size should be less than 500 byte.");
            return false;
        }*/

        if (commentVal != "" && urlVal != "" && frequencyVal !="" && intervalValue != "") {
            $("#send_btn").attr("disabled", "disabled");
            window.plugins.insomnia.keepAwake();
            interval = setInterval(sendMessage, parseInt(intervalValue));
            if(wakeupTime=="1"){
                msgInterval=0;
            }
            else {
                actualWakeupTime=parseInt(wakeupTime)+parseInt(awakeVale);
                msgInterval = setInterval(showNotification, parseInt(actualWakeupTime));
            }
            sendMessage();
        }
        else {
            $("#send_btn").removeAttr("disabled");
            alert('All value required.');
        }
    });
    $("#messageDiv a.close-notify").click(function () {
        $(".messageClass").fadeOut("slow");
        return false;
    });

    $("#cancel_btn").click(function () {
        $("#massageVal").text('');
        $('.countMSG').text('');
        $(".messageClass").fadeOut("slow");
        $("#send_btn").removeAttr("disabled");
        clearInterval(interval);
        clearInterval(msgInterval);
        clearInterval(lowBrightnessInterval);
        clearInterval(conInterval);
        window.plugins.brightness.setBrightness(-1);
       // $("#comment").val("");
       // $("#url").val("");
        countMsg = 0;
        frequencyVal = 0;
        intervalValue = 0;
    });
    $("#clear_btn").click(function () {
        $("#massageVal").text('');
        $('.countMSG').text('');
        $(".messageClass").fadeOut("slow");
        $("#send_btn").removeAttr("disabled");
        clearInterval(interval);
        clearInterval(msgInterval);
        clearInterval(lowBrightnessInterval);
        clearInterval(conInterval);
        window.plugins.brightness.setBrightness(-1);
        $("#comment").val("");
        $("#url").val("");
        countMsg = 0;
        frequencyVal = 0;
        intervalValue = 0;
    });
});

function sendMessage() {
    if (frequencyVal == 1) {
        $.ajax({
                type: 'POST',
                url: urlVal,
                global: false,
                async: false,
                data: "msg=" + commentVal + '&url=' + urlVal + "&batteryLevel=" + batteryStatus["batteryLevel"] + "&isPlugged=" + batteryStatus["isPlugged"] + "&UUID=" + batteryStatus["UUID"] + "&interval=" + intervalValue,
                statusCode: {
                    404: function() {
                        alert( "url not found");
                    }
                },
            success: function (data) {
                countMsg = parseInt(countMsg) + 1;
                if(wakeupTime=="1"){
                    showCounter();
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                countMsg = 0;
                frequencyVal = 0;
                intervalValue = 0;
                clearInterval(interval);
                clearInterval(msgInterval);
                $('.countMSG').html(countMsg + "Connection failed.");
                window.plugins.brightness.setBrightness(-1);
                $("#send_btn").removeAttr("disabled");
                conInterval= setInterval(tryConnection,60000);
            }
        });
    }
    else {
        if (parseInt(countMsg) < parseInt(frequencyVal)) {
            $.ajax({
                    type: 'POST',
                    url: urlVal,
                    global: false,
                    async: false,
                    data: "msg=" + commentVal + '&url=' + urlVal + "&batteryLevel=" + batteryStatus["batteryLevel"] + "&isPlugged=" + batteryStatus["isPlugged"] + "&UUID=" + batteryStatus["UUID"] + "&interval=" + intervalValue,
                    statusCode: {
                        404: function() {
                            alert( "url not found");
                        }
                    },
                success: function (data) {
                    countMsg = parseInt(countMsg) + 1;
                    if(wakeupTime=="1"){
                        showCounter();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    countMsg = 0;
                    frequencyVal = 0;
                    intervalValue = 0;
                    clearInterval(interval);
                    clearInterval(msgInterval);
                    $('.countMSG').html(countMsg + "Connection failed.");
                    window.plugins.brightness.setBrightness(-1);
                    $("#send_btn").removeAttr("disabled");
                    /* document.addEventListener("error", function () {
                     alert('There was an error adding your comment');
                     }, false);*/
                  /*  conInterval= setInterval(tryConnection,60000);*/
                }
            });
        }
        else {
            $("#send_btn").removeAttr("disabled");
            clearInterval(interval);
            clearInterval(msgInterval);
            showNotification();
            countMsg = 0;
            frequencyVal = 0;
            intervalValue = 0;
        }
    }
}

/*
 function sendMessage() {
 $.ajax({
 type: 'POST',
 data: "msg=" + commentVal + '&url=' + urlVal+"&batteryLevel=" +batteryStatus["batteryLevel"]+"&isPlugged=" +batteryStatus["isPlugged"]+"&UUID=" +batteryStatus["UUID"],
 async: false,
 url: 'http://172.18.251.161:8080/messageServer/GetMessage',
 success: function (data) {
 countMsg = parseInt(countMsg) + 1;
 },
 error: function () {
 countMsg = 0;
 frequencyVal = 0;
 intervalValue = 0;
 clearInterval(interval);
 clearInterval(msgInterval);
 }
 });
 }
 */
function showNotification() {
    $("#massageVal").text('');
    $('.countMSG').text('');
    $("#massageVal").html(countMsg + " message has been sent successfully.");
    $('.countMSG').html(countMsg + " success  !");
    window.plugins.brightness.setBrightness(-1);
    $(".messageClass").fadeIn("slow");
    $(".messageClass").delay(awakeVale).fadeOut("slow");
    lowBrightnessInterval = setInterval(lowBrightness, awakeVale);
}
function showCounter(){
    $('.countMSG').html(countMsg + " success  !");
}
function tryConnection(){
    $("#send_btn").click();
}
function byteLength(str) {
    // returns the byte length of an utf8 string
    var s = str.length;
    for (var i = str.length - 1; i >= 0; i--) {
        var code = str.charCodeAt(i);
        if (code > 0x7f && code <= 0x7ff) s++;
        else if (code > 0x7ff && code <= 0xffff) s += 2;
        if (code >= 0xDC00 && code <= 0xDFFF) i--; //trail surrogate
    }
    return s;
}
function lowBrightness() {
    window.plugins.brightness.setBrightness(0);/********To Set min brightness******/
    window.plugins.insomnia.keepAwake();
    clearInterval(lowBrightnessInterval);
}
function bodyOnclick(){
    window.plugins.brightness.setBrightness(-1);
}

function generate_random_data(attempt) {
    var random_data = "$";  //1 bytes
    for (var i = 0; i <attempt; i++) {
        random_data = random_data+i;
    }
    return random_data;
}
/*function generate_random_data(attempt) {
    var table = {
        '1': 10, //10kb
        '2': 12, //40kb
        '3': 14, //160kb
        '4': 16 //640kb
    };
    var random_data = "abcdefghij";  //10 bytes
    for (var i = 0; i < table[attempt]; i++) {
        random_data += random_data;
    }
    return random_data;
}*/

