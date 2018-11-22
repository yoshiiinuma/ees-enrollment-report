
param (
  [string]$data,
  [string]$address
)

$base = (Split-Path $PSScriptRoot -Parent)
$script = $base + '\dist\index.js'

if ([string]::IsNullOrEmpty($data)) {
  $data = $base + '\test\not-enrolled-list.rtf'
}

if ([string]::IsNullOrEmpty($address)) {
  $address = $base + '\test-address-me.csv'
}


Write-Host '--------------------------------'
Write-Host $script
Write-Host $data
Write-Host $address
Write-Host '--------------------------------'

node.exe $script $data $address
