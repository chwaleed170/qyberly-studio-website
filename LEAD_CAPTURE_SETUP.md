# QYBERLY lead capture setup
# 1) In Cloudflare Dashboard > Workers & Pages > your Pages project > Settings > Bindings, add a D1 database binding:
#    Variable name: LEADS_DB
#    Database: create/select qyberly-leads
# 2) Open the D1 database > Console and execute schema.sql from this repository.
# 3) Add a Pages secret named QYBERLY_ADMIN_TOKEN with a long random value (32+ characters).
# 4) Redeploy the Pages project after setting bindings/secrets.
# 5) POST /api/leads accepts JSON fields: name,email,business,services[],engagement,budget,timeline,details,source,website(honeypot).
# 6) GET /api/leads requires Authorization: Bearer <QYBERLY_ADMIN_TOKEN>.
# This project does not contain the admin token. Never commit secrets to Git.
