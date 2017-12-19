package com.example.yannick.androidclient.com.example.yannick.androidclient.socket;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.login.FacebookInfosRetrieval;
import com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.MapFragment;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;

import org.json.JSONException;
import org.json.JSONObject;

import java.net.URISyntaxException;

public class SocketService extends Service {

    private com.github.nkzawa.socketio.client.Socket socket;
    private static SocketService instance;

    public SocketService()
    {

    }

    public static SocketService getInstance()
    {
        return instance;
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        instance = this;
        try {
            socket = IO.socket("http://192.168.137.1:3002");
            socket.connect();
            JSONObject jsonObject = new JSONObject("{\"userId\":\""+ FacebookInfosRetrieval.user_id+"\"}");
            Log.v("SOCKET", jsonObject.toString());
            socket.emit("mapUserID", jsonObject);
            socket.on("Notification", onNotif);
            socket.on("userAdded Notification", onAddToGroup);
            socket.on("userDeleted Notification", onRemoveFromGroup);
            Log.v("SOCKET", "CREATED");
        } catch (URISyntaxException e) {
            e.printStackTrace();
            Log.v("SOCKET", "FAIL");
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        socket.disconnect();
        socket.off("userAdded Notification", onAddToGroup);
        socket.off("userDeleted Notification", onRemoveFromGroup);
    }

    private Emitter.Listener onNotif = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            Log.v("SOCKET", args[0].toString());
        }
    };

    private Emitter.Listener onRemoveFromGroup = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            sendNotification("Vous avez été retiré du groupe", "");
            Log.v("SOCKET", "Remove");
        }
    };

    private Emitter.Listener onAddToGroup = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            sendNotification("Vous avez été ajouté au groupe", "");
            Log.v("SOCKET", "Add");
        }
    };

    public void sendNotification(String title, String description)
    {
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(MapFragment.instance.getActivity().getApplicationContext())
                        .setSmallIcon(R.mipmap.onepointman)
                        .setContentTitle(title)
                        .setContentText(description);

        mBuilder.setVibrate(new long[]{100, 200, 100, 300});

        NotificationManager mNotificationManager =
                (NotificationManager) MapFragment.instance.getActivity().getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(0, mBuilder.build());
    }

}
