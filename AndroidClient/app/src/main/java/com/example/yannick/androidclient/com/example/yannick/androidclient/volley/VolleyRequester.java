package com.example.yannick.androidclient.com.example.yannick.androidclient.volley;

import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.res.ColorStateList;
import android.graphics.Color;
import android.location.Location;
import android.support.v4.widget.CompoundButtonCompat;
import android.util.Log;
import android.view.Gravity;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.WindowManager;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.ListView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist.AddUserToGroup;
import com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist.UserAdapterAdd;
import com.google.android.gms.maps.model.BitmapDescriptorFactory;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.MarkerOptions;
import com.example.yannick.androidclient.com.example.yannick.androidclient.friendlist.UserModelAdd;
import com.example.yannick.androidclient.com.example.yannick.androidclient.login.FacebookInfosRetrieval;
import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.settings.UserModelSettings;
import com.example.yannick.androidclient.com.example.yannick.androidclient.settings.SettingsGroup;
import com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.MapFragment;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

/**
 * Created by yannick on 05/12/17.
 */

public class VolleyRequester
{
    private static VolleyRequester instance;
    private RequestQueue requestQueue;
    private static Context context;
    //private final String URL_SERVEUR = "http://192.168.0.108:3001";
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
        String json = "{\"userId\":\""+ idUser + "\",\"token\":\""
                + token + "\"}";
        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest authRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/fblogin/" +
                            "authAndroid", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {

                            Log.v("CONNEXION_BACKEND", "Connexion à TEAM BACKEND OK MAGGLE");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("ErrorAuth", "Authentification au serveur echouée");
                    error.printStackTrace();
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
        String idUser = FacebookInfosRetrieval.user_id;
        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/groups/"+ idUser, null,
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
        String idUser = FacebookInfosRetrieval.user_id;
        JsonObjectRequest setGroups = new JsonObjectRequest(Request.Method.GET,
                URL_SERVEUR + "/groups/" + idUser, null,
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
                                final boolean isSharing = groupe.getBoolean("issharing");
                                final JSONArray membres = (JSONArray) groupe.get("membres");
                                final ArrayList<UserModelSettings> users = new ArrayList<>();
                                for(int j=0; j<membres.length(); j++)
                                {
                                    final JSONObject user = (JSONObject) membres.get(j);
                                    users.add(new UserModelSettings(user.getString("prenom") + user.getString("nomuser"),
                                            user.get("iduser").toString(), id));
                                }
                                MenuItem mi = menuNavDrawer.findItem(R.id.groups)
                                        .getSubMenu().add(0, id, i, name);
                                //mi.setIcon(R.drawable.group);
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

                                CheckBox sharingPositionBox = new CheckBox(context);
                                int states[][] = {{android.R.attr.state_checked}, {}};

                                int colors[] = {Color.BLACK, Color.BLACK};
                                CompoundButtonCompat.setButtonTintList(sharingPositionBox, new ColorStateList(states, colors));
                                sharingPositionBox.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
                                    @Override
                                    public void onCheckedChanged(CompoundButton compoundButton, boolean b) {
                                        if (b){
                                            Log.v("CHECKBOX","Checked");
                                            updateLocationSharing(true, id);
                                        }else{
                                            Log.v("CHECKBOX","Unchecked");
                                            updateLocationSharing(false, id);
                                        }
                                    }
                                });
                                if (isSharing){
                                    sharingPositionBox.setChecked(true);
                                }

                                LinearLayout test = new LinearLayout(context);
                                test.addView(sharingPositionBox);
                                test.addView(settingsButton);
                                test.setGravity(Gravity.CENTER_VERTICAL);
                                test.setBaselineAligned(true);

