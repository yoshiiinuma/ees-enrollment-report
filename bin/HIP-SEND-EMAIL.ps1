
param (
  [string]$data,
  [string]$mode,
  [bool]$debug = 0
)

$pg = 'HIP-SEND-EMAIL.ps1'
$Modes = @('dry', 'run', 'ethereal')
$Envs = @('dev', 'prod', 'test')
$EOL = [Environment]::NewLIne

function usage {
  Write-Host '============================================================'
  Write-Host ' USAGE: ' $pg ' -data <PATH-TO-DATA> -mode <MODE>'
  Write-Host ''
  Write-Host '   PATH-TO-DATA:        list of employees that are not enrolled yet; MUST be in rich text fomat (.rtf)'
  Write-Host '   MODE:                {run|dry}'
  Write-Host '============================================================'
}


$base = (Split-Path $PSScriptRoot -Parent)

$address = $base + '\address-prod.csv'

if ([string]::IsNullOrEmpty($data)) {
  Write-Host $EOL 'Error: No Data Specified' $EOL
  usage
  exit
}

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
  Write-Host '--------------------------------'
}

showParams
#HIP-SEND-EMAIL-BASE.ps1 -data $data -address $address -mode $mode -env production

