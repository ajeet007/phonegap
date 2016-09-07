package com.mygap;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ProgressBar;

public abstract class MyActivity extends Activity implements View.OnClickListener {
    /**
     * Called when the activity is first created.
     */
    private EditText value;
    private Button btn;
    private ProgressBar pb;

    @Override
    public void onCreate(Bundle savedInstanceState) {
       /* super.onCreate(savedInstanceState);
        setContentView(R.layout.main);*/
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        value = (EditText) findViewById(R.id.editText1);
        btn = (Button) findViewById(R.id.button1);
        pb = (ProgressBar) findViewById(R.id.progressBar1);
        pb.setVisibility(View.GONE);
        btn.setOnClickListener(this);
    }
}

