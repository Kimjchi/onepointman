package com.example.yannick.androidclient;

import android.content.Context;
import android.location.Location;
import android.util.Log;

import com.android.volley.NetworkResponse;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;

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

    /*Pour request du JSON:
        https://developer.android.com/training/volley/request.html
     */

}
