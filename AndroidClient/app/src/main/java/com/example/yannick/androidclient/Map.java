package com.example.yannick.androidclient;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationManager;
import android.os.Handler;
import android.support.v4.app.ActivityCompat;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.widget.Toast;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import static com.example.yannick.androidclient.LocationService.getLocationService;

public class Map extends Fragment implements OnMapReadyCallback {
    //call this method in your onCreateMethod
    private GoogleMap mMap;
    private final int REQUEST_PERMISSION_PHONE_LOCATION = 1;
    private final int MY_POSITION_UPDATE_TIME = 10000;
    private LocationManager locationManager;
    private LocationService locationService;
    private Location myLocation;
    private Handler handler = new Handler();

    private Thread displayMyPosition = new Thread(new Runnable() {
        public void run() {
            if ((myLocation != null) && (mMap != null)) {
                mMap.addMarker(new MarkerOptions()
                        .position(new LatLng(myLocation.getLatitude(), myLocation.getLongitude()))
                        .title("Here I am!"));
            }
            Toast.makeText(getActivity().getApplicationContext(), "Longitude(" + myLocation.getLongitude() + ")\nLatitude(" + myLocation.getLatitude()+")", Toast.LENGTH_LONG).show();
        }
    });

    private Thread updateMyPosition;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_map, container, false);
    }

    @Override
    public void onStart(){
        super.onStart();
        //On regarde si on a la permission d'utiliser la localisation de l'utilisateur et on lui demande si ce n'est pas le cas.
        if (ActivityCompat.shouldShowRequestPermissionRationale(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION)) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PERMISSION_PHONE_LOCATION);
            Log.v("LOCATION", "Permission précedement refusée");
        } else {
            Log.v("LOCATION", "Demande de permission");
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PERMISSION_PHONE_LOCATION);
        }
        startGpsService();
    }


    @Override
    public void onStop(){
        super.onStop();
        updateMyPosition.interrupt();
        Log.v("GPS Service", "Display position STOPPED");
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        MapFragment fragment = (MapFragment) getChildFragmentManager().findFragmentById(R.id.mapFragment);
        fragment.getMapAsync(this);
    }

    public void startGpsService() {
        //On start le service gps si l'instance n'est pas créée et qu'on a les droits:
        if (ContextCompat.checkSelfPermission(getActivity().getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED){
            Log.v("Location", "Permission granted!");
            startLocationService();
        } else {
            Log.v("Location", "Permission denied!");
        }
    }

    @SuppressLint("MissingPermission") //Permission déjà vérifiée!
    public void startLocationService() {
        Log.v("GPS Service", "Starting service...");
        locationService = getLocationService(getActivity().getApplicationContext());
        if (locationService != null) {
            locationManager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 0, locationService);
            Log.v("GPS Service", "Service STARTED!");
            updateMyPosition = newDisplayUpdateThread();
            updateMyPosition.start();
            Log.v("GPS Service", "Display position every " + MY_POSITION_UPDATE_TIME + "ms");
        } else {
            Log.v("GPS Service", "ERROR: Impossible to get instance...");
        }
    }

    public Thread newDisplayUpdateThread(){
        return new Thread(new Runnable() {
            private Handler handler = new Handler();

            public void run() {
                if (ActivityCompat.checkSelfPermission(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }
                Log.v("Location", "Updating position...");
                myLocation = locationService.getLocation();
                getActivity().runOnUiThread(displayMyPosition);
                Log.v("Location", "Display update!");
                Log.v("POSITION","Longitude: " + myLocation.getLongitude() + " Latitude: " + myLocation.getLatitude());
                handler.postDelayed(this, MY_POSITION_UPDATE_TIME);
            }
        });
    }


}