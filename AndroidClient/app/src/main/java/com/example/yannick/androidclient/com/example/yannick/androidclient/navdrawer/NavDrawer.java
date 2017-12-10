package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.FragmentManager;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.text.InputType;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.example.yannick.androidclient.com.example.yannick.androidclient.login.FacebookInfosRetrieval;
import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.squareup.picasso.Picasso;

import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Locale;

public class NavDrawer extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private Menu menu;
    private Activity thisActivity;
    private int selectedGroup = -1;
    private String newGroupName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        thisActivity = this;
        setTitle("OnePointMan");
        setContentView(R.layout.activity_nav_drawer);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        FragmentManager fm = getFragmentManager();
        fm.beginTransaction().replace(R.id.content_frame, new MapFragment(), "MAP_FRAGMENT").commit();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        menu = navigationView.getMenu();

        View hView =  navigationView.getHeaderView(0);
        ImageView profilePic = hView.findViewById(R.id.profilePicture);
        ((TextView) hView.findViewById(R.id.userName)).setText(FacebookInfosRetrieval.user_name);

        if(profilePic != null)
        {
            Picasso.with(this).load("https://graph.facebook.com/"+FacebookInfosRetrieval.user_id+"/picture?type=large")
                    .placeholder(R.drawable.loading_image)
                    .error(R.drawable.not_found_image)
                    .into(profilePic);
        }


        VolleyRequester.getInstance(getApplicationContext()).displayGroupForNavDrawer(menu);

        final Handler updateGroupInfos = new Handler();
        final String url = "http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo";
        updateGroupInfos.postDelayed(new Runnable() {
            @Override
            public void run() {
                if (selectedGroup != -1)
                {
                    System.out.println("Récupérer les infos du groupe courrant");
                    JsonObjectRequest updateGroupRequest =
                            new JsonObjectRequest(Request.Method.GET, url, null, new Response.Listener<JSONObject>() {
                                @Override
                                public void onResponse(JSONObject response)
                                {
                                    System.out.println("Ici on attends la réponse");
                                }
                            }, new Response.ErrorListener() {
                            @Override
                            public void onErrorResponse(VolleyError error)
                            {
                                System.out.println("On a pas eu la réponse MORRAY");
                            }
                });
                VolleyRequester.getInstance(getApplicationContext()).addToRequestQueue(updateGroupRequest);
                }
                updateGroupInfos.postDelayed(this, 1000);
            }
        }, 1000);

    }

    @Override
    protected void onResume() {
        super.onResume();
        VolleyRequester.getInstance(getApplicationContext()).displayGroupForNavDrawer(menu);
    }

    @Override
    public void onBackPressed() {
        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        if (drawer.isDrawerOpen(GravityCompat.START)) {
            drawer.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.nav_drawer_settings, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();
        System.out.println("OptionsItemSelected");

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    @SuppressWarnings("StatementWithEmptyBody")
    @Override
    public boolean onNavigationItemSelected(MenuItem item) {
        // Handle navigation view item clicks here.
        int id = item.getItemId();

        switch(id)
        {
            case R.id.add_group:
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Choisir le nom du groupe");

                final EditText input = new EditText(this);
                input.setInputType(InputType.TYPE_CLASS_TEXT);
                builder.setView(input);
                builder.setMessage("Rentrer le nouveau nom du groupe");

                builder.setPositiveButton("Créer", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        newGroupName = input.getText().toString();
                        VolleyRequester.getInstance(getApplicationContext()).createNewGroup(newGroupName);
                    }
                });
                builder.setNegativeButton("Retour", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });

                builder.show();
                break;
            case R.id.nav_logout:
                MapFragment mapFragment = (MapFragment)getFragmentManager().findFragmentByTag("MAP_FRAGMENT");
                DrawFragment drawFragment = new DrawFragment();
                drawFragment.setBackground(mapFragment.getBitmapCurrentOfCurrentMap());

                getFragmentManager().beginTransaction().replace(R.id.content_frame, drawFragment, "DRAW_FRAGMENT").commit();
                break;
            default:
                break;
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    public Menu getMenu(){
        return menu;
    }
}
