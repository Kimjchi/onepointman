package com.example.yannick.androidclient;

import android.Manifest;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.app.FragmentActivity;
import android.os.Bundle;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.SupportMapFragment;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;


import static com.example.yannick.androidclient.LocationService.getLocationService;

public class Map extends FragmentActivity implements OnMapReadyCallback {

    private GoogleMap mMap;
    private LocationManager locationManager;
    private LocationService locationService;
    private final int REQUEST_PERMISSION_PHONE_LOCATION = 1;
    private boolean canDisplayMarker = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_map);
        // Obtain the SupportMapFragment and get notified when the Map is ready to be used.
        SupportMapFragment mapFragment = (SupportMapFragment) getSupportFragmentManager()
                .findFragmentById(R.id.map);
        mapFragment.getMapAsync(this);

        if (ActivityCompat.shouldShowRequestPermissionRationale(this, Manifest.permission.ACCESS_FINE_LOCATION)) {
            Log.v("LOCATION", "Permission précedement refusée");
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PERMISSION_PHONE_LOCATION);
        } else {
            Log.v("LOCATION", "Demande de permission");
            ActivityCompat.requestPermissions(this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PERMISSION_PHONE_LOCATION);
        }
    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String permissions[],
            int[] grantResults) {
        switch (requestCode) {
            case REQUEST_PERMISSION_PHONE_LOCATION:
                if (ContextCompat.checkSelfPermission(getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    locationService = getLocationService(getApplicationContext());
                    Log.v("PERMISSION", "ACCEPT!");
                    if (locationService != null) {
                        Log.v("LOCALISATION", "Condition remplie");
                        locationManager = (LocationManager) getSystemService(LOCATION_SERVICE);
                        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 0, locationService);
                        canDisplayMarker = true;
                        Log.v("LOCALISATION", "J'affiche ma position!");
                        displayMyPosition();
                    } else {
                        Log.v("LOCALISATION", "Condition NON remplie");
                    }
                } else {
                    Log.v("PERMISSION", "DENIED!");
                }
        }
    }

    public boolean isLocationPermissionGranted() {
        if (ContextCompat.checkSelfPermission(getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
            Log.v("PERMISSION", "ACCEPT!");
            return true;
        } else {
            Log.v("PERMISSION", "DENIED!");
            return false;
        }

    }


    /**
     * Manipulates the Map once available.
     * This callback is triggered when the Map is ready to be used.
     * This is where we can add markers or lines, add listeners or move the camera. In this case,
     * we just add a marker near Sydney, Australia.
     * If Google Play services is not installed on the device, the user will be prompted to install
     * it inside the SupportMapFragment. This method will only be triggered once the user has
     * installed Google Play services and returned to the app.
     */
    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
    }


    public void displayMyPosition() {
        if (canDisplayMarker && (mMap != null)) {
            if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                Location newLocation = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                mMap.addMarker(new MarkerOptions()
                        .position(new LatLng(newLocation.getLatitude(), newLocation.getLongitude()))
                        .title("Hello world"));
            }
        }
    }
}
