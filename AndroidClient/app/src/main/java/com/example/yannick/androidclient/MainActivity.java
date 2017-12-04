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
        loginButton = (LoginButton)findViewById(R.id.login_button);

        if(isLogged())
        {
            System.out.println("Lancer l'appli googlemap");
        }

        loginButton.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                System.out.println("Succès login");
            }

            @Override
            public void onCancel() {
                System.out.println("Cancel login");
            }

            @Override
            public void onError(FacebookException e) {
                System.out.println(e.toString());
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

    private boolean isLogged()
    {
        return AccessToken.getCurrentAccessToken() != null;
    }
}
