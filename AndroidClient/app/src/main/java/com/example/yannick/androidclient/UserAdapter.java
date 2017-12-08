package com.example.yannick.androidclient;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageButton;
import android.widget.TextView;

import com.squareup.picasso.Picasso;

import java.util.ArrayList;

import de.hdodenhof.circleimageview.CircleImageView;

/**
 * Created by yannick on 06/12/17.
 */

public class UserAdapter extends ArrayAdapter<UserModel> {

    private ArrayList<UserModel> dataSet;
    private Context context;
    private int lastPosition = -1;

    public UserAdapter(ArrayList<UserModel> data, Context context) {
        super(context, R.layout.row_item, data);
        this.dataSet = data;
        this.context = context;
    }

    @Override
    public int getCount() {
        return dataSet.size();
    }

    @Override
    public UserModel getItem(int pos) {
        return dataSet.get(pos);
    }

    @Override
    public long getItemId(int pos) {
        return dataSet.get(pos).getId();
    }

    public int getGroupId()
    {
        return dataSet.get(0).getGroupId();
    }

    @Override
    public View getView(final int position, View convertView, ViewGroup parent) {
        View view = convertView;

        if(view == null)
        {
            LayoutInflater inflater = (LayoutInflater) context.getSystemService(Context.LAYOUT_INFLATER_SERVICE);
            view = inflater.inflate(R.layout.row_item, null);
        }

        CircleImageView pic = view.findViewById(R.id.userImageSettings);

        Picasso.with(getContext()).load("https://graph.facebook.com/"+getItemId(position)+"/picture?type=large")
                .placeholder(R.drawable.hamburger)
                .error(R.drawable.ic_menu_camera)
                .into(pic);

        TextView userName = view.findViewById(R.id.userNameSettings);
        userName.setText(dataSet.get(position).getName());

        ImageButton deleteBtn = view.findViewById(R.id.deleteSettings);

        deleteBtn.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View v) {
                VolleyRequester.getInstance(getContext()).deleteUserFromGroup(getItemId(position), getGroupId());
                dataSet.remove(position);
                notifyDataSetChanged();
            }
        });

        return view;
    }
}
