package com.example.yannick.androidclient;

import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageButton;

import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by yannick on 05/12/17.
 */

public class VolleyRequester
{
    private static VolleyRequester instance;
    private RequestQueue requestQueue;
    private static Context context;
    private final String URL_SERVEUR = "http://192.168.0.108:3001";

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

    public void sendMyPosition(Location myPosition){

        String idUser = FacebookInfosRetrieval.user_id;
        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/users/updateposition/" + idUser + "/"
        + myPosition.getLatitude() + "/" + myPosition.getLongitude() +"/", null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        try {
                            if((response.getString("status")) == "succes"){
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

}
