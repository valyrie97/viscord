SELECT * FROM messages
  WHERE channel_uid=?
  ORDER BY t_sent
  LIMIT 100;