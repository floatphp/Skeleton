# Private Key
openssl genrsa -out localhost.key 2048

# Certificate Signing Request (CSR)
openssl req -new -key localhost.key -out localhost.csr

# Self-Signed Certificate
openssl x509 -req -days 365 -in localhost.csr -signkey localhost.key -out localhost.crt

# Install Certificate
powershell -ExecutionPolicy RemoteSigned -File install.ps1
