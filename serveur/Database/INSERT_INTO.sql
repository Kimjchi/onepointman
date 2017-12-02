SELECT setval('public."USER_iduser_seq"', 1, FALSE);
INSERT INTO public."USER" (position, nom, prenom) VALUES (ST_GeomFromText('POINT(-71.060316 48.432044)', 4326), 'NIQUETA', 'Maman');