                                mi.setActionView(test);
                                mi.setOnMenuItemClickListener(new MenuItem.OnMenuItemClickListener() {
                                    @Override
                                    public boolean onMenuItemClick(MenuItem menuItem) {
                                        System.out.println("Clicked on " + menuItem.getItemId());
                                        MapFragment activity = MapFragment.instance;
                                        activity.setCurrentGroup(id);
                                        activity.clearMarkers();
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


    public void updateLocationSharing(boolean share, int idGroup){
        String idUser = FacebookInfosRetrieval.user_id;
        String json = "{\"iduser\":"+ idUser + ",\"idgroup\":"
                + idGroup + ",\"positionSharing\":" + share +"}";

        try {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest postMyPosition = new JsonObjectRequest (Request.Method.POST,
                    URL_SERVEUR + "/users/updatepositionsharing/", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                        Log.v("SHARING POSITION", "Partage de position mis à jour!");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    // TODO Auto-generated method stub
                    //MDR LÉ EREUR C POUR LÉ FèBLe
                    Toast.makeText(context,"Serveur indisponible, partage de position mis à jour!", Toast.LENGTH_SHORT);
                }
            });
            this.addToRequestQueue(postMyPosition);
        } catch (JSONException e) {
            e.printStackTrace();
        }
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

        String idUser = FacebookInfosRetrieval.user_id;
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
                String userName = pinPoint.getString("prenomcreator") + " " + pinPoint.getString("nomcreator");
                double lt = Double.parseDouble(pinPoint.getString("pinlt"));
                double lg = Double.parseDouble(pinPoint.getString("pinlg"));
                String daterdv = pinPoint.getString("daterdv");
                String desc = pinPoint.getString("description");
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
                Date date = format.parse(daterdv);
                String dateDisplayed = new SimpleDateFormat("HH:mm - dd MM yyyy").format(date);

                String pinPointTitle = "Point de rdv n°" + idPinPoint;


                String pinPointSnippet = "Date: " + dateDisplayed + "\r\n"
                        + "Createur: " + userName + "\r\n"
                        + "Description: " + desc;

                MarkerOptions marker = new MarkerOptions()
                        .position(new LatLng(lt, lg))
                        .title(pinPointTitle)
                        .icon(BitmapDescriptorFactory.defaultMarker(BitmapDescriptorFactory.HUE_BLUE))
                        .snippet(pinPointSnippet);


                MapFragment activity = MapFragment.instance;
                activity.addMarker("Pinpoint" + idPinPoint, marker);
            }
        } catch (JSONException e) {
            e.printStackTrace();
        } catch (ParseException e) {
            e.printStackTrace();
        }
        try {
            for(int i=0; i< json.getJSONArray("userpositions").length(); i++) {
                JSONObject usersPosition = json.getJSONArray("userpositions").getJSONObject(i);
                int iduser = usersPosition.getInt("iduser");
                String userName = usersPosition.getString("prenom") + " " +usersPosition.getString("nom");
                double userlt = Double.parseDouble(usersPosition.getString("userlt"));
                double userlg = Double.parseDouble(usersPosition.getString("userlg"));
                String dateposition = usersPosition.getString("dateposition");
                SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");
                Date date = format.parse(dateposition);
                String dateDisplayed = new SimpleDateFormat("HH:mm - dd MM yyyy").format(date);


                String usersPositionTitle = userName;
                String usersPositionSnippet = "Date dernière position:\r\n" + dateDisplayed;
                float color;
                if (usersPosition.getBoolean("current")) {
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
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    public void deleteUserFromGroup(final String itemId, final int groupId)
    {
        String json = "{\"iduser\":"+itemId+",\"idgroup\":" + groupId + "}";
        System.out.println(json);
        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest deleteRequest = new JsonObjectRequest(Request.Method.DELETE,
                    URL_SERVEUR + "/users/deleteuser", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("DELETE_USER", "User " + itemId + " bien delete du groupe " + groupId);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("DELETE_USER", "Fail to delete user "+itemId + " from group "+groupId + " : "+error.getMessage());
                }

            }){
                @Override
                public String getBodyContentType() {
                    return "application/json";
                }
                };

            this.addToRequestQueue(deleteRequest);
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void addUserToGroup(String itemId, int groupId)
    {
        String json = "{\"iduser\":"+itemId+",\"idgroup\":" + groupId + "}";

        try
        {
            /*
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest deleteRequest = new JsonObjectRequest(Request.Method.DELETE,
                    URL_SERVEUR + "users/deleteuser", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response) {
                            Log.v("DELETE_USER", "User " + itemId + " bien delete du groupe " + groupId);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("DELETE_USER", "Fail to delete user "+itemId + "from group "+groupId);
                }
            });
            this.addToRequestQueue(deleteRequest);*/
        }
        catch(Exception ex)
        {
            ex.printStackTrace();
        }
    }

    public void retreiveUserFriendList(final ArrayList<UserModelSettings> users, final ArrayList<UserModelAdd> toFill, final int idGroup, final ListView listView)
    {
        JsonObjectRequest grpRequest = new JsonObjectRequest (Request.Method.GET,
                URL_SERVEUR + "/users/userFriends/"+FacebookInfosRetrieval.user_id, null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response)
                    {
                        try
                        {
                            JSONArray array = (JSONArray) response.get("friendlist");
                            for(int i=0; i<array.length(); i++)
                            {
                                boolean notFound = true;
                                JSONObject user = (JSONObject) array.get(i);
                                String id = user.getString("id");
                                String name = user.getString("name");

                                if(users != null)
                                {
                                    for(UserModelSettings tmpUser : users)
                                    {
                                        if(id.equals(tmpUser.getId()))
                                        {
                                            notFound = false;
                                            break;
                                        }
                                    }
                                }

                                if(notFound)
                                {
                                    toFill.add(new UserModelAdd(name, id, idGroup, false));
                                }
                            }

                            UserAdapterAdd userAdapter = new UserAdapterAdd(toFill, context);
                            listView.setAdapter(userAdapter);
                            Log.v("FRIENDS_LIST", "Done, friends list bien retrieve");
                        }
                        catch(Exception ex)
                        {
                            Log.v("FRIENDS_LIST", "Erreur lors du fetch de la reponse JSON: "+ex.getMessage());
                        }
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                    Log.v("FRIENDS_LIST", "Erreur lors de la recupération de la liste d'amis: "+error.getMessage());
            }
        });
        this.addToRequestQueue(grpRequest);
    }

