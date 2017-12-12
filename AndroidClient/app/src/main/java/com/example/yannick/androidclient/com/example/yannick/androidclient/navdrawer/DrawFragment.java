package com.example.yannick.androidclient.com.example.yannick.androidclient.navdrawer;

import android.app.AlertDialog;
import android.app.Fragment;
import android.content.DialogInterface;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.SeekBar;

import com.example.yannick.androidclient.R;
import com.flask.colorpicker.ColorPickerView;
import com.flask.colorpicker.OnColorSelectedListener;
import com.flask.colorpicker.builder.ColorPickerClickListener;
import com.flask.colorpicker.builder.ColorPickerDialogBuilder;


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
        View drawLayout = inflater.inflate(R.layout.drawing_layout, container, false);
        final TouchEventView draw = drawLayout.findViewById(R.id.drawingView);
        draw.setBackground(background);

        ImageButton strokeWidthButton = drawLayout.findViewById(R.id.strokeWidthButtonDraw);
        strokeWidthButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                final AlertDialog.Builder popDialog = new AlertDialog.Builder(getContext());
                final SeekBar seek = new SeekBar(getContext());
                seek.setMax(TouchEventView.MAX_VALUE_STROKE * 10);
                seek.setProgress((int) (draw.getStrokeWidth() * 10));
                seek.setKeyProgressIncrement(1);

                popDialog.setTitle("Sélectionner votre épaisseur de trait");
                popDialog.setView(seek);

                seek.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
                    public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                        if(progress >= 10)
                        {
                            draw.setStrokeWidth(progress / 10);
                        }
                    }

                    @Override
                    public void onStartTrackingTouch(SeekBar seekBar) {

                    }

                    @Override
                    public void onStopTrackingTouch(SeekBar seekBar) {

                    }

                });

                popDialog.setPositiveButton("OK",
                        new DialogInterface.OnClickListener() {
                            public void onClick(DialogInterface dialog, int which) {
                                dialog.dismiss();
                            }
                        });
                popDialog.create();
                popDialog.show();

            }
        });

        ImageButton colorPickerButton = drawLayout.findViewById(R.id.colorPickerDraw);
        colorPickerButton.setOnClickListener(new View.OnClickListener() {
                                                 @Override
                                                 public void onClick(View view) {
                                                     ColorPickerDialogBuilder
                                                             .with(getContext())
                                                             .setTitle("Choissisez votre couleur")
                                                             .initialColor(draw.getCurrentColor())
                                                             .wheelType(ColorPickerView.WHEEL_TYPE.FLOWER)
                                                             .density(12)
                                                             .setOnColorSelectedListener(new OnColorSelectedListener() {
                                                                 @Override
                                                                 public void onColorSelected(int selectedColor) {

                                                                 }
                                                             })
                                                             .setPositiveButton("Ok", new ColorPickerClickListener() {
                                                                 @Override
                                                                 public void onClick(DialogInterface dialog, int selectedColor, Integer[] allColors) {
                                                                     draw.changeCurrentColor(selectedColor);
                                                                 }
                                                             })
                                                             .setNegativeButton("Retour", new DialogInterface.OnClickListener() {
                                                                 @Override
                                                                 public void onClick(DialogInterface dialog, int which) {
                                                                 }
                                                             })
                                                             .build()
                                                             .show();
                                                 }
                                             });

        ImageButton redoButton = drawLayout.findViewById(R.id.redoButtonDraw);
        redoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                draw.onRedoClick();
            }
        });

        ImageButton undoButton = drawLayout.findViewById(R.id.undoButtonDraw);
        undoButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                draw.onUndoClick();
            }
        });

        return drawLayout;
    }

    public void setBackground(Bitmap background)
    {
        this.background = background;
    }
}
