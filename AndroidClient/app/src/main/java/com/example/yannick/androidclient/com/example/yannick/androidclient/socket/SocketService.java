package com.example.yannick.androidclient.com.example.yannick.androidclient.socket;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.IBinder;
import android.support.v4.app.NotificationCompat;
import android.util.Log;

import com.example.yannick.androidclient.R;
import com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer.MapFragment;
import com.example.yannick.androidclient.com.example.yannick.androidclient.volley.VolleyRequester;
import com.github.nkzawa.emitter.Emitter;
import com.github.nkzawa.socketio.client.IO;

import java.net.URISyntaxException;

public class SocketService extends Service {

    private com.github.nkzawa.socketio.client.Socket socket;

    public SocketService()
    {

    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            socket = IO.socket(VolleyRequester.getInstance(getApplicationContext()).URL_SERVEUR+":3002");
            socket.connect();
            socket.on("Notification", onNotif);
            socket.on("userAdded Notification", onAddToGroup);
            socket.on("userDeleted Notification", onRemoveFromGroup);
            Log.v("SOCKET", "CREATED");
        } catch (URISyntaxException e) {
            e.printStackTrace();
            Log.v("SOCKET", "FAIL");
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
            Log.v("ON_NOTIF", args[0].toString());
        }
    };

    private Emitter.Listener onAddToGroup = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            sendNotification("Vous avez été retiré du groupe", "");
            Log.v("PUSH", "Remove");
        }
    };

    private Emitter.Listener onRemoveFromGroup = new Emitter.Listener() {
        @Override
        public void call(final Object... args) {
            sendNotification("Vous avez été ajouté au groupe", "");
            Log.v("PUSH", "Add");
        }
    };

    public void sendNotification(String title, String description)
    {
        NotificationCompat.Builder mBuilder =
                new NotificationCompat.Builder(MapFragment.instance.getActivity().getApplicationContext())
                        .setSmallIcon(R.drawable.cap)
                        .setContentTitle(title)
                        .setContentText(description);

        mBuilder.setVibrate(new long[]{100, 200, 100, 300});

        NotificationManager mNotificationManager =
                (NotificationManager) MapFragment.instance.getActivity().getSystemService(Context.NOTIFICATION_SERVICE);
        mNotificationManager.notify(0, mBuilder.build());
    }

}
