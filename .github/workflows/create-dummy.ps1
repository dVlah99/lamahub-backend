# create-dummy-file.ps1
$remoteComputer = "cloudvm2021.westeurope.cloudapp.azure.com"
$remoteUser = "LamaAdmin"
$remotePassword = "LamaLozinka4"
$securePassword = ConvertTo-SecureString $remotePassword -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential ($remoteUser, $securePassword)

Invoke-Command -ComputerName $remoteComputer -Credential $credential -ScriptBlock {
    New-Item -Path "C:\path\to\directory\dummy.txt" -ItemType File -Force
}
