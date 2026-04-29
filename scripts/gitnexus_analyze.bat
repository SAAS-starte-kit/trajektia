@echo off
REM ============================================================
REM TRAJEKTIA — Indexation GitNexus avec Node 18 LTS
REM (Contournement crash tree-sitter sur Node 20 + Windows)
REM
REM Ce script :
REM   1. Bascule temporairement vers Node 18.20.8
REM   2. Installe gitnexus sur Node 18 si nécessaire
REM   3. Indexe le repo Trajektia
REM   4. Rebascule vers Node 20.20.0
REM
REM Usage : double-cliquer ou depuis cmd :
REM   scripts\gitnexus_analyze.bat
REM ============================================================

echo.
echo  ====================================================
echo  GitNexus — Indexation Trajektia (Node 18 LTS)
echo  ====================================================
echo.

set REPO_PATH=C:\Users\Patrice.DESKTOP-I932PON\Dev\saas-ai-starter\trajektia
set NODE18_GN=C:\Users\Patrice.DESKTOP-I932PON\AppData\Roaming\nvm\v18.20.8\node_modules\gitnexus\dist\cli\index.js

echo  [1/4] Basculer vers Node 18.20.8...
call nvm use 18.20.8
if %ERRORLEVEL% NEQ 0 (
    echo  ERREUR : Impossible de basculer vers Node 18. Vérifiez : nvm install 18
    goto :end
)

echo  [2/4] Node version :
node --version

echo.
echo  [3/4] Indexation de %REPO_PATH%...
echo.

REM Vérifier si gitnexus est installé sur Node 18
if not exist "%NODE18_GN%" (
    echo  Installation de gitnexus sur Node 18...
    npm install -g gitnexus
)

gitnexus.cmd analyze "%REPO_PATH%" --name trajektia --skills

if %ERRORLEVEL% EQU 0 (
    echo.
    echo  ====================================================
    echo   SUCCESS — Depot Trajektia indexe !
    echo  ====================================================
    echo.
    gitnexus.cmd status
    echo.
    echo  GitNexus MCP pret pour Antigravity.
) else (
    echo.
    echo  ERREUR : gitnexus analyze a echoue (code %ERRORLEVEL%)
    echo  Solutions possibles :
    echo    1. Desactiver Windows Defender pour ce dossier
    echo    2. Lancer en tant qu'administrateur
    echo    3. Ajouter une exception antivirus pour : node.exe + gitnexus
)

echo.
echo  [4/4] Retour vers Node 20.20.0...
call nvm use 20.20.0

:end
echo.
pause
