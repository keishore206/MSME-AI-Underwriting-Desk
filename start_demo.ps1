# Start MSME Underwriting AI Demo
# Run: .\start_demo.ps1

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " MSME Loan Underwriting AI Demo" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Start Python backend in a new terminal window
Write-Host "[1/2] Starting Python backend (FastAPI) on port 8000..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd D:\virtusa\demo; python -m uvicorn backend.main:app --reload --port 8000`""

Start-Sleep -Seconds 3

# Start React frontend in a new terminal window
Write-Host "[2/2] Starting React frontend (Vite) on port 5173..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit -Command `"cd D:\virtusa\demo; npm run dev -- --port 5173`""

Start-Sleep -Seconds 4

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host " Demo is starting!" -ForegroundColor Green
Write-Host "-----------------------------------------" -ForegroundColor Green
Write-Host " Frontend: http://localhost:5173" -ForegroundColor White
Write-Host " Backend:  http://localhost:8000" -ForegroundColor White
Write-Host " API Docs: http://localhost:8000/docs" -ForegroundColor White
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Press any key to open the demo in your browser..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
Start-Process "http://localhost:5173"

