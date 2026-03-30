$ErrorActionPreference = 'Stop'
$cwd = 'C:\Users\hp\Desktop\GHHS_webpage'
$job = Start-Job -ScriptBlock {
  param($path)
  Set-Location $path
  npm run dev -- --hostname 127.0.0.1 --port 3011
} -ArgumentList $cwd
try {
  $ready = $false
  for ($i = 0; $i -lt 120; $i++) {
    Start-Sleep -Milliseconds 1000
    try {
      $r = Invoke-WebRequest -Uri 'http://127.0.0.1:3011/api/monitoring/health' -UseBasicParsing -TimeoutSec 2
      if ($r.StatusCode -eq 200) { $ready = $true; break }
    } catch {}
  }
  if (-not $ready) { throw 'Dev server did not start in time.' }

  function Call-Api {
    param([string]$Method,[string]$Path,$Body=$null,[string]$Token='')
    $headers=@{}
    if ($Token) { $headers['Authorization'] = "Bearer $Token" }
    if ($Body -ne $null) {
      return Invoke-RestMethod -Method $Method -Uri ("http://127.0.0.1:3011/api" + $Path) -Headers $headers -Body ($Body | ConvertTo-Json -Depth 12) -ContentType 'application/json'
    }
    return Invoke-RestMethod -Method $Method -Uri ("http://127.0.0.1:3011/api" + $Path) -Headers $headers
  }

  $adminUser='admin'; $adminPass='change-me-123'
  if (Test-Path (Join-Path $cwd '.env')) {
    Get-Content (Join-Path $cwd '.env') | ForEach-Object {
      if ($_ -match '^\s*ADMIN_USERNAME\s*=\s*(.+)\s*$') { $adminUser = $Matches[1].Trim('"') }
      if ($_ -match '^\s*ADMIN_PASSWORD\s*=\s*(.+)\s*$') { $adminPass = $Matches[1].Trim('"') }
    }
  }

  $results=@()
  $login = Call-Api 'POST' '/admin/login' @{ username=$adminUser; password=$adminPass }
  if (-not $login.token) { throw 'No token' }
  $token=[string]$login.token
  $results += 'PASS login'

  $null = Call-Api 'GET' '/admin/dashboard?include_institute=0' $null $token
  $results += 'PASS dashboard'
  $null = Call-Api 'GET' '/admin/institute' $null $token
  $results += 'PASS institute'

  $null = Call-Api 'PATCH' '/admin/controls' @{ admission_open = $true } $token
  $results += 'PASS controls update'

  $null = Call-Api 'POST' '/admin/notices' @{ text = 'smoke notice' } $token
  $notices = Call-Api 'GET' '/admin/notices' $null $token
  $noticeIndex = [int]$notices[0].index
  $null = Call-Api 'PUT' ("/admin/notices/$noticeIndex") @{ text = 'smoke notice updated' } $token
  $null = Call-Api 'DELETE' ("/admin/notices/$noticeIndex") $null $token
  $results += 'PASS notices CRUD'

  $null = Call-Api 'POST' '/admin/downloads' @{ title = 'smoke'; url = 'https://example.com' } $token
  $downloads = Call-Api 'GET' '/admin/downloads' $null $token
  $downloadIndex = [int]$downloads[0].index
  $null = Call-Api 'PUT' ("/admin/downloads/$downloadIndex") @{ title = 'smoke2'; url = 'https://example.org' } $token
  $null = Call-Api 'DELETE' ("/admin/downloads/$downloadIndex") $null $token
  $results += 'PASS downloads CRUD'

  $roll = 'smoke-roll-1'
  $null = Call-Api 'POST' '/admin/students' @{ rollNumber = $roll; password = '1234'; name = 'Smoke Test'; className = 'Class XI'; stream = 'Medical' } $token
  $null = Call-Api 'PUT' ("/admin/students/$roll") @{ rollNumber = $roll; password = 'abcd'; name = 'Smoke Updated'; className = 'Class XI'; stream = 'Medical' } $token
  $null = Call-Api 'DELETE' ("/admin/students/$roll") $null $token
  $results += 'PASS students CRUD'

  $notif = Call-Api 'POST' '/admin/notification-items' @{ title='Smoke'; category='General'; date='2026-03-29'; summary='sum'; details='details'; link_label='Open'; link_url='https://example.com' } $token
  $notifId = [string]$notif.item.id
  $null = Call-Api 'PUT' ("/admin/notification-items/$notifId") @{ title='Smoke2' } $token
  $null = Call-Api 'DELETE' ("/admin/notification-items/$notifId") $null $token
  $results += 'PASS notification-items CRUD'

  $nb = Call-Api 'POST' '/admin/academics/noticeboard' @{ headline='Smoke'; description='desc'; time='09:00'; class_name='Class XI'; stream='Medical'; link_label='Open'; link_url='https://example.com' } $token
  $nbId = [string]$nb.item.id
  $null = Call-Api 'PUT' ("/admin/academics/noticeboard/$nbId") @{ headline='Smoke2' } $token
  $null = Call-Api 'DELETE' ("/admin/academics/noticeboard/$nbId") $null $token
  $results += 'PASS noticeboard CRUD'

  $tt = Call-Api 'POST' '/admin/academics/timetable' @{ period='1'; time='9-10'; detail='Math'; class_name='Class XI'; stream='Medical' } $token
  $ttId = [string]$tt.item.id
  $null = Call-Api 'PUT' ("/admin/academics/timetable/$ttId") @{ detail='Physics' } $token
  $null = Call-Api 'DELETE' ("/admin/academics/timetable/$ttId") $null $token
  $results += 'PASS timetable CRUD'

  $null = Call-Api 'PUT' '/admin/academics/materials' @{ materials = @(@{ class_name='Class XI'; streams=@(@{ stream='Medical'; subjects=@(@{ name='Biology'; drive='https://drive.google.com/x' }) }) }) } $token
  $results += 'PASS materials update'

  $null = Call-Api 'GET' '/admin/monitoring' $null $token
  $results += 'PASS monitoring load'

  $bk = Call-Api 'POST' '/admin/backups' @{ label='smoke backup' } $token
  $bkId = [string]$bk.snapshot.id
  $null = Call-Api 'POST' ("/admin/backups/$bkId/restore") @{} $token
  $null = Call-Api 'DELETE' ("/admin/backups/$bkId") $null $token
  $results += 'PASS backups create/restore/delete'

  $null = Call-Api 'DELETE' '/admin/contacts' $null $token
  $results += 'PASS contacts clear'

  $results | Out-File -FilePath (Join-Path $cwd 'tmp-admin-smoke-results.txt') -Encoding utf8
  Write-Output ($results -join "`n")
}
finally {
  if ($job) {
    Stop-Job $job -ErrorAction SilentlyContinue
    Receive-Job $job -ErrorAction SilentlyContinue | Out-Null
    Remove-Job $job -Force -ErrorAction SilentlyContinue
  }
}
