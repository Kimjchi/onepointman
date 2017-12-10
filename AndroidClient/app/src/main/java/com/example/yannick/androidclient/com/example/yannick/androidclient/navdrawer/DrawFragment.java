package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.app.Fragment;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

/**
 * Created by yannick on 10/12/17.
 */

public class DrawFragment extends Fragment
{
    private Bitmap background;

    public DrawFragment()
    {

    }

    @Override
    public View onCreateView(LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState)
    {
        Log.v("DRAWFRAG", "DrawFrag lancer");
        View view = new TouchEventView(getActivity().getApplicationContext(), null, background);
        return view;
    }

    public void setBackground(Bitmap background)
    {
        this.background = background;
    }
}
