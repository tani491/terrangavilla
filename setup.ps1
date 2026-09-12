# setup.ps1 - Installation automatique de Teranga Park Villas (Windows)
# Usage : depuis PowerShell dans le dossier du projet :
#   powershell -ExecutionPolicy Bypass -File .\setup.ps1

$ErrorActionPreference = "Continue"
Set-Location $PSScriptRoot

Write-Host ""
Write-Host "=== Teranga Park Villas - installation automatique ===" -ForegroundColor Cyan

# 0. Verification de Node.js
try { $nodeVersion = node -v } catch {
    Write-Host "ERREUR : Node.js n'est pas installe." -ForegroundColor Red
    Write-Host "Telechargez la version LTS sur https://nodejs.org puis relancez ce script."
    exit 1
}
Write-Host "Node.js detecte : $nodeVersion"

if (-not (Test-Path "package.json")) {
    Write-Host "ERREUR : package.json introuvable." -ForegroundColor Red
    Write-Host "Placez-vous dans le dossier teranga-park-villas (celui qui contient package.json)."
    exit 1
}

# 1. Nettoyage d'une installation precedente eventuellement corrompue
if (Test-Path "node_modules") {
    Write-Host "Nettoyage de l'ancien node_modules..."
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    if (Test-Path "node_modules") { cmd /c "rmdir /s /q node_modules" 2>$null }
}
if (Test-Path "node_modules") {
    Write-Host "Impossible de supprimer node_modules (fichiers verrouilles)." -ForegroundColor Red
    Write-Host "Fermez VS Code et tous les terminaux, puis relancez ce script."
    exit 1
}

# 2. Installation des dependances
Write-Host "Installation des dependances (2 a 5 minutes)..."
npm install --no-audit --no-fund
if ($LASTEXITCODE -ne 0) {
    Write-Host "Echec. Nouvelle tentative apres nettoyage complet du cache..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
    cmd /c "rmdir /s /q node_modules" 2>$null
    npm cache clean --force 2>$null
    npm install --no-audit --no-fund
    if ($LASTEXITCODE -ne 0) {
        Write-Host "L'installation echoue encore." -ForegroundColor Red
        Write-Host "Cause la plus frequente : le chemin du projet contient des espaces ou"
        Write-Host "des parentheses (ex : 'teranga-park-villas-source (1)')."
        Write-Host "Solution : deplacez le projet dans C:\dev\teranga-park-villas (sans espaces),"
        Write-Host "puis relancez setup.ps1. Voir aussi README.md, section Depannage."
        exit 1
    }
}

# 3. Verification du client Prisma (normalement genere par le postinstall)
if (-not (Test-Path "node_modules\.prisma\client\index.js")) {
    Write-Host "Generation du client Prisma..."
    npx --no-install prisma generate
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Echec de la generation Prisma." -ForegroundColor Red
        Write-Host "Solution : deplacez le projet dans un chemin SANS espaces ni parentheses"
        Write-Host "(ex : C:\dev\teranga-park-villas), puis relancez setup.ps1."
        exit 1
    }
}

Write-Host ""
Write-Host "=== Installation terminee avec succes ===" -ForegroundColor Green
Write-Host "Demarrez le site avec :  npm run dev"
Write-Host "Puis ouvrez http://localhost:3000"
Write-Host ""
