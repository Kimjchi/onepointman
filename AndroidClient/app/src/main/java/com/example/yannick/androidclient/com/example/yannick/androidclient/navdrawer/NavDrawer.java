package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.app.AlertDialog;
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
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.example.yannick.androidclient.com.example.yannick.androidclient.login.FacebookInfosRetrieval;
import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.socket.SocketService;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.LatLng;
import com.squareup.picasso.Picasso;

public class NavDrawer extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private Menu navigationMenu;
    private Menu settingsMenu;
    private boolean isDrawing;
    private MapFragment mapFragment;

    private static final int DESSINER = 1;
    private static final int STOP_DESSINER = 2;
    private static final int ENVOYER_DESSIN = 3;
    private static final int DELETE_TRACE = 4;
    private static final int SHOW_DRAWINGS = 5;
    private static final int SHOW_TRACES = 6;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitle("OnePointMan");
        setContentView(R.layout.activity_nav_drawer);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        final DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        FragmentManager fm = getFragmentManager();
        mapFragment = new MapFragment();
        fm.beginTransaction().replace(R.id.content_frame, mapFragment, "MAP_FRAGMENT").commit();

        NavigationView navigationView = (NavigationView) findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        navigationMenu = navigationView.getMenu();

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

        isDrawing = false;

        drawer.addDrawerListener(new DrawerLayout.DrawerListener() {
            @Override
            public void onDrawerSlide(View drawerView, float slideOffset) {
                if(isDrawing)
                {
                    drawer.closeDrawer(GravityCompat.START);
                }
            }

            @Override
            public void onDrawerOpened(View drawerView) {
                if(isDrawing)
                {
                    drawer.closeDrawer(GravityCompat.START);
                }
            }

            @Override
            public void onDrawerClosed(View drawerView) {

            }

            @Override
            public void onDrawerStateChanged(int newState) {

            }
        });

        Intent socket = new Intent(getBaseContext(), SocketService.class);
        startService(socket);

    }
    public Menu getMenu() {
        return navigationMenu;
    }

    @Override
    protected void onResume() {
        super.onResume();
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

    public void updateSettingsMenuOptions(boolean draw)
    {
        settingsMenu.clear();
        if(draw)
        {
            settingsMenu.add(Menu.NONE, ENVOYER_DESSIN, Menu.NONE, "Envoyer le dessin");
            settingsMenu.add(Menu.NONE, STOP_DESSINER, Menu.NONE, "Annuler le dessin");
        }
        else {
            settingsMenu.add(Menu.NONE, DESSINER, Menu.NONE, "Dessiner");
            settingsMenu.add(Menu.NONE, SHOW_DRAWINGS, Menu.NONE, "Afficher dessins")
                    .setCheckable(true)
                    .setChecked(MapFragment.instance.isShowDrawings());
            settingsMenu.add(Menu.NONE, SHOW_TRACES, Menu.NONE, "Afficher tracés")
                    .setCheckable(true)
                    .setChecked(MapFragment.instance.isShowTraces());
            settingsMenu.add(Menu.NONE, DELETE_TRACE, Menu.NONE, "Supprimer ma trace");
        }
    }



    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        settingsMenu = menu;
        updateSettingsMenuOptions(isDrawing);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        switch (id)
        {
            case DESSINER:
                updateSettingsMenuOptions(true);
                CameraPosition.Builder camPosition = new CameraPosition.Builder(mapFragment.mMap.getCameraPosition());
                camPosition.bearing(0);
                mapFragment.mMap.moveCamera(CameraUpdateFactory.newCameraPosition(camPosition.build()));
                mapFragment.takeSnapshotAndLauchDrawFragment(getFragmentManager());
                isDrawing = true;
                break;
            case STOP_DESSINER:
                updateSettingsMenuOptions(false);
                getFragmentManager().beginTransaction().replace(R.id.content_frame, mapFragment, "MAP_FRAGMENT").commit();
                isDrawing = false;
                break;
            case ENVOYER_DESSIN:
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Description du dessin");

                final EditText input = new EditText(this);
                input.setInputType(InputType.TYPE_CLASS_TEXT);
                builder.setView(input);
                builder.setMessage("Choisir la description du dessin");

                builder.setPositiveButton("Envoyer", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        String description = input.getText().toString();
                        DrawFragment drawFragment = ((DrawFragment)getFragmentManager().findFragmentByTag("DRAW_FRAGMENT"));
                        byte[] image = drawFragment.takeSnapshot();

                        VolleyRequester.getInstance(getApplicationContext())
                                .sendDrawing(drawFragment.getIdgroup(), description,
                                        drawFragment.getZoom(), drawFragment.getBounds(), image);

                        updateSettingsMenuOptions(false);
                        getFragmentManager().beginTransaction().replace(R.id.content_frame, mapFragment, "MAP_FRAGMENT").commit();
                        isDrawing = false;
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
            case DELETE_TRACE:
                VolleyRequester.getInstance(getApplicationContext()).updateTracking(false, MapFragment.instance.getCurrentGroup());
                VolleyRequester.getInstance(getApplicationContext()).deleteTracking(MapFragment.instance.getCurrentGroup());
                break;
            case SHOW_DRAWINGS:
                item.setChecked(!item.isChecked());
                MapFragment.instance.setShowDrawings(item.isChecked());
                if(item.isChecked() == false)
                {
                    MapFragment.instance.clearDrawings();
                    MapFragment.instance.mMap.clear();
                    VolleyRequester.getInstance(getApplicationContext())
                            .groupPositionUpdate(MapFragment.instance.getCurrentGroup());
                }
                else
                {
                    VolleyRequester.getInstance(getApplicationContext()).getDrawings(mapFragment.getCurrentGroup());
                }
                break;
            case SHOW_TRACES:
                item.setChecked(!item.isChecked());
                MapFragment.instance.setShowTraces(item.isChecked());
                break;
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
                if(!isDrawing)
                {
                    AlertDialog.Builder builder = new AlertDialog.Builder(this);
                    builder.setTitle("Choisir le nom du groupe");

                    final EditText input = new EditText(this);
                    input.setInputType(InputType.TYPE_CLASS_TEXT);
                    builder.setView(input);
                    builder.setMessage("Rentrer le nouveau nom du groupe");

                    builder.setPositiveButton("Créer", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            VolleyRequester.getInstance(getApplicationContext()).createNewGroup(input.getText().toString());
                        }
                    });
                    builder.setNegativeButton("Retour", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            dialog.cancel();
                        }
                    });

                    builder.show();
                }
                break;
            case R.id.nav_logout:
                if(!isDrawing)
                {

                }
                break;
            default:
                break;
        }

        DrawerLayout drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        drawer.closeDrawer(GravityCompat.START);
        return true;
    }

    @Override
    protected void onStop() {
        super.onStop();

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SocketService.getInstance().stopSelf();
    }
}
