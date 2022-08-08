
SELECT
  messages.t_sent,
  clients.uid as 'from',
  messages.`text` as 'text',
  messages.channel_uid,
  messages.uid as uid
FROM messages
JOIN clients ON messages.sender_uid=clients.uid
WHERE messages.channel_uid=?
ORDER BY -messages.t_sent
LIMIT 100;