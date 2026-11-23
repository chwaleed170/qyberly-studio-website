# Quick install (Windows PowerShell)

1. Download `QYBERLY_Studio_Website_v4.zip` into your Downloads folder.
2. Run this command in PowerShell. It backs up the current project folder before installing v4.

```powershell
$zip=Join-Path $env:USERPROFILE 'Downloads\QYBERLY_Studio_Website_v4.zip'
$dest=Join-Path $env:USERPROFILE 'OneDrive\Documents\WALEED DIGITAL STUDIO\03 - Web Development\02 - Demo Projects\QYBERLY Official Website'
if(!(Test-Path $zip)){throw 'Download the ZIP into Downloads first'}
$stamp=Get-Date -Format yyyyMMdd-HHmmss
if(Test-Path $dest){Move-Item -LiteralPath $dest -Destination "${dest}-backup-$stamp"}
$tmp=Join-Path $env:TEMP "qyberly-v4-$stamp"
Expand-Archive -LiteralPath $zip -DestinationPath $tmp -Force
$src=Join-Path $tmp 'QYBERLY_Studio_Website_v4'
New-Item -ItemType Directory -Path $dest -Force | Out-Null
Copy-Item -Path (Join-Path $src '*') -Destination $dest -Recurse -Force
Remove-Item $tmp -Recurse -Force
Start-Process (Join-Path $dest 'index.html')
Write-Host 'QYBERLY V4 INSTALLED SUCCESSFULLY!' -ForegroundColor Green
```
