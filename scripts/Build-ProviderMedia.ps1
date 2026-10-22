$ErrorActionPreference='Stop'
$taskRoot=Split-Path -Parent $PSScriptRoot
$taskImage=Join-Path $taskRoot 'provider\media\shared-evening.png'
$taskMedia=Join-Path $taskRoot 'provider\media\test-clip.mp4'
if(-not(Test-Path -LiteralPath $taskImage)){throw 'Rasterize the original shared-evening.svg at 1280x720 to shared-evening.png first.'}
& ffmpeg -hide_banner -loglevel error -loop 1 -i $taskImage -vf "zoompan=z='1.02+0.00015*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=192:s=640x360:fps=24" -t 8 -an -c:v libx264 -preset fast -crf 24 -pix_fmt yuv420p -movflags +faststart -y $taskMedia
if($LASTEXITCODE -ne 0){throw 'Original motion-study encoding failed.'}
Write-Output 'Encoded original eight-second shared-evening motion study. No commercial footage or audio.'
