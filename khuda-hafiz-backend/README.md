# Khuda-Hafiz Backend (Firebase Auth + Firestore)

This backend provides:
- POST `/signup` — create Firebase Auth user + Firestore `users/{uid}` document
- POST `/login` — sign in via Firebase Auth REST API and return ID token + profile
- GET `/profile` — protected route (Bearer ID token) returning Firestore profile
- POST `/chat` — existing Gemini integration preserved

Prerequisites
- Node.js (recommended v18 LTS)
- npm
- A Firebase project with:
  - Service account JSON (downloaded from Firebase Console > Project settings > Service accounts)
  - Firestore enabled
  - Firebase Web API key (Project settings > General > Web API Key)

Setup
1. Copy the service account JSON you downloaded into the backend folder as `serviceAccountKey.json`.
   - Alternatively set the `FIREBASE_SERVICE_ACCOUNT` env var to the full JSON string.
2. Edit `.env` in this folder (or create it) with the following variables:

```
FIREBASE_API_KEY=your_firebase_web_api_key_here
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_if_needed
```

3. Install dependencies and start the server:

```powershell
Set-Location -Path "D:\Khuda Hafiz\khuda-hafiz-fyp\khuda-hafiz-backend"
npm install
npm start
```

Endpoints and examples

- Signup
  POST `/signup` JSON body:
  ```json
  {
    "email": "user@example.com",
    "password": "secret123",
    "displayName": "Alice"
  }
  ```
  Response includes `uid` and (if available) `token` from Firebase sign-in.

- Login
  POST `/login` JSON body:
  ```json
  { "email": "user@example.com", "password": "secret123" }
  ```
  Response contains `token` (with `idToken`, `refreshToken`, `localId`) and `profile` if stored in Firestore.

- Profile (protected)
  GET `/profile` with header `Authorization: Bearer <ID_TOKEN>`

Testing with PowerShell (example):

```powershell
# Signup
$body = @{ email='user@example.com'; password='secret123'; displayName='Alice' } | ConvertTo-Json
Invoke-RestMethod -Uri http://localhost:3000/signup -Method Post -Body $body -ContentType 'application/json'

# Login
$body = @{ email='user@example.com'; password='secret123' } | ConvertTo-Json
$resp = Invoke-RestMethod -Uri http://localhost:3000/login -Method Post -Body $body -ContentType 'application/json'
$resp | ConvertTo-Json -Depth 5

# Use idToken from login to fetch profile
$token = $resp.token.idToken
Invoke-RestMethod -Uri http://localhost:3000/profile -Headers @{ Authorization = "Bearer $token" }
```

Notes & troubleshooting
- Service account: ensure the JSON belongs to the Firebase project you intend to use.
- If Firebase Admin fails to initialize, signup/login endpoints will return 500; check logs on startup.
- Make sure Firestore is enabled in the Firebase console.
- If you prefer using client-side Firebase Auth (recommended for many apps), the client should sign up/sign in and send the ID token to the backend for verification instead of sending credentials to the backend.

If you want, I can:
- Add input validation and better error messages
- Add rate limiting and CORS restrictions
- Wire this backend to the frontend `login.tsx`/`signup` screens (showing example fetch calls)

