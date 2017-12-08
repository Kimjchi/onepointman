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
    position geometry(Point,4326),
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
    position geometry(Point,4326),
    creationdate date,
    idcreator integer REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup)
);

CREATE TABLE "DRAWING"(
    iddrawing serial PRIMARY KEY,
    description varchar(255),
    position geometry(Point,4326),
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
    iduser integer REFERENCES "USER" (iduser),
    idgroup integer REFERENCES "GROUP" (idgroup),
    userlatitude double,
    userlongitude double,
    CONSTRAINT pk_USER_GROUP PRIMARY KEY (iduser, idgroup)
);