    public void createNewGroup(final String newGroupName)
    {
        String json = "{\"iduser\":"+FacebookInfosRetrieval.user_id+", \"groupname\":\""+newGroupName+"\"}";

        try
        {
            JsonObjectRequest deleteRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/groups/creategroup"+newGroupName, null,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response)
                        {
                            Log.v("CREATE_GROUP", "Groupe "+newGroupName+ " bien cree");
                            Intent addUserToGroupIntent = new Intent(context, AddUserToGroup.class);
                            addUserToGroupIntent.putExtra("groupName", newGroupName);
                            addUserToGroupIntent.putExtra("groupId", 2789);
                            addUserToGroupIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_MULTIPLE_TASK);
                            context.startActivity(addUserToGroupIntent);
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(context, "Erreur lors de la création du groupe", Toast.LENGTH_LONG).show();
                    Log.v("CREATE_GROUP", "Fail to create groupe "+newGroupName);
                }
            });
            this.addToRequestQueue(deleteRequest);
        }
        catch(Exception ex)
        {
            Log.v("CREATE_GROUP", "Fail to create groupe "+newGroupName);
        }
    }

    public void changeGroupName(String groupName, final int groupId)
    {
        String json = "{\"idgroup\":"+groupId+", \"newgroupname\":\""+groupName+"\"}";

        try
        {
            JSONObject bodyJson = new JSONObject(json);
            JsonObjectRequest deleteRequest = new JsonObjectRequest(Request.Method.POST,
                    URL_SERVEUR + "/groups/changegroupname/", bodyJson,
                    new Response.Listener<JSONObject>() {
                        @Override
                        public void onResponse(JSONObject response)
                        {
                            Log.v("CHANGE_GROUP_NAME", "GROUPE "+groupId+": Nom du groupe bien changé");
                        }
                    }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Log.v("CHANGE_GROUP_NAME", "GROUPE "+groupId+": Erreur changement de nom du groupe");
                }
            });
            this.addToRequestQueue(deleteRequest);
        }
        catch(Exception ex)
        {
            Log.v("CHANGE_GROUP_NAME", "GROUPE "+groupId+": Erreur changement de nom du groupe");
        }
    }
}
