package com.mygap;
import org.apache.cordova.DroidGap;
import android.os.Bundle;
/**
 * Created by 60923 on 13/01/2016.
 */
public class MyGapActivity extends DroidGap {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        super.loadUrl("file:///android_asset/www/index.html");
    }
}
