
CREATE TABLE `clients` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` varchar(36) NOT NULL,
  `name` tinytext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE PROCEDURE new_client (in name TINYTEXT) BEGIN
  DECLARE client_id INT UNSIGNED DEFAULT 0;
  INSERT INTO clients (uid, clients.name) VALUES (UUID(), name);
  SET client_id = last_insert_id();
  UPDATE clients
    SET clients.name=name
    WHERE clients.id=client_id;

  SELECT clients.uid FROM clients WHERE clients.id=client_id;
END;
