package com.example.yannick.androidclient.com.example.yannick.androidclient.login;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;

import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;

public class TestLoginFbFromServer extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_test_login_fb_from_server);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        VolleyRequester.getInstance(this).connectToFbFromServer();
    }

}
