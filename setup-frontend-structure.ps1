# Navigate to project root (adjust if needed)
Set-Location current-affairs-quiz

# Create app subfolders
New-Item -ItemType Directory -Force -Path app/test
New-Item -ItemType Directory -Force -Path app/attempt/[attemptId]

# Create src subfolders
New-Item -ItemType Directory -Force -Path src
New-Item -ItemType Directory -Force -Path src/api
New-Item -ItemType Directory -Force -Path src/hooks
New-Item -ItemType Directory -Force -Path src/components
New-Item -ItemType Directory -Force -Path src/utils

# Create app files
New-Item -ItemType File -Force -Path app/test/[id].tsx
New-Item -ItemType File -Force -Path app/attempt/[attemptId].tsx
New-Item -ItemType File -Force -Path app/attempt/[attemptId]/review.tsx

# Create src files
New-Item -ItemType File -Force -Path src/api/client.ts
New-Item -ItemType File -Force -Path src/api/quiz.ts
New-Item -ItemType File -Force -Path src/hooks/useDeviceId.ts
New-Item -ItemType File -Force -Path src/hooks/useAttempt.ts
New-Item -ItemType File -Force -Path src/components/QuestionCard.tsx
New-Item -ItemType File -Force -Path src/utils/time.ts

Write-Output "✅ Expo frontend folder structure updated successfully!"
