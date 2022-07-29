DROP PROCEDURE IF EXISTS new_client;

CREATE PROCEDURE new_client (IN name TINYTEXT, IN username VARCHAR(256)) BEGIN
  DECLARE client_id INT UNSIGNED DEFAULT 0;
  INSERT INTO clients (uid, name, username) VALUES (UUID(), name, username);
  SET client_id = last_insert_id();
  UPDATE clients
    SET clients.name=name
    WHERE clients.id=client_id;

  SELECT clients.uid, clients.name, clients.username FROM clients WHERE clients.id=client_id;
END;