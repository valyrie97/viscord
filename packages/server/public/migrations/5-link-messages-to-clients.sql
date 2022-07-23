
-- make uid unique in clients
ALTER TABLE `clients`
ADD UNIQUE `uid` (`uid`);

-- add a sender column for foreign key reference
ALTER TABLE `messages`
ADD `sender_uid` varchar(36) COLLATE 'utf8mb4_general_ci' NOT NULL;

-- create an anonymous user for all previous messages
SELECT @anon_uid := UUID();

INSERT INTO clients (name, uid)
VALUES ('Anonymous', @anon_uid);

UPDATE messages
SET sender_uid=@anon_uid
WHERE sender_uid='';

-- create the foreign key relationship
ALTER TABLE `messages`
ADD FOREIGN KEY (`sender_uid`) REFERENCES `clients` (`uid`);