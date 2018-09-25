CREATE TABLE IF NOT EXISTS tours(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, image TEXT);
INSERT INTO tours(name, image) VALUES('Tour 1', 'MainQuad.jpg');
INSERT INTO tours(name, image) VALUES('Tour 2', 'IOE.jpg');
INSERT INTO tours(name, image) VALUES('Tour 3', 'MaletPlace.jpg');

CREATE TABLE legs(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, lat FLOAT, long FLOAT, address TEXT);
INSERT INTO legs(name, description, long, lat, address) VALUES('Leg 1', 'description 1',51.524283,-0.134682,"University College London, Gower St, Fitzrovia, London WC1E 6BT, UK");
INSERT INTO legs(name, description, long, lat, address) VALUES('Leg 2', 'description 2',51.524684,-0.134008,'Gower St, Bloomsbury, London WC1E 6BT, UK');
INSERT INTO legs(name, description, long, lat, address) VALUES('Leg 3', 'description 3',51.522935,-0.127997,'20 Bedford Way, Bloomsbury, London WC1H 0AL, UK');
INSERT INTO legs(name, description, long, lat, address) VALUES('Leg 4', 'description 4',51.523186,-0.132257,'2 Malet Pl, Camden Town, London England, UK');
INSERT INTO legs(name, description, long, lat, address) VALUES('Leg 5', 'description 5',51.524948,-0.131573,'31-34 Gordon Square, Kings Cross, London WC1H 0PY, UK');
INSERT INTO legs(name, description, long, lat, address) VALUES('Leg 6', 'description 6',51.523645,-0.133622,'University College London, Gower St, Bloomsbury, London WC1E 6XA, UK');
INSERT INTO legs(name, description, long, lat, address) VALUES('Leg 7', 'description 7',51.522636,-0.131117,'University of London Union, Malet St, Bloomsbury, London, WC1E 7HY, UK');

CREATE TABLE IF NOT EXISTS tourRelations(tourId INTEGER, legId INTEGER);
INSERT INTO tourRelations(tourId, legId) VALUES(1, 1);
INSERT INTO tourRelations(tourId, legId) VALUES(1, 2);
INSERT INTO tourRelations(tourId, legId) VALUES(1, 3);
INSERT INTO tourRelations(tourId, legId) VALUES(2, 4);
INSERT INTO tourRelations(tourId, legId) VALUES(2, 5);
INSERT INTO tourRelations(tourId, legId) VALUES(2, 6);
INSERT INTO tourRelations(tourId, legId) VALUES(3, 1);
INSERT INTO tourRelations(tourId, legId) VALUES(3, 4);
INSERT INTO tourRelations(tourId, legId) VALUES(3, 7);

CREATE TABLE IF NOT EXISTS events(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT);
INSERT INTO events(name, description) VALUES('event1', 'description 1');
INSERT INTO events(name, description) VALUES('event2', 'description 2');
INSERT INTO events(name, description) VALUES('event3', 'description 3');
INSERT INTO events(name, description) VALUES('event4', 'description 4');
INSERT INTO events(name, description) VALUES('event5', 'description 5');
INSERT INTO events(name, description) VALUES('event6', 'description 6');
INSERT INTO events(name, description) VALUES('event7', 'description 7');
INSERT INTO events(name, description) VALUES('event8', 'description 8');

CREATE TABLE IF NOT EXISTS eventRelations(legId INTEGER, eventId INTEGER);
INSERT INTO eventRelations(legId, eventId) VALUES(1, 1);
INSERT INTO eventRelations(legId, eventId) VALUES(2, 2);
INSERT INTO eventRelations(legId, eventId) VALUES(3, 3);
INSERT INTO eventRelations(legId, eventId) VALUES(4, 4);
INSERT INTO eventRelations(legId, eventId) VALUES(5, 5);
INSERT INTO eventRelations(legId, eventId) VALUES(6, 6);
INSERT INTO eventRelations(legId, eventId) VALUES(7, 7);

CREATE TABLE IF NOT EXISTS beacons(id INTEGER PRIMARY KEY AUTOINCREMENT, beaconMajor INTEGER);
INSERT INTO beacons(beaconMajor) VALUES(23896);
INSERT INTO beacons(beaconMajor) VALUES(58610);
INSERT INTO beacons(beaconMajor) VALUES(7354);

CREATE TABLE IF NOT EXISTS legRelations(legId INTEGER, beaconId INTEGER);
INSERT INTO legRelations(legId, beaconId) VALUES(1, 1);
INSERT INTO legRelations(legId, beaconId) VALUES(2, 2);
INSERT INTO legRelations(legId, beaconId) VALUES(3, 3);