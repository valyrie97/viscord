INSERT INTO messages (
  `text`,
  sender_uid,
  `uid`,
  `t_sent`,
  channel_uid,
  attachment
)
VALUES ( ?, ?, ?, ?, ?, ? );