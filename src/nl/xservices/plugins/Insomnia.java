package nl.xservices.plugins;

/**
 * Created by 60923 on 15/01/2016.
 */
import android.view.WindowManager;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.apache.cordova.api.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;

public class Insomnia extends CordovaPlugin {

    private static final String ACTION_KEEP_AWAKE = "keepAwake";
    private static final String ACTION_ALLOW_SLEEP_AGAIN = "allowSleepAgain";

    @Override
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        try {
            if (ACTION_KEEP_AWAKE.equals(action)) {
                cordova.getActivity().runOnUiThread(
                        new Runnable() {
                            public void run() {
                                cordova.getActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                            }
                        });
                return true;

            } else if (ACTION_ALLOW_SLEEP_AGAIN.equals(action)) {
                cordova.getActivity().runOnUiThread(
                        new Runnable() {
                            public void run() {
                                cordova.getActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
                                callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                            }
                        });
                return true;

            } else {
                callbackContext.error("insomnia." + action + " is not a supported function. Did you mean '" + ACTION_KEEP_AWAKE + "'?");
                return false;
            }
        } catch (Exception e) {
            callbackContext.error(e.getMessage());
            return false;
        }
    }
}
