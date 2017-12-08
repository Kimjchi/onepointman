package com.example.yannick.androidclient;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.hardware.camera2.params.Face;
import android.os.Bundle;
import android.support.annotation.Nullable;

import com.facebook.AccessToken;
import com.facebook.CallbackManager;
import com.facebook.FacebookCallback;
import com.facebook.FacebookException;
import com.facebook.FacebookSdk;
import com.facebook.Profile;
import com.facebook.login.LoginResult;
import com.facebook.login.widget.LoginButton;

import java.io.IOException;
import java.net.URL;
import java.util.Arrays;

/**
 * Created by yannick on 04/12/17.
 */

public class MainActivity extends Activity {
    private LoginButton loginButton;
    private CallbackManager callbackManager;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        FacebookSdk.sdkInitialize(getApplicationContext());
        callbackManager = CallbackManager.Factory.create();
        setContentView(R.layout.main_activity);
        loginButton = findViewById(R.id.login_button);
        loginButton.setReadPermissions(Arrays.asList("public_profile"));

        loginButton.registerCallback(callbackManager, new FacebookCallback<LoginResult>() {
            @Override
            public void onSuccess(LoginResult loginResult) {
                retreiveInfos();
                authServer();
                System.out.println("Succès login");
                goToMap();
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

        if(isLogged())
        {
            retreiveInfos();
            authServer();
            goToMap();
        }
    }

    private void authServer()
    {
        VolleyRequester.getInstance(getApplicationContext()).authServer(FacebookInfosRetrieval.user_id,
                AccessToken.getCurrentAccessToken().getToken());
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
        Intent intent = new Intent(this, NavDrawer.class);
        startActivity(intent);
    }

    private void retreiveInfos()
    {
        Profile.fetchProfileForCurrentAccessToken();
        Profile profile = Profile.getCurrentProfile();
        FacebookInfosRetrieval.user_id = profile.getId();
        FacebookInfosRetrieval.user_name = profile.getFirstName() + " " + profile.getLastName();
    }
}
