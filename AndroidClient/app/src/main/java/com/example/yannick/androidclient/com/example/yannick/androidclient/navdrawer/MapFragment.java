package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.annotation.SuppressLint;
import android.app.AlertDialog;
import android.app.DatePickerDialog;
import android.app.Dialog;
import android.app.Fragment;
import android.Manifest;
import android.app.FragmentManager;
import android.app.TimePickerDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.location.Criteria;
import android.location.LocationManager;
import android.support.v4.app.ActivityCompat;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.text.Editable;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.widget.Button;
import android.widget.DatePicker;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TimePicker;
import android.widget.Toast;

import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.draw.Drawing;
import com.example.yannick.androidclient.com.example.yannick.androidclient.socket.SocketService;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.OnMapReadyCallback;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.CustomCap;
import com.google.android.gms.maps.model.GroundOverlay;
import com.google.android.gms.maps.model.GroundOverlayOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;
import com.google.android.gms.maps.model.Marker;
import com.google.android.gms.maps.model.MarkerOptions;
import com.google.android.gms.maps.model.Polyline;
import com.google.android.gms.maps.model.PolylineOptions;

import org.json.JSONException;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import static com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.LocationService.getLocationService;

public class MapFragment extends Fragment implements OnMapReadyCallback {
    //call this method in your onCreateMethod
    public GoogleMap mMap;
    private Calendar myCalendar;
    private Button rdvOkButton;
    private boolean nameRdvSet;
    private boolean dateRdvSet;
    private boolean hourRdvSet;
    private EditText datePickerText;
    private final int REQUEST_PERMISSION_PHONE_LOCATION = 1;
    private Criteria critere = new Criteria();
    private LocationManager locationManager;
    private LocationService locationService;
    private DisplayThread updateMyPosition;
    private int currentGroup = 0;
    private int currentTag = 0;
    public static MapFragment instance = null;
    public VolleyRequester restRequester = null;
    private Map<String, Marker> markers = new HashMap<String, Marker>();
    private Map<Integer, Polyline> trace = new HashMap<Integer, Polyline >();
    private HashMap<Drawing, GroundOverlay> drawings = new HashMap<>();
    private Bitmap cap;
    private LatLng positionBeforeDrawing;
    private float zoomBeforeDrawing;
    private boolean showDrawings;
    private boolean showTraces;
    private SharedPreferences sharedPreferences;

