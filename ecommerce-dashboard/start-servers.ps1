# Start backend server
Write-Host "Starting backend server on port 4000..."
Start-Process -WindowStyle Minimized node -ArgumentList "src/index.js"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "Starting frontend server on port 5173..."
Write-Host "Backend API: http://localhost:4000"
Write-Host "Frontend: http://localhost:5173"
Write-Host ""
Write-Host "Opening browser in a few seconds..."

# Start frontend
npm run dev
