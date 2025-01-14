# Get the current directory
$currentDirectory = (Get-Location).Path

# Define paths to your certificate and key using the current directory
$certPath = Join-Path -Path $currentDirectory -ChildPath "localhost.crt"
$keyPath = Join-Path -Path $currentDirectory -ChildPath "localhost.key"

# Import the certificate
try {
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2
    $cert.Import($certPath)
    Write-Output "Certificate imported from $certPath"
} catch {
    Write-Error "Failed to import the certificate. $_"
    exit 1
}

# Add certificate to the Local Machine's Trusted Root Certification Authorities store
try {
    $store = New-Object System.Security.Cryptography.X509Certificates.X509Store "Root", "LocalMachine"
    $store.Open("ReadWrite")
    $store.Add($cert)
    $store.Close()
    Write-Output "Certificate added to Trusted Root Certification Authorities store."
} catch {
    Write-Error "Failed to add certificate to the Trusted Root Certification Authorities store. $_"
    exit 1
}

# Add certificate to the Personal store
try {
    $personalStore = New-Object System.Security.Cryptography.X509Certificates.X509Store "My", "LocalMachine"
    $personalStore.Open("ReadWrite")
    $personalStore.Add($cert)
    $personalStore.Close()
    Write-Output "Certificate added to Personal store."
} catch {
    Write-Error "Failed to add certificate to the Personal store. $_"
    exit 1
}

# Output success message
Write-Output "SSL certificate has been successfully installed from $certPath."