    public int getCurrentGroup(){return currentGroup;}
    public void setCurrentGroup(int group)
    {
        currentGroup = group;
        SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.putInt("groupId", group);
        edit.commit();
    }

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, Bundle savedInstanceState) {
        sharedPreferences = getActivity().getApplicationContext()
                .getSharedPreferences("OnePointMan", Context.MODE_PRIVATE);
        showDrawings = sharedPreferences.getBoolean("showDrawing", false);
        showTraces = sharedPreferences.getBoolean("showTraces", false);
        currentGroup = sharedPreferences.getInt("groupId", 0);
        View view = inflater.inflate(R.layout.fragment_map, container, false);
        ImageButton upButton = (ImageButton) view.findViewById(R.id.center_position);
        upButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Log.v("BOUTTON", "Clic");
                synchronized(markers) {
                    if ((mMap != null) && (markers.get("_MY_SELF_") != null)) {
                        LatLng ltLg = markers.get("_MY_SELF_").getPosition();
                        mMap.animateCamera(CameraUpdateFactory.newLatLngZoom(ltLg, 15));
                    } else {
                        Toast.makeText(getActivity().getApplicationContext(), "Impossible de trouver votre position.", Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
        Log.v("CREATE VIEW MAP FRAGMEN", "Create view "+currentGroup);
        return view;
    }

    @Override
    public void onStart(){
        cap = BitmapFactory.decodeResource(getActivity().getResources(), R.drawable.cap);
        super.onStart();
        restRequester = VolleyRequester.getInstance(getActivity().getApplicationContext());
        restRequester.groupsRequest();
        instance = this;
        startGpsService();
        Log.v("ON START MAP FRAGMEN", "On start "+currentGroup);
        if(showDrawings)
        {
            VolleyRequester.getInstance(getActivity().getApplicationContext()).getDrawings(currentGroup);
        }
    }

    @Override
    public void onStop(){
        super.onStop();
        stopDisplayThread();
        Log.v("ON STOP MAP FRAGMEN", "On stop "+currentGroup);
    }

    @Override
    public void onMapReady(GoogleMap googleMap) {
        mMap = googleMap;
        mMap.setOnMarkerClickListener(new GoogleMap.OnMarkerClickListener() {
            @Override
            public boolean onMarkerClick(Marker marker) {
                popupBuilderInfoMarker(marker).show();
                return false;
            }
        });

        mMap.setOnGroundOverlayClickListener(new GoogleMap.OnGroundOverlayClickListener() {
            @Override
            public void onGroundOverlayClick(GroundOverlay groundOverlay) {
                int idDrawing = (int)groundOverlay.getTag();
                popupDeleteDrawing(idDrawing).show();
            }
        });

        mMap.setOnMapLongClickListener(new GoogleMap.OnMapLongClickListener() {
            @Override
            public void onMapLongClick(final LatLng latLng) {
                //Ouvrir un popup
                //Groupe
                //Date RDV
                //Description

                Log.v("TEST", latLng.latitude + " ; " + latLng.longitude);
                hourRdvSet = false;
                dateRdvSet = false;
                nameRdvSet = false;
                final Dialog rdvDialog = new Dialog(getActivity());
                rdvDialog.setTitle("Placer un point de rendez-vous");
                rdvDialog.setContentView(R.layout.rdv_dialog);
                rdvDialog.create();

                datePickerText = rdvDialog.findViewById(R.id.rdvDate);
                myCalendar = Calendar.getInstance();

                final EditText descriptionRdv = ((EditText)rdvDialog.findViewById(R.id.rdvDescription));

                descriptionRdv.addTextChangedListener(new TextWatcher() {
                    @Override
                    public void beforeTextChanged(CharSequence charSequence, int i, int i1, int i2) {

                    }

                    @Override
                    public void onTextChanged(CharSequence charSequence, int i, int i1, int i2) {
                        if(charSequence.toString().trim().length() == 0)
                        {
                            nameRdvSet = false;
                        }
                        else
                        {
                            nameRdvSet = true;
                        }
                        checkIfDialogButtonCanBeClickable();
                    }

                    @Override
                    public void afterTextChanged(Editable editable) {
                        if(descriptionRdv.getText().length() > 0)
                        {
                            nameRdvSet = true;
                            checkIfDialogButtonCanBeClickable();
                        }
                    }
                });

                final DatePickerDialog.OnDateSetListener date = new DatePickerDialog.OnDateSetListener() {
                    @Override
                    public void onDateSet(DatePicker view, int year, int monthOfYear,
                                          int dayOfMonth) {
                        myCalendar.set(Calendar.YEAR, year);
                        myCalendar.set(Calendar.MONTH, monthOfYear);
                        myCalendar.set(Calendar.DAY_OF_MONTH, dayOfMonth);
                        updateLabel(datePickerText);
                        dateRdvSet = true;
                        checkIfDialogButtonCanBeClickable();
                    }
                };

                datePickerText.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        new DatePickerDialog(getActivity(), date, myCalendar.get(Calendar.YEAR), myCalendar.get(Calendar.MONTH),
                                myCalendar.get(Calendar.DAY_OF_MONTH)).show();
                    }
                });

                final EditText hourPickerText = rdvDialog.findViewById(R.id.rdvHour);
                hourPickerText.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        int hour = myCalendar.get(Calendar.HOUR_OF_DAY);
                        int minute = myCalendar.get(Calendar.MINUTE);

                        TimePickerDialog mTimePicker;
                        mTimePicker = new TimePickerDialog(getActivity(), new TimePickerDialog.OnTimeSetListener() {
                            @Override
                            public void onTimeSet(TimePicker timePicker, int selectedHour, int selectedMinute) {
                                boolean conditionM = false;
                                boolean conditionH = false;
                                if(selectedMinute<10){
                                    conditionM = true;
                                }
                                if(selectedHour<10){
                                    conditionH = true;
                                }

                                hourPickerText.setText((conditionH?"0":"") + selectedHour + ":"+ (conditionM?"0":"") + selectedMinute + ":00");
                                hourRdvSet = true;
                                checkIfDialogButtonCanBeClickable();
                            }
                        }, hour, minute, true);
                        mTimePicker.setTitle("Choissez l'heure du rendez-vous");
                        mTimePicker.show();
                    }
                });

                rdvOkButton = rdvDialog.findViewById(R.id.rdvOkButton);
                rdvOkButton.setEnabled(false);
                rdvOkButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        String dateString = datePickerText.getText().toString() + " " + hourPickerText.getText().toString();
                        restRequester.sendNewPinPoint(currentGroup, latLng, descriptionRdv.getText().toString(), dateString);
                        rdvDialog.dismiss();
                    }
                });

                Button dismissButton = rdvDialog.findViewById(R.id.rdvDismissButton);
                dismissButton.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        rdvDialog.dismiss();
                    }
                });

                rdvDialog.show();
            }
        });
        if(positionBeforeDrawing != null)
        {
            mMap.moveCamera(CameraUpdateFactory.newLatLngZoom(positionBeforeDrawing,
                    zoomBeforeDrawing));
        }
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
        updateMyPosition = new DisplayThread(currentGroup);
        updateMyPosition.run();
        Log.v("GPS Service", "Display thread started");
    }

    public void stopDisplayThread() {
        if (updateMyPosition != null && updateMyPosition.getdisplayThreadRunning()) {
            updateMyPosition.stopDisplay();
            Log.v("GPS Service", "Display thread stopped");
        }
    }

    public void addMarker(String name, MarkerOptions marker){
        synchronized(markers) {
            if (markers.get(name)!= null){
                markers.get(name).remove();
            }

            if (name.length() > 8) {
                if (name.substring(0, 8).equals("Pinpoint")) {
                    markers.put(name, mMap.addMarker(marker));
                    Marker pinpoint = markers.get(name);
                    pinpoint.setTag(Integer.parseInt(name.substring(8)));
                } else {
                    markers.put(name, mMap.addMarker(marker));
                    Marker classicMarker = markers.get(name);
                    classicMarker.setTag(0);
                }
            } else {
                markers.put(name, mMap.addMarker(marker));
                Marker classicMarker = markers.get(name);
                classicMarker.setTag(0);
            }
        }
    }

    public void clearMarkers(){
        synchronized(markers) {
            mMap.clear();
            markers.clear();
            trace.clear();
            clearDrawings();
        }
    }

    public AlertDialog popupDeleteDrawing(final int drawId){
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        builder.setMessage("Voulez-vous vraiment supprimer ce dessin?")
                .setTitle("Suppression du dessin");

        builder.setPositiveButton("Annuler", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();
            }
        });

        builder.setNeutralButton("Supprimer", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                VolleyRequester.getInstance(getActivity().getApplicationContext()).deleteDrawing(drawId);
            }
        });
        return builder.create();
    }

    public AlertDialog popupBuilderInfoMarker(final Marker marker){
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());

        builder.setMessage(marker.getSnippet())
                .setTitle(marker.getTitle());

        builder.setPositiveButton("OK", new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int id) {
                dialog.dismiss();
            }
        });


        Log.v("DIALOG", marker.getTag().toString());
        currentTag = (int)marker.getTag();
        if (currentTag>0) {
            builder.setNeutralButton("Supprimer", new DialogInterface.OnClickListener() {
                @Override
                public void onClick(DialogInterface dialogInterface, int i) {
                    restRequester.deletePinPoint(currentGroup, currentTag);
                    markers.remove("Pinpoint"+currentTag);
                }
            });
        }


        return builder.create();
    }

    private void updateLabel(EditText datePickerPlaceholder) {
        String myFormat = "yyyy-MM-dd"; //In which you need put here
        SimpleDateFormat sdf = new SimpleDateFormat(myFormat, Locale.CANADA_FRENCH);

        datePickerPlaceholder.setText(sdf.format(myCalendar.getTime()));
    }

    private void checkIfDialogButtonCanBeClickable()
    {
        if(hourRdvSet && dateRdvSet && nameRdvSet)
        {
            rdvOkButton.setEnabled(true);
        }
        else
        {
                rdvOkButton.setEnabled(false);
        }
    }

    public void takeSnapshotAndLauchDrawFragment(final FragmentManager fm) {
        GoogleMap.SnapshotReadyCallback callback = new GoogleMap.SnapshotReadyCallback() {
            @Override
            public void onSnapshotReady(Bitmap snapshot) {
                Log.v("SNAPSHOT", "SNAPSHOT TOOK");
                LatLngBounds bounds = mMap.getProjection().getVisibleRegion().latLngBounds;
                DrawFragment drawFragment = new DrawFragment();
                drawFragment.setBackground(snapshot);
                drawFragment.setZoom(getCurrentZoom());
                drawFragment.setBounds(bounds);
                drawFragment.setIdgroup(currentGroup);
                zoomBeforeDrawing = getCurrentZoom();
                positionBeforeDrawing = mMap.getCameraPosition().target;
                fm.beginTransaction().replace(R.id.content_frame, drawFragment, "DRAW_FRAGMENT").commit();
            }
        };
        mMap.snapshot(callback);
    }

     public void updateTraceFromJson(JSONObject traceJson, int colorInt){
        int color = Color.argb(255,0,0,0);;
        switch (colorInt%8){
            case 0:
                color = Color.argb(255,0,0,0);
                break;
            case 1:
                color = Color.argb(255,0,0,255);
                break;
            case 2:
                color = Color.argb(255,0,255,0);
                break;
            case 3:
                color = Color.argb(255,0,255,255);
                break;
            case 4:
                color = Color.argb(255,255,0,0);
                break;
            case 5:
                color = Color.argb(255,255,0,255);
                break;
            case 6:
                color = Color.argb(255,255,255,0);
                break;
            case 7:
                color = Color.argb(255,255,255,255);
                break;
        }

        //Entrée: trace{userid, pos[{lt,lg},...]}
         try {
             JSONObject position;
             PolylineOptions line = new PolylineOptions();
             line.color(color);

             //Pour chaque position
             for(int i=0; i< traceJson.getJSONArray("tracking").length(); i++) {
                 position = traceJson.getJSONArray("tracking").getJSONObject(i);
                 line.add(new LatLng(position.getDouble("lat"),position.getDouble("lng")));
             }
             line.startCap(new CustomCap(BitmapDescriptorFactory.fromBitmap(cap),30));

             trace.put(traceJson.getInt("iduser"), mMap.addPolyline(line));
         } catch (JSONException e) {
             e.printStackTrace();
         }

     }

    public float getCurrentZoom()
    {
        return mMap.getCameraPosition().zoom;
    }

    public LatLng getCurrentPosition()
    {
        return mMap.getCameraPosition().target;
    }

    public void clearDrawings()
    {
        drawings.clear();
    }

    public void displayDrawing(Drawing drawing)
    {
        GroundOverlayOptions drawingOverlayOptions = new GroundOverlayOptions()
                .image(BitmapDescriptorFactory.fromBitmap(drawing.getImage()))
                .positionFromBounds(drawing.getBounds())
                .clickable(true);
        
        GroundOverlay drawingOverlay =  mMap.addGroundOverlay(drawingOverlayOptions);
        drawingOverlay.setTag(drawing.getIdDrawing());
        this.drawings.put(drawing, drawingOverlay);
    }

    public void addDrawingToList(JSONObject draw)
    {
        try
        {
            int idDrawing = draw.getInt("iddrawing");
            boolean alreadyExist = false;
            Drawing drawing = null;
            for(Drawing d : this.drawings.keySet())
            {
                if(d.getIdDrawing() == idDrawing)
                {
                    drawing = d;
                    alreadyExist = true;
                }
            }
            if (!alreadyExist) {
                String idCreator = draw.getString("idcreator");
                String nomCreator = draw.getString("nomcreator");
                String prenomCreator = draw.getString("prenomcreator");
                LatLng sw = new LatLng(Double.parseDouble(draw.getString("swlt")),
                        Double.parseDouble(draw.getString("swlg")));
                LatLng ne = new LatLng(Double.parseDouble(draw.getString("nelt")),
                        Double.parseDouble(draw.getString("nelg")));
                LatLngBounds bounds = new LatLngBounds(sw, ne);
                String stringImage = draw.getString("img");

                drawing = new Drawing(idDrawing, getCurrentGroup(), idCreator, nomCreator,
                        prenomCreator, bounds, stringImage);
            }
            if(isShowDrawings())
                displayDrawing(drawing);
        }
        catch(Exception ex)
        {
            Log.v("MAP_FRAG_DRAW", "Error poto: "+ex.getMessage());
        }


    }

    public boolean isShowDrawings() {
        return showDrawings;
    }

    public void setShowDrawings(boolean showDrawings)
    {
        this.showDrawings = showDrawings;
        SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.putBoolean("showDrawing", showDrawings);
        edit.commit();
    }

    public boolean isShowTraces() {
        return showTraces;
    }

    public void setShowTraces(boolean showTraces) {
        this.showTraces = showTraces;
        SharedPreferences.Editor edit = sharedPreferences.edit();
        edit.putBoolean("showTraces", showTraces);
        edit.commit();
    }
}