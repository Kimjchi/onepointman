package com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist;

import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ListView;

import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.settings.UserModelSettings;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;

import java.util.ArrayList;

/**
 * Created by yannick on 08/12/17.
 */

public class AddUserToGroup extends AppCompatActivity
{
    private ArrayList<UserModelAdd> userModels;
    private ListView userList;
    private UserAdapterAdd userAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_user_to_group);

        Toolbar toolbar = (Toolbar) findViewById(R.id.addUserToGroupToolbar);
        toolbar.setTitle(getIntent().getExtras().get("groupName").toString());

        setSupportActionBar(toolbar);

        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        userList = (ListView) findViewById(R.id.listUserAdd);

        userModels = new ArrayList<>();

        VolleyRequester.getInstance(getApplicationContext())
                .retreiveUserFriendList((ArrayList< UserModelSettings>)getIntent().getExtras().getSerializable("usersList"), userModels,
                        getIntent().getExtras().getInt("groupId"));

        userAdapter = new UserAdapterAdd(userModels, getApplicationContext());
        userList.setAdapter(userAdapter);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        //getMenuInflater().inflate(R.menu.menu_settings_group, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        switch (id)
        {
            case android.R.id.home:
                onBackPressed();
                break;
        }

        return super.onOptionsItemSelected(item);
    }
}
