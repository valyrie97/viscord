SELECT
  uid as clientId,
  name as displayName
FROM clients
WHERE totp IS NOT NULL;