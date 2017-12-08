DROP TABLE IF EXISTS "USER" CASCADE;
DROP TABLE IF EXISTS "GROUP" CASCADE;
DROP TABLE IF EXISTS "PINPOINT" CASCADE;
DROP TABLE IF EXISTS "DRAWING" CASCADE;
DROP TABLE IF EXISTS "FRIENDS" CASCADE;
DROP TABLE IF EXISTS "USER_GROUP" CASCADE;



CREATE TABLE "USER"(
    iduser bigint PRIMARY KEY,
    isconnected boolean,
    isloggedin boolean,
    nom varchar(50),
    prenom varchar(50),
    lastconnexion date
);



CREATE TABLE "GROUP"(
    idgroup serial PRIMARY KEY,
    nom varchar(70),
    creationdate date
);

CREATE TABLE "PINPOINT"(
    idpinpoint serial PRIMARY KEY,
    description varchar(255),
    pinlt numeric(9,6),
    pinlg numeric(9,6),
    daterdv date,
    idcreator integer REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup)
);

CREATE TABLE "DRAWING"(
    iddrawing serial PRIMARY KEY,
    description varchar(255),
    drawinglg numeric(9,6),
    drawinglt numeric(9,6),
    actif boolean,
    img bytea,
    idcreator integer REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup)
);

CREATE TABLE "FRIENDS"(
    iduser1 integer REFERENCES "USER" (iduser),
    iduser2 integer REFERENCES "USER" (iduser),
    CONSTRAINT pk_FRIENDS PRIMARY KEY (iduser1, iduser2)
);

CREATE TABLE "USER_GROUP"(
    sharesposition boolean,
    iscreator boolean,
    userglt numeric(9,6),
    userglg numeric(9,6),
    dateposition date,
    iduser integer REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup),
    CONSTRAINT pk_USER_GROUP PRIMARY KEY (iduser, idgroup)
);