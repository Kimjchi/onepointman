package com.example.yannick.androidclient;

import android.annotation.SuppressLint;
import android.app.Fragment;
import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationManager;
import android.support.v4.app.ActivityCompat;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.support.v4.content.ContextCompat;
import android.util.Log;

import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;

import java.util.HashMap;
import java.util.Map;

import static com.example.yannick.androidclient.LocationService.getLocationService;

public class MapFragment extends Fragment implements OnMapReadyCallback {
    //call this method in your onCreateMethod
    public GoogleMap mMap;
    private final int REQUEST_PERMISSION_PHONE_LOCATION = 1;
    private Criteria critere = new Criteria();
    private LocationManager locationManager;
    private LocationService locationService;
    private DisplayThread updateMyPosition;
    public static MapFragment instance = null;
    public VolleyRequester restRequester = null;
    private Map<String, MarkerOptions> markers = new HashMap<String, MarkerOptions>() {
    };
    Location myLocation;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_map, container, false);
    }

    @Override
    public void onStart(){
        super.onStart();
        restRequester = VolleyRequester.getInstance(getActivity().getApplicationContext());
        restRequester.groupsRequest();
        instance = this;
        startGpsService();
    }

    @Override
    public void onStop(){
        super.onStop();
        stopDisplayThread();
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
    }

    @Override
    public void onViewCreated(View view, Bundle savedInstanceState)
    {
        super.onViewCreated(view, savedInstanceState);
        com.google.android.gms.maps.MapFragment fragment = (com.google.android.gms.maps.MapFragment) getChildFragmentManager().findFragmentById(R.id.mapFragment);
        fragment.getMapAsync(this);
    }

    public void startGpsService() {
        //On demande les droits à l'utilisateur:
        askLocationPermission();
        //si on a les droits:
        if (checkPermission()){
            boolean serviceStarted = startLocationService();
            //Si le service est lancé
            if (serviceStarted){
                //On lance le thread lié au display
                startDisplayThread();
            }
        }
    }

    @SuppressLint("MissingPermission") //Permission déjà vérifiée!
    public boolean startLocationService() {
        Log.v("GPS Service", "Starting service...");
        locationService = getLocationService(getActivity().getApplicationContext());
        if (locationService != null) {
            locationManager = (LocationManager) getActivity().getSystemService(Context.LOCATION_SERVICE);
            String provider = bestProvider();
            locationManager.requestLocationUpdates(provider, 3000, 1, locationService);
            locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 3000, 1, locationService);
            locationManager.requestLocationUpdates(LocationManager.NETWORK_PROVIDER, 3000, 1, locationService);
            locationManager.getLastKnownLocation(provider);
            Log.v("GPS Service", "Service STARTED!");
            return true;
        } else {
            Log.v("GPS Service", "ERROR: Impossible to get instance...");
            return false;
        }
    }

    public void askLocationPermission(){
        //On regarde si on a la permission d'utiliser la localisation de l'utilisateur et on lui demande si ce n'est pas le cas.
        if (ActivityCompat.shouldShowRequestPermissionRationale(getActivity(), Manifest.permission.ACCESS_FINE_LOCATION)) {
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PERMISSION_PHONE_LOCATION);
            Log.v("LOCATION", "Permission précedement refusée");
        } else {
            Log.v("LOCATION", "Demande de permission");
            ActivityCompat.requestPermissions(getActivity(), new String[]{Manifest.permission.ACCESS_FINE_LOCATION}, REQUEST_PERMISSION_PHONE_LOCATION);
        }
    }

    public boolean checkPermission(){
        if (ContextCompat.checkSelfPermission(getActivity().getApplicationContext(), android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED){
            Log.v("Location", "Permission granted!");
            return true;
        } else {
            Log.v("Location", "Permission denied!");
            return false;
        }
    }

    public String bestProvider(){
        critere.setAccuracy(Criteria.ACCURACY_LOW);
        critere.setPowerRequirement(Criteria.POWER_LOW);
        critere.setAltitudeRequired(false);
        critere.setBearingRequired(false);

        String provider = locationManager.getBestProvider(critere, true);
        // Cant get a hold of provider
        if (provider == null) {
            Log.v("PROVIDER", "Provider is null");
            return "None";
        } else {
            Log.v("PROVIDER", "Best provider: " + provider);
            return provider;
        }
    }
    
    public void startDisplayThread() {
        updateMyPosition = new DisplayThread();
        updateMyPosition.run();
        Log.v("GPS Service", "Display thread started");
    }

    public void stopDisplayThread() {
        if (updateMyPosition.getdisplayThreadRunning()) {
            updateMyPosition.stopDisplay();
            Log.v("GPS Service", "Display thread stopped");
        }
    }

    public void addMarker(String name, MarkerOptions marker){
        markers.put(name, marker);
    }

    public void updateDisplayMarkers(){
        mMap.clear();
        for (Map.Entry<String, MarkerOptions> marker : markers.entrySet()) {
            mMap.addMarker(marker.getValue());
        }
    }
}