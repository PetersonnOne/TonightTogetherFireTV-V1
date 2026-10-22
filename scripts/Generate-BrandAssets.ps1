# Original code-native launcher assets, rendered locally. No downloaded artwork.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$taskRoot = Split-Path -Parent $PSScriptRoot
$taskTarget = Join-Path $taskRoot 'android\res\drawable-xhdpi'
New-Item -ItemType Directory -Path $taskTarget -Force | Out-Null
function New-TaskBrandImage([int]$Width,[int]$Height,[string]$Name,[bool]$Banner) {
    $taskBitmap = [System.Drawing.Bitmap]::new($Width,$Height)
    $taskGraphics = [System.Drawing.Graphics]::FromImage($taskBitmap)
    $taskGraphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $taskGraphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $taskBackground = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#14252b'))
    $taskMint = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#c8f0d4'))
    $taskMuted = [System.Drawing.SolidBrush]::new([System.Drawing.ColorTranslator]::FromHtml('#afc2c0'))
    $taskGraphics.FillRectangle($taskBackground,0,0,$Width,$Height)
    $taskFont = [System.Drawing.Font]::new('Arial',22,[System.Drawing.FontStyle]::Bold)
    $taskSmall = [System.Drawing.Font]::new('Arial',9,[System.Drawing.FontStyle]::Regular)
    if ($Banner) {
        $taskGraphics.FillRectangle($taskMint,22,25,42,8)
        $taskGraphics.FillRectangle($taskMint,39,25,8,32)
        $taskGraphics.DrawString('Tonight',$taskFont,$taskMint,20,65)
        $taskGraphics.DrawString('Together',$taskFont,$taskMint,20,97)
        $taskGraphics.DrawString('A night worth sharing.',$taskSmall,$taskMuted,22,145)
    } else {
        $taskGraphics.FillEllipse($taskMint,18,18,156,156)
        $taskGraphics.FillRectangle($taskBackground,49,55,94,22)
        $taskGraphics.FillRectangle($taskBackground,85,55,22,83)
    }
    $taskBitmap.Save((Join-Path $taskTarget $Name),[System.Drawing.Imaging.ImageFormat]::Png)
    $taskFont.Dispose(); $taskSmall.Dispose(); $taskBackground.Dispose(); $taskMint.Dispose(); $taskMuted.Dispose(); $taskGraphics.Dispose(); $taskBitmap.Dispose()
}
New-TaskBrandImage 320 180 'banner.png' $true
New-TaskBrandImage 192 192 'icon.png' $false
Write-Output 'Rendered original Tonight Together launcher assets.'
