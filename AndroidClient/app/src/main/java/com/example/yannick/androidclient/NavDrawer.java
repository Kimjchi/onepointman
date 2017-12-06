package com.example.yannick.androidclient;

import android.app.Activity;
import android.app.FragmentManager;
import android.os.Bundle;
import android.os.Handler;
import android.view.View;
import android.support.design.widget.NavigationView;
import android.support.v4.view.GravityCompat;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarDrawerToggle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.squareup.picasso.Picasso;

import org.json.JSONObject;

public class NavDrawer extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private Menu menu;
    private Activity thisActivity;
    private int selectedGroup = -1;

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
        fm.beginTransaction().replace(R.id.content_frame, new MapFragment()).commit();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        menu = navigationView.getMenu();

        View hView =  navigationView.getHeaderView(0);
        ImageView profilePic = hView.findViewById(R.id.profilePicture);
        ((TextView) hView.findViewById(R.id.userName)).setText(FacebookInfosRetrieval.user_name);

        if(profilePic != null)
        {
            Picasso.with(this).load("https://graph.facebook.com/"+FacebookInfosRetrieval.user_id+"/picture?type=large")
                    .placeholder(R.drawable.hamburger)
                    .error(R.drawable.ic_menu_camera)
                    .into(profilePic);
        }

        String urlGetGroup = "http://api.geonames.org/citiesJSON?north=44.1&south=-9.9&east=-22.4&west=55.2&lang=de&username=demo";
        JsonObjectRequest setGroups = new JsonObjectRequest(Request.Method.GET, urlGetGroup, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        int limit = 19;
                        for(int i=0; i < limit; i++)
                        {
                            MenuItem mi = menu.findItem(R.id.groups)
                                    .getSubMenu().add(0, i, i, "Groupe" + i + " maggle");
                            mi.setIcon(R.drawable.group);
                            ImageButton settingsButton = new ImageButton(getApplicationContext());
                            settingsButton.setBackgroundResource(R.drawable.reglage);
                            settingsButton.setOnClickListener(new View.OnClickListener() {
                                @Override
                                public void onClick(View view) {
                                    System.out.println("APPUI SUR LE BOUTON");
                                    //Lancer l'activite réglages du groupe
                                }
                            });
                            mi.setActionView(settingsButton);
                            mi.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
                                @Override
                                public boolean onMenuItemClick(MenuItem menuItem) {
                                    System.out.println("Clicked on "+menuItem.getItemId());
                                    return false;
                                }
                            });
                        }
                    }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {

            }
        });
        VolleyRequester.getInstance(getApplicationContext()).addToRequestQueue(setGroups);

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
        getMenuInflater().inflate(R.menu.menu_settings, menu);
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
            case 0:
                System.out.println("Groupe 1");
                break;
            case 1:
                System.out.println("Groupe 2");
                break;
            case 2:
                System.out.println("Groupe 3");
                break;
            case 3:
                System.out.println("Groupe 4");
                break;
            case R.id.add_group:
                System.out.println("Settings");
                break;
            case R.id.nav_logout:
                System.out.println("Logout");
                break;
            default:
                break;
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }
}
