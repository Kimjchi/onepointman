package com.example.yannick.androidclient;

import android.graphics.Bitmap;

/**
 * Created by yannick on 06/12/17.
 */

public class UserModel {

    private String name;
    private int id;
    private Bitmap image;

    public UserModel(String name, int id) {
        this.name=name;
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public int getId(){return this.id;}
}