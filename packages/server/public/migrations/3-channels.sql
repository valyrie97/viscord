
CREATE TABLE `channels` (`id` int(11) NOT NULL AUTO_INCREMENT, `name` TINYTEXT NOT NULL, `uid` TINYTEXT NOT NULL UNIQUE, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO channels (name, uid) VALUES ('General', UUID());

ALTER TABLE `messages` ADD COLUMN `channel_uid` TINYTEXT NOT NULL AFTER `t_sent`;

UPDATE messages SET channel_uid = (SELECT uid FROM channels) where messages.channel_uid = '';

ALTER TABLE `messages` CHANGE `channel_uid` `channel_uid` varchar(36) COLLATE 'utf8mb4_general_ci' NOT NULL AFTER `t_sent`;

ALTER TABLE `channels` CHANGE `uid` `uid` varchar(36) COLLATE 'utf8mb4_general_ci' NOT NULL AFTER `name`;

ALTER TABLE messages ADD CONSTRAINT fk_channel_uid FOREIGN KEY (channel_uid) REFERENCES channels(uid);