CREATE TABLE `files` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `data` longblob NOT NULL,
  `author` varchar(36) NOT NULL,
  `t_uploaded` bigint unsigned NOT NULL,
  `t_created` bigint unsigned NOT NULL,
  `t_deleted` bigint unsigned NULL,
  `type` varchar(255) NOT NULL
);

ALTER TABLE `files`
ADD `uid` varchar(36) NOT NULL AFTER `id`;

ALTER TABLE `files`
ADD UNIQUE `uid` (`uid`);

ALTER TABLE `files`
ADD FOREIGN KEY (`author`) REFERENCES `clients` (`uid`);

ALTER TABLE `messages`
ADD `attachment` varchar(36) COLLATE 'utf8mb4_general_ci' NULL AFTER `text`;

ALTER TABLE `files`
CHANGE `data` `data` longblob NULL AFTER `uid`;

ALTER TABLE `messages`
ADD FOREIGN KEY (`attachment`) REFERENCES `files` (`uid`);