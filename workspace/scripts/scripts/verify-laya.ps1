$ErrorActionPreference = "Stop"

Write-Host "=== Step 1: Verifying Local Docker Environment ===" -ForegroundColor Cyan
try {
    $dockerVer = docker --version 2>&1
    $composeVer = docker compose version 2>&1
    Write-Host "✅ Docker Engine: $dockerVer" -ForegroundColor Green
    Write-Host "✅ Docker Compose: $composeVer" -ForegroundColor Green
} catch {
    Write-Error "Docker or Docker Compose is missing."
    exit
}

Write-Host "
=== Step 2: Scanning for Running Decision Engines ===" -ForegroundColor Cyan
$activeContainers = docker ps --format '{{.Names}}\t{{.Ports}}' | Where-Object { \ -match "ollama" -or \ -match "laya" }

if ($activeContainers) {
    Write-Host "🎉 Active local container deployment detected:" -ForegroundColor Green
    $activeContainers | ForEach-Object {
        $fields = \ -split "	"
        Write-Host "   -> Container: $([0]) | Ports: $([1])" -ForegroundColor Yellow
    }
}

Write-Host "
=== Step 3: Checking Laya & Ollama Models ===" -ForegroundColor Cyan
docker exec ollama ollama list

Write-Host "
🚀 Verification Complete!" -ForegroundColor Green
