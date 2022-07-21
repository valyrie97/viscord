
USE `viscord`;

ALTER TABLE `messages`
ADD COLUMN `t_sent` BIGINT UNSIGNED AFTER `text`;

INSERT INTO `migrations` ()
  VALUES ();