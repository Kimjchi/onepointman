package com.example.yannick.androidclient;

import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.widget.Toast;

/**
 * Created by Arnaud Ricaud on 04/12/2017.
 */

public class LocationService implements LocationListener{

    //Instance de la classe
    private static LocationService instance = null;

    private LocationManager locationManager;
    private Location location;


    //Méthode pour récupérer l'instance de la classe
    public static LocationService getLocationService(Context context){
        if (instance == null) {
            instance = new LocationService(context);
        }
        return instance;
    }

    //Constructeur:
    private LocationService( Context context )     {

        this.locationManager = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        if ( ContextCompat.checkSelfPermission( context, android.Manifest.permission.ACCESS_FINE_LOCATION ) != PackageManager.PERMISSION_GRANTED){
                Log.v("ERREUR", "Impossible de créer l'instance de localisation: permission refusée");
                return ;
        }

        try {
            // Status des connections Wi-Fi et GPS
            boolean isGPSEnabled = locationManager.isProviderEnabled("gps");
            if (!isGPSEnabled){
                Log.v("ERROR","Service de localisation indisponible!");
            } else {
                if (isGPSEnabled)  {
                    locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 10000, 0, this);
                    if (locationManager != null)  {
                        location = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER);
                    }
                }
            }
        } catch (Exception ex)  {
            Log.v("ERROR", "Error creating location service: " + ex.getMessage() );
        }
        Log.v("LOCALISATION", "Instance créée.");
    }

    public Location getLocation() {
        return location;
    }

    @Override
    public void onLocationChanged(Location newLocation) {
        location = newLocation;
        Log.v("Location Service","NEW POSITION: Longitude(" + newLocation.getLongitude() + ") Latitude(" + newLocation.getLatitude()+")");

    }

    @Override
    public void onStatusChanged(String s, int i, Bundle bundle) {

    }

    @Override
    public void onProviderEnabled(String s) {
        Log.v("LOCALISATION", s + " provider activée");
    }

    @Override
    public void onProviderDisabled(String s) {
        Log.v("LOCALISATION", s + " provider désactivée");
    }
}
