package com.example.yannick.androidclient;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

/**
 * Created by Arnaud Ricaud on 05/12/2017.
 */

public class DisplayThread implements Runnable {
    private final int MY_POSITION_UPDATE_TIME = 10000;
    private Handler handler = new Handler();
    private boolean displayThreadRunning = true;
    private Location myLocation;

    private MapFragment activity;

    @Override
    public void run() {
        if (displayThreadRunning) {
            activity = MapFragment.instance;
            LocationService locationService = LocationService.getLocationService(activity.getActivity().getApplicationContext());
            LocationManager locationManager;
            locationManager = (LocationManager) activity.getActivity().getSystemService(Context.LOCATION_SERVICE);
            if (ActivityCompat.checkSelfPermission(activity.getActivity().getApplicationContext(), Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                myLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                Log.v("Location", "Updating position...");
                myLocation = locationService.getLocation();
                if (myLocation != null) {
                    activity.getActivity().runOnUiThread(new Thread(new Runnable() {
                        public void run(){
                        if ((myLocation != null) && (activity.mMap != null)) {
                            activity.mMap.addMarker(new MarkerOptions()
                                    .position(new LatLng(myLocation.getLatitude(), myLocation.getLongitude()))
                                    .title("Here I am!"));
                            Toast.makeText(activity.getActivity().getApplicationContext(), "Longitude(" + myLocation.getLongitude() + ")\nLatitude(" + myLocation.getLatitude()+")", Toast.LENGTH_LONG).show();
                        }
                        Log.v("LOCATION", "Update displayed!");
                        Log.v("POSITION", "Longitude: " + myLocation.getLongitude() + " Latitude: " + myLocation.getLatitude());

                        }
                    }));
                }
                handler.postDelayed(this, MY_POSITION_UPDATE_TIME);
            }
        }
    }

    public void stopDisplay(){
        displayThreadRunning = false;
    }
    public boolean getdisplayThreadRunning(){
        return displayThreadRunning;
    }
}
