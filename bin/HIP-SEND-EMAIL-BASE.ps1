
param (
  [string]$data,
  [string]$address,
  [string]$mode,
  [string]$env,
  [bool]$debug = 0
)

$pg = 'dev-check-conf.ps1'
$Modes = @('dry', 'run', 'ethereal')
$Envs = @('dev', 'prod', 'test')
$EOL = [Environment]::NewLIne

function usage {
  Write-Host '============================================================'
  Write-Host ' USAGE: ' $pg ' -data <PATH-TO-DATA> -mode <MODE> [-env <ENV>] [-address <PATH-TO-ADDRESSBOOK>]'
  Write-Host ''
  Write-Host '   PATH-TO-DATA:        list of employees that are not enrolled yet; MUST be in rich text fomat (.rtf)'
  Write-Host '   PATH-TO-ADDRESSBOOK: list of WDCODE and email addresses'
  Write-Host '   ENV:                 {prod|dev|test}; default dev'
  Write-Host '   MODE:                {run|dry|ethereal}'
  Write-Host '============================================================'
}

$base = (Split-Path $PSScriptRoot -Parent)
$script = $base + '\dist\index.js'

if ([string]::IsNullOrEmpty($data)) {
  #$data = $base + '\test\not-enrolled-list.rtf'
  Write-Host $EOL 'Error: No Data Specified' $EOL
  usage
  exit
}

if (-not (Test-Path $data)) {
  Write-Host $EOL 'Error: File Not Found:' $data $EOL
  usage
  exit
}

if ([string]::IsNullOrEmpty($address)) {
  $address = $base + '\test-address-me.csv'
  #$address = $base + '\test-address.csv'
  #$address = $base + '\address-prod.csv'
}

if ([string]::IsNullOrEmpty($mode)) {
  Write-Host $EOL 'Error: Mode Not Specified' $EOL
  usage
  exit
} elseif (-not ($Modes -contains $mode)) {
  Write-Host $EOL 'Error: Invalid Mode:' $mode $EOL
  usage
  exit
}

if ([string]::IsNullOrEmpty($env)) {
  $env = 'development'
} elseif ($env -eq 'dev') {
  $env = 'development'
} elseif ($env -eq 'prod') {
  $env = 'production'
} elseif ($env -eq 'test') {
} else {
  Write-Host $EOL 'Error: Unspoorted ENV:' $env $EOL
  usage
  exit
}

function showParams {
  Write-Host '--------------------------------'
  Write-Host $script
  Write-Host $data
  Write-Host $address
  Write-Host $mode
  Write-Host $env
  Write-Host $opt
  Write-Host '--------------------------------'
}

if ($debug) {
  showParams
  Write-Host 'node.exe' $script $data $address $opt
}

Write-Host 'Starting program'
if ($mode -eq 'run') {
  node.exe $script $data $address --env $env --run
} elseif ($mode -eq 'dry') {
  node.exe $script $data $address --env $env --dry
} elseif ($mode -eq 'ethereal') {
  node.exe $script $data $address --env $env --ethereal
}

