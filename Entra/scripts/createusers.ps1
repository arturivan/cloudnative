Import-Module Microsoft.Graph
Connect-MgGraph -Scopes "User.Read.All", "Group.ReadWrite.All" -UseDeviceAuthentication

# Specifing the path to the CSV file containing user data
$csvFilePath = "C:\Users\sandbox\Desktop\Entra\createusers.csv"

# Read the CSV file 
$usersData = Import-Csv -Path $csvFilePath

# Loop through each row in the CSV and create users
foreach ($userRow in $usersData) {
    # Prepare the user properties
    $displayName = $userRow.'Name [displayName] Required'
    $userPrincipalName = $userRow.'User name [userPrincipalName] Required'
    $password = $userRow.'Initial password [passwordProfile] Required'
    $givenName = $userRow.'First name [givenName]'
    $surname = $userRow.'Last name [surname]'

    # Create the password profile
    $passwordProfile = @{
        Password = $password
        ForceChangePasswordNextSignIn = $true
    }

    # Create the user object
    $userParams = @{
        DisplayName = $displayName
        UserPrincipalName = $userPrincipalName
        PasswordProfile = $passwordProfile
        AccountEnabled = $false
        GivenName = $givenName
        Surname = $surname
        MailNickName = ($userPrincipalName -split "@")[0] # Automatically generate MailNickName from UPN
    }

    # Create the user in Entra 
    try {
        New-MgUser @userParams
        Write-Host "User '$displayName' ($userPrincipalName) created successfully." -ForegroundColor Green
    } catch {
        Write-Host "Error creating user '$displayName' ($userPrincipalName): $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Disconnect from Microsoft Graph
Disconnect-MgGraph

Write-Host "Bulk user creation completed." -ForegroundColor Cyan