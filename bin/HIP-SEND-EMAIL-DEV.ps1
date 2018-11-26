
$pg = 'HIP-SEND-EMAIL-DEV.ps1'
$EOL = [Environment]::NewLIne

function usage {
  Write-Host '============================================================'
  Write-Host ' USAGE: ' $pg ' -data <PATH-TO-DATA> -mode <MODE> [-env <ENV>] [-address <PATH-TO-ADDRESSBOOK>]'
  Write-Host ''
  Write-Host '   PATH-TO-DATA:        list of employees that are not enrolled yet; MUST be in rich text fomat (.rtf)'
  Write-Host '============================================================'
}


$base = (Split-Path $PSScriptRoot -Parent)

$data = $base + '\test\not-enrolled-list.rtf'
$address = $base + '\test-address.csv'

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


function showParams {
  Write-Host '--------------------------------'
  Write-Host $data
  Write-Host $address
  Write-Host '--------------------------------'
}

HIP-SEND-EMAIL-BASE.ps1 -data $data -address $address -mode run -env test

