SELECT setval('public."USER_iduser_seq"', 1, FALSE);
SELECT setval('public."GROUP_idgroup_seq"',1,FALSE);

INSERT INTO public."USER" (position, nom, prenom) VALUES (ST_GeomFromText('POINT(-71.060316 48.432044)', 4326), 'NIQUETA', 'Maman');
INSERT INTO public."USER" (nom, prenom) VALUES ('Watson', 'Emma');
INSERT INTO public."USER" (nom, prenom) VALUES ('Radcliffe', 'Daniel');
INSERT INTO public."USER" (nom, prenom) VALUES ('QuifaitRonWeaslay', 'LacteurRoux');
INSERT INTO public."USER" (nom, prenom) VALUES ('Smeagol', 'Gollum');
INSERT INTO public."USER" (nom, prenom) VALUES ('LeSage', 'Samwise');
INSERT INTO public."USER" (nom, prenom) VALUES ('LeFag', 'Frodon');

INSERT INTO public."GROUP" (nom) VALUES ('HarryPotter');
INSERT INTO public."GROUP" (nom) VALUES ('LOTR');
INSERT INTO public."GROUP" (nom) VALUES ('Female');
INSERT INTO public."GROUP" (nom) VALUES ('Male');

INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (2, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (3, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (4, 1);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (5, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (6, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (7, 2);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (1, 3);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (2, 3);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (3, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (4, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (5, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (6, 4);
INSERT INTO public."USER_GROUP" (iduser, idgroup) VALUES (7, 4);














