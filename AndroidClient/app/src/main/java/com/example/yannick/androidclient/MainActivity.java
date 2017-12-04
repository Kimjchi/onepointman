package com.example.yannick.androidclient;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.widget.TextView;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;

/**
 * Created by yannick on 04/12/17.
 */

public class MainActivity extends Activity {
    private TextView info;
    private LoginButton loginButton;
    private CallbackManager callbackManager;

    public MainActivity()
    {

    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        FacebookSdk.sdkInitialize(getApplicationContext());
        callbackManager = CallbackManager.Factory.create();
        setContentView(R.layout.main_activity);
        info = (TextView)findViewById(R.id.info);
        loginButton = (LoginButton)findViewById(R.id.login_button);
        if(isLogged())
        {
            goToMap();
        }

        loginButton.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                System.out.println("Succès login");
                info.setText(
                        "User ID: "
                                + loginResult.getAccessToken().getUserId()
                                + "\n" +
                                "Auth Token: "
                                + loginResult.getAccessToken().getToken()
                );
                goToMap();
            }

            @Override
            public void onCancel() {
                System.out.println("Cancel login");
                info.setText("Login attempt canceled.");
            }

            @Override
            public void onError(FacebookException e) {
                System.out.println(e.toString());
                info.setText("Login attempt failed.");
            }
        });
    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        System.out.println("On est par la");
        callbackManager.onActivityResult(requestCode, resultCode, data);
    }

    public boolean isLogged()
    {
        return  AccessToken.getCurrentAccessToken() != null;
    }

    private void goToMap() {
        Intent intent = new Intent(this, map.class);
        startActivity(intent);
    }

}
