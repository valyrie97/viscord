
-- add usernames, separate
-- from display name! (this is for uniqueness)
ALTER TABLE `clients`
ADD `username` varchar(256) COLLATE 'utf8mb4_general_ci' NOT NULL;

-- set all previous accounts usernames to their uid
-- as its unique, and now powerless for authentication.
UPDATE clients
SET clients.username=clients.uid;

-- make username unique
ALTER TABLE `clients`
ADD UNIQUE `username` (`username`);

-- create sessions w FK to clients
CREATE TABLE `sessions` (
  `id` int NOT NULL,
  `client_uid` varchar(36) NOT NULL,
  `expires` bigint(20) NOT NULL,
  `token` varchar(512) NOT NULL
);

ALTER TABLE `sessions`
ADD FOREIGN KEY (`client_uid`) REFERENCES `clients` (`uid`);

ALTER TABLE `sessions`
CHANGE `id` `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY FIRST;