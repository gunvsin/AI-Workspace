$Source = "C:\Users\gunvs\AppData\Roaming\omniroute"
$DestinationBase = "C:\Users\gunvs\OmniRoute_Backups"
$DateFolder = Join-Path $DestinationBase ("Backup_" + (Get-Date -Format "yyyy-MM-dd"))

New-Item -ItemType Directory -Force -Path $DateFolder | Out-Null
Copy-Item (Join-Path $Source "storage.sqlite") (Join-Path $DateFolder "storage.sqlite") -Force
Copy-Item (Join-Path $Source "server.env") (Join-Path $DateFolder "server.env") -Force -ErrorAction SilentlyContinue
