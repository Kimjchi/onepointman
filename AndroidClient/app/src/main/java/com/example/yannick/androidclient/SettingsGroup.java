package com.example.yannick.androidclient;

import android.app.AlertDialog;
import android.content.DialogInterface;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.support.v7.widget.Toolbar;
import android.text.InputType;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Toast;

import java.util.ArrayList;

public class SettingsGroup extends AppCompatActivity {

    private ArrayList<UserModel> userModels;
    private ListView userList;
    public static UserAdapter userAdapter;
    private String newName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_settings_group);

        Toolbar toolbar = (Toolbar) findViewById(R.id.settingsToolbar);
        toolbar.setTitle(getIntent().getExtras().get("groupName").toString());

        setSupportActionBar(toolbar);

        getSupportActionBar().setDisplayShowHomeEnabled(true);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        userList = (ListView) findViewById(R.id.listUserGroup);

        userModels = new ArrayList<>();

        VolleyRequester.getInstance(getApplicationContext()).fillSettingsUserView(userModels, userList);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu)
    {
        getMenuInflater().inflate(R.menu.menu_settings_group, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        int id = item.getItemId();

        System.out.println("Ici" + id);

        switch (id)
        {
            case android.R.id.home:
                onBackPressed();
                break;
            case R.id.addMemberSettings:
                //TODO Lancer l'activite d'ajoute de membre
                System.out.println("Launch activity add member");
                break;
            case R.id.changeNameGroup:
                AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("Changer le nom du groupe");

                final EditText input = new EditText(this);
                input.setInputType(InputType.TYPE_CLASS_TEXT);
                builder.setView(input);
                builder.setMessage("Rentrer le nouveau nom du groupe");

                builder.setPositiveButton("Changer", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        newName = input.getText().toString();
                        //TODO Envoyer la requete de changement de nom
                    }
                });
                builder.setNegativeButton("Retour", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {
                        dialog.cancel();
                    }
                });

                builder.show();
                break;
            case R.id.deleteGroupSettings:
                new AlertDialog.Builder(this)
                        .setTitle("Supprimer le groupe ")
                        .setMessage("Voulez-vous vraiment supprimer ce groupe?")
                        .setIcon(android.R.drawable.ic_dialog_alert)
                        .setPositiveButton(R.string.oui, new DialogInterface.OnClickListener() {

                            public void onClick(DialogInterface dialog, int whichButton) {
                                //TODO Envoyer la requete de delete
                                Toast.makeText(getApplicationContext(), "Groupe delete", Toast.LENGTH_SHORT).show();
                                onBackPressed();
                            }})
                        .setNegativeButton(R.string.non, null).show();
                break;
        }

        return super.onOptionsItemSelected(item);
    }
}
