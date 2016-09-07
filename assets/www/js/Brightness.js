/**
 * Created by 60923 on 19/01/2016.
 */

function Brightness() {
}
Brightness.prototype.getBrightness = function(successCallback, errorCallback)
{
    return cordova.exec(successCallback, errorCallback, "Brightness", "getBrightness", []);
};
Brightness.prototype.setBrightness = function(value, successCallback, errorCallback)
{
    return cordova.exec(successCallback, errorCallback, "Brightness", "setBrightness", [value]);
};
Brightness.prototype.setKeepScreenOn = function(value, successCallback, errorCallback)
{
    return cordova.exec(successCallback, errorCallback, "Brightness", "setKeepScreenOn", [value]);
};

Brightness.install = function () {
    if (!window.plugins) {
        window.plugins = {};
    }
    window.plugins.brightness = new Brightness();
    return window.plugins.brightness;
};
cordova.addConstructor(Brightness.install);