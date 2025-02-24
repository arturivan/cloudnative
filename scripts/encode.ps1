# Specify the path to the kubeconfig file
$kubeConfigPath = "A:\your-path"

# Read the content of the kubeconfig file
$kubeConfigContent = Get-Content -Path $kubeConfigPath -Raw

# Base64 encode the content
$base64Encoded = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($kubeConfigContent))

# Save the base64-encoded content to a file
$base64Encoded | Out-File "A:\your-path"