Write-Host "Starting OmniRoute/Ollama availability sync daemon..." -ForegroundColor Cyan
while ($true) {
    if (-not (Get-Process "Docker Desktop" -ErrorAction SilentlyContinue) -and -not (Get-Service "docker" -ErrorAction SilentlyContinue | Where-Object Status -eq "Running")) { Start-Sleep -Seconds 5; continue }
    try {
        $omniStatus = docker inspect --format='{{.State.Status}}' "omniroute" 2>$null
        if ($omniStatus -eq "running") {
            $ollamaStatus = docker inspect --format='{{.State.Status}}' "ollama" 2>$null
            if ($ollamaStatus -ne "running") {
                if ($ollamaStatus) { docker start "ollama" | Out-Null }
                else { docker run -d --name "ollama" --gpus all -v ollama:/root/.ollama -p 11434:11434 --restart unless-stopped ollama/ollama | Out-Null }
                Write-Host "[$(Get-Date -Format 'HH:mm:ss')] -> Ollama verified and active." -ForegroundColor Green
            }
        }
    } catch {}
    Start-Sleep -Seconds 5
}
