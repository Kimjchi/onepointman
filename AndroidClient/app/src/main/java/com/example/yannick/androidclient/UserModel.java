package com.example.yannick.androidclient;

import android.graphics.Bitmap;

import java.io.Serializable;

/**
 * Created by yannick on 06/12/17.
 */

public class UserModel implements Serializable {

    private String name;
    private int id;
    private int groupId;

    public UserModel(String name, int id, int groupId) {
        this.name=name;
        this.id = id;
        this.groupId = groupId;
    }

    public String getName() {
        return name;
    }

    public int getId(){return this.id;}

    public int getGroupId(){return this.groupId;}
}