package com.example.yannick.androidclient;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.location.Location;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ImageButton;
import android.widget.ListView;

import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by yannick on 05/12/17.
 */

public class VolleyRequester
{
    private static VolleyRequester instance;
    private RequestQueue requestQueue;
    private static Context context;
    private final String URL_SERVEUR = "http://192.168.137.1:3001";

    private VolleyRequester(Context context)
    {
        this.context = context;
        requestQueue = getRequestQueue();
    }

    public static synchronized VolleyRequester getInstance(Context context) {
        if (instance == null) {
            instance = new VolleyRequester(context);
        }
        return instance;
    }

    public RequestQueue getRequestQueue() {
        if (requestQueue == null) {
            requestQueue = Volley.newRequestQueue(context.getApplicationContext());
        }
        return requestQueue;
    }

    public <T> void addToRequestQueue(Request<T> req) {
        getRequestQueue().add(req);
    }

    public void authServer(String idUser, String token)
    {
        String json = "{\"iduser\":"+ idUser + ",\"token\":"
                + token + "}";
        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest authRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/authAndroid", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            System.out.println("Connexion à TEAM BACKEND OK MAGGLE");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    System.out.println("Auth failed");
                }
            });
            this.addToRequestQueue(authRequest);
        }
        catch(Exception ex)
        {
            System.out.println(ex.toString());
        }
    }

    public void connectToFbFromServer()
    {
        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/fblogin", null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(final JSONObject response) {
                        try {
                            System.out.println("Response: " + response.toString());
                            String uri = response.getString("redirectURI") +  "app_id=" + response.getString("client_id")+
                                    "redirect_uri=" + "http://google.com";
                            AlertDialog.Builder alert = new AlertDialog.Builder(context);
                            alert.setTitle("Title here");

                            WebView wv = new WebView(context);
                            wv.loadUrl(uri);
                            wv.setWebViewClient(new WebViewClient() {
                                @Override
                                public boolean shouldOverrideUrlLoading(WebView view, String url) {
                                    view.loadUrl(url);

                                    return true;
                                }
                            });

                            alert.setView(wv);
                            alert.setNegativeButton("Close", new DialogInterface.OnClickListener() {
                                @Override
                                public void onClick(DialogInterface dialog, int id) {
                                    dialog.dismiss();
                                }
                            });
                            alert.show();
                        }
                        catch(JSONException jsonex)
                        {
                            jsonex.printStackTrace();
                        }

                    }
                }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO Auto-generated method stub
                //MDR LÉ EREUR C POUR LÉ FèBLe

                System.out.println("Erreur lors du login fb");
            }
        });
        this.addToRequestQueue(grpRequest);
    }

    public void groupsRequest(){
        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/groups/2", null,
                new Response.Listener<JSONObject>() {
            @Override
            public void onResponse(JSONObject response) {
                System.out.println("Response: " + response.toString());
            }
        }, new Response.ErrorListener() {

            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO Auto-generated method stub
                //MDR LÉ EREUR C POUR LÉ FèBLe

                System.out.println("Erreur lors de la demande des groupes: " + error.toString());
            }
        });
        this.addToRequestQueue(grpRequest);
    }

    public void displayGroupForNavDrawer(final Menu menuNavDrawer)
    {
        JsonObjectRequest setGroups = new JsonObjectRequest(Request.Method.GET,
                URL_SERVEUR + "/groups/2", null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        System.out.println(response.toString());
                        try {
                            JSONArray array = (JSONArray) response.get("message");

                            for(int i=0; i < array.length(); i++)
                            {
                                final JSONObject groupe = (JSONObject) array.get(i);
                                final int id = groupe.getInt("idgroup");
                                final String name = groupe.getString("nomgroup");
                                final JSONArray membres = (JSONArray) groupe.get("membres");
                                final ArrayList<UserModel> users = new ArrayList<>();
                                for(int j=0; j<membres.length(); j++)
                                {
                                    final JSONObject user = (JSONObject) membres.get(j);
                                    users.add(new UserModel(user.getString("prenom") + user.getString("nomuser"),
                                            user.getInt("iduser")));
                                }
                                MenuItem mi = menuNavDrawer.findItem(R.id.groups)
                                        .getSubMenu().add(0, id, i, name);
                                mi.setIcon(R.drawable.group);
                                ImageButton settingsButton = new ImageButton(context);
                                settingsButton.setImageResource(R.drawable.bouton_style);
                                settingsButton.setBackgroundResource(0);
                                settingsButton.setOnClickListener(new View.OnClickListener() {
                                    @Override
                                    public void onClick(View view) {
                                        Intent settings = new Intent(context, SettingsGroup.class);
                                        settings.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
                                        settings.putExtra("groupName", name);
                                        settings.putExtra("groupdId", id);
                                        settings.putExtra("usersList", users);
                                        context.startActivity(settings);
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
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                System.out.println("Erreur lors de la récupérations des groupes");
            }
        });
        VolleyRequester.getInstance(context).addToRequestQueue(setGroups);
    }

    /*Pour request du JSON:
        https://developer.android.com/training/volley/request.html
     */


    public void sendMyPosition(Location myPosition){
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+ idUser + ",\"userlt\":"
                + myPosition.getLatitude() + ",\"userlg\":" + myPosition.getLongitude() +"}";

        try {
            JSONObject bodyJson = new JSONObject(json);

        JsonObjectRequest postMyPosition = new JsonObjectRequest (Request.Method.POST,
                URL_SERVEUR + "/users/updateposition/", bodyJson,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            Log.v("TAG",response.toString());
                            if((response.getString("status")).equals("success")){
                                Log.v("SEND POSITION", "Position envoyée avec succès!");
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO Auto-generated method stub
                //MDR LÉ EREUR C POUR LÉ FèBLe
                System.out.println("Erreur lors de la demande des groupes: " + error.toString());
            }
        });
            this.addToRequestQueue(postMyPosition);
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    public void groupPositionUpdate(int group){

        //String idUser = FacebookInfosRetrieval.user_id;
        String idUser = "3";
        JsonObjectRequest grpInfoRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/groups/positions/" + idUser + "/" + group, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            if((response.getString("status")).equals("success")){
                                Log.v("GET GROUP INFO", "Information des groupes bien reçues");
                                Log.v("GET GROUP INFO",response.toString());
                                updateMapFromJson(response.getJSONObject("message"));
                            }
                        } catch (JSONException e) {
                            e.printStackTrace();
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                // TODO Auto-generated method stub
                //MDR LÉ EREUR C POUR LÉ FèBLe
                System.out.println("Erreur lors de la demande des positions d'un groupe: " + error.toString());
            }
        });
        this.addToRequestQueue(grpInfoRequest);
    }


    void updateMapFromJson(JSONObject json){
        try {
            //On commence par les pinpoints
            for(int i=0; i< json.getJSONArray("pinpoints").length(); i++) {
                JSONObject pinPoint =  json.getJSONArray("pinpoints").getJSONObject(i);
                int idPinPoint = pinPoint.getInt("idpinpoint");
                int idCreator = pinPoint.getInt("idcreator");
                double lt = Double.parseDouble(pinPoint.getString("pinlt"));
                double lg = Double.parseDouble(pinPoint.getString("pinlg"));
                String desc = pinPoint.getString("description");

                String pinPointTitle = "Createur:" + idCreator +"\r\n"
                        + "Point de rdv n°" + idPinPoint + "\r\n"
                        + "Description: " + desc;

                MarkerOptions marker = new MarkerOptions()
                        .position(new LatLng(lt, lg))
                        .title(pinPointTitle)
                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE));

                MapFragment activity = MapFragment.instance;
                activity.addMarker("Pinpoint" + idPinPoint, marker);
            }

            for(int i=0; i< json.getJSONArray("userpositions").length(); i++) {
                JSONObject usersPosition =  json.getJSONArray("userpositions").getJSONObject(i);
                //{"status":"success","message":{"idgroup":"4","pinpoints":
                // [{"idpinpoint":4,"idcreator":6,"pinlt":"23.000000","pinlg":"45.000000","description":"tous les memes","daterdv":null}],
                // "userpositions":[{"iduser":3,"userlt":"7.000000","userlg":"5.000000","current":true,"dateposition":null},
                // {"iduser":4,"userlt":"7.000000","userlg":"5.000000","current":true,"dateposition":null},
                // {"iduser":5,"userlt":"7.000000","userlg":"5.000000","current":true,"dateposition":null},
                // {"iduser":6,"userlt":"7.000000","userlg":"5.000000","current":true,"dateposition":null},
                // "iduser":7,"userlt":"7.000000","userlg":"5.000000","current":true,"dateposition":null}]}}

                int iduser = usersPosition.getInt("iduser");
                double userlt = Double.parseDouble(usersPosition.getString("userlt"));
                double userlg = Double.parseDouble(usersPosition.getString("userlg"));
                String dateposition = usersPosition.getString("dateposition");

                String usersPositionTitle = "IdUser" + iduser;
                String usersPositionSnippet = "Date dernière position:" + dateposition;
                float color;
                if (usersPosition.getBoolean("current")){
                    color = BitmapDescriptorFactory.HUE_GREEN;
                } else {
                    color = BitmapDescriptorFactory.HUE_RED;
                }

                MarkerOptions marker = new MarkerOptions()
                        .position(new LatLng(userlt, userlg))
                        .title(usersPositionTitle)
                        .snippet(usersPositionSnippet)
                        .icon(BitmapDescriptorFactory.defaultMarker());


                MapFragment activity = MapFragment.instance;
                activity.addMarker(Integer.toString(iduser), marker);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }
}
