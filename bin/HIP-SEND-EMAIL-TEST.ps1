
param (
  [string]$mode,
  [bool]$debug = 0
)

$pg = 'HIP-SEND-EMAIL-TEST.ps1'
$EOL = [Environment]::NewLIne
$Modes = @('dry', 'run', 'ethereal')

function usage {
  Write-Host '============================================================'
  Write-Host ' USAGE: ' $pg ' -mode <MODE>'
  Write-Host ''
  Write-Host '   MODE:                {run|dry}'
  Write-Host '============================================================'
}


$base = (Split-Path $PSScriptRoot -Parent)

$data = $base + '\test-data.rtf'
$address = $base + '\address-prod.csv'

if (-not (Test-Path $data)) {
  Write-Host $EOL 'Error: File Not Found:' $data $EOL
  usage
  exit
}

if (-not (Test-Path $address)) {
  Write-Host $EOL 'Error: File Not Found:' $address $EOL
  usage
  exit
}

if ([string]::IsNullOrEmpty($mode)) {
  $mode = 'dry'
} elseif (-not ($Modes -contains $mode)) {
  Write-Host $EOL 'Error: Invalid Mode:' $mode $EOL
  usage
  exit
}

function showParams {
  Write-Host '--------------------------------'
  Write-Host $data
  Write-Host $address
  Write-Host $mode
  Write-Host '--------------------------------'
}

showParams
#HIP-SEND-EMAIL-BASE.ps1 -data $data -address $address -mode $mode -env test

