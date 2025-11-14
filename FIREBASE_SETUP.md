# Firebase Setup Guide for Pub Workers App

## Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **"Add project"**
3. Enter a project name (e.g., "pub-workers-app")
4. Accept the default settings and click **"Create project"**
5. Wait for the project to be created (30 seconds)

## Step 2: Register a Web App

1. In the Firebase console, click the **gear icon** (Settings) → **Project settings**
2. Scroll down to "Your apps" section
3. Click **"Add app"** → select **Web** (</> icon)
4. Enter an app nickname (e.g., "astro-site")
5. Check **"Also set up Firebase Hosting for this app"** (optional, for later deployment)
6. Click **"Register app"**
7. Firebase will show you a config object like this:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123def456"
};
```

8. **Copy this entire config** (you'll need it in Step 3)

## Step 3: Update Your Firebase Config File

1. Open `public/scripts/firebaseConfig.js` in your project
2. Replace the placeholder values with the config from Step 2
3. Example (replace with YOUR values):

```javascript
// Firebase Configuration
export const firebaseConfig = {
  apiKey: "AIza1234567890abcdefg",
  authDomain: "pub-workers-app.firebaseapp.com",
  projectId: "pub-workers-app",
  storageBucket: "pub-workers-app.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789"
};
```

4. **Save the file**

## Step 4: Enable Email/Password Authentication

1. In Firebase console, go to **Authentication** (left sidebar)
2. Click **"Get started"** → **"Sign-in method"**
3. Find **"Email/Password"** → click it
4. Toggle **"Enable"** (make it blue/on)
5. Check **"Email enumeration protection"** (optional but recommended)
6. Click **"Save"**

## Step 5: Configure Authorized Domains (Local Testing)

1. In Firebase console, go to **Authentication** → **Settings** tab
2. Scroll to **"Authorized domains"**
3. Click **"Add domain"** and add:
   - `localhost` (for local testing)
   - Your production domain later (e.g., `your-site.com`)
4. Click **"Add"** and **"Save"**

## Step 6: Create Firestore Database

1. In Firebase console, go to **Firestore Database** (left sidebar)
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set rules in Step 7)
4. Choose a location closest to you (e.g., `us-central1`)
5. Click **"Enable"**

## Step 7: Set Firestore Security Rules

1. In Firestore, go to **"Rules"** tab
2. Replace all the code with this:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access employees collection
    match /employees/{employeeId} {
      // Create: user must be authenticated and set themselves as owner
      allow create: if request.auth != null 
        && request.resource.data.ownerId == request.auth.uid;
      
      // Read: only authenticated users can view all employees
      allow read: if request.auth != null;
      
      // Update/Delete: only the owner can modify their employees
      allow update, delete: if request.auth != null 
        && resource.data.ownerId == request.auth.uid;
    }

    // Optional: Users collection for storing admin metadata
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

## Step 8: Create Firestore Collections (Optional - Firebase will auto-create on first write)

When you use the app and add an employee, Firebase will automatically create the `employees` collection. But you can pre-create it:

1. In Firestore, click **"Start collection"**
2. Collection ID: `employees`
3. Click **"Next"**
4. For the first document, click **"Auto-id"** then add a sample document with fields:
   - `name` (string): "John Doe"
   - `age` (number): 28
   - `ghanaCard` (string): "GHA-123-456-789"
   - `status` (string): "Hireable"
   - `ownerId` (string): (your Firebase user UID)
   - `createdAt` (timestamp): (current time)
   - `updatedAt` (timestamp): (current time)
5. Click **"Save"**

## Step 9: Test Locally

1. Make sure you've updated `public/scripts/firebaseConfig.js` with real credentials
2. Run the dev server:
```powershell
npm run dev
```

3. Open http://localhost:3000/login
4. Click **"Sign up here"**
5. Enter:
   - Name: your name
   - Email: test@example.com
   - Password: test123456 (must be 6+ chars)
6. Click **"Sign Up"**
7. You should be redirected to login, then you can log in with the same email/password
8. After login, you should see the **floating toolbar** in the bottom-right
9. Click **"Add Employee"** and test the form

## Step 10: Deploy (Optional)

When ready to deploy:

1. Build your Astro site:
```powershell
npm run build
```

2. Deploy to Vercel, Netlify, or Firebase Hosting (Firebase Hosting is recommended since you're using Firebase)

3. Add your production domain to **Authorized Domains** in Firebase Auth settings

## Troubleshooting

**Q: I see "Invalid API Key" or "Request blocked" in console**
- Check that your `firebaseConfig.js` has the correct values from Firebase console
- Make sure `localhost` is in Authorized Domains

**Q: Signup/login doesn't work**
- Check browser console (F12) for errors
- Verify Email/Password auth is enabled in Firebase
- Check that Firestore rules are published

**Q: Toolbar still doesn't show after login**
- Current dev setup uses test script (shows toolbar immediately)
- Switch to production script by editing `src/layouts/BaseLayout.astro`:
  - Comment out: `<!-- <script src="/scripts/floating-toolbar-test.js" defer></script> -->`
  - Uncomment: `<script type="module" src="/scripts/floating-toolbar.js" defer></script>`

**Q: Can't see employees on /dashboard or /public-employees**
- Firestore security rules might be blocking reads
- Check that rules are published (see Step 7)
- Verify you're logged in (toolbar should be visible)

## Next Steps

After this is working:
1. Add image upload (Firebase Storage)
2. Create employee add/edit modal forms
3. Add OCR for Ghana Card scanning
4. Deploy to production

Need help with any step? Paste any error messages and I'll fix them!
