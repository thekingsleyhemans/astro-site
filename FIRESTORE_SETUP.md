# Creating a Firestore Database - Step-by-Step Guide

## Step 1: Go to Firebase Console

1. Open https://console.firebase.google.com/
2. Click on your project **"hospitality-database-ceeb5"**

## Step 2: Navigate to Firestore Database

1. In the left sidebar, look for **"Build"** section
2. Click on **"Firestore Database"** (it should be below "Realtime Database")
3. If you don't see it, search for "Firestore" in the left menu

## Step 3: Create Database

1. Click the blue **"+ Create database"** button
2. A dialog will appear with options

## Step 4: Choose Security Mode

You'll see two options:
- **"Start in production mode"** ← Choose this one
- "Start in test mode"

**Why production mode?** Because we'll set strict security rules to protect your data.

Click **"Start in production mode"**

## Step 5: Select Location (Region)

A map will appear asking you to choose a region. Options:
- **us-central1** (United States - good for North America)
- **europe-west1** (Europe - good for European users)
- **asia-southeast1** (Asia - good for Asian users)

Pick the one **closest to where your users are**, or use **us-central1** as default.

Click **"Enable"**

## Step 6: Wait for Database to Create

It may take 30-60 seconds. You'll see a loading screen. Wait for it to complete.

## Step 7: You're in Firestore!

Once done, you'll see:
- A left sidebar with "Firestore Database"
- Tabs at the top: **Data**, **Indexes**, **Rules**
- An empty database (no collections yet)

## Step 8: Set Security Rules (IMPORTANT!)

1. Click the **"Rules"** tab at the top
2. You'll see some default code. **Delete it all** and replace with this:

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Employees collection - only logged-in users can access
    match /employees/{employeeId} {
      // CREATE: user must be authenticated and must set themselves as owner
      allow create: if request.auth != null 
        && request.resource.data.ownerId == request.auth.uid;
      
      // READ: only logged-in users can view all employees
      allow read: if request.auth != null;
      
      // UPDATE/DELETE: only the owner (who created it) can modify
      allow update, delete: if request.auth != null 
        && resource.data.ownerId == request.auth.uid;
    }

    // Users collection (optional - for storing admin metadata)
    match /users/{userId} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
  }
}
```

3. Click the blue **"Publish"** button at the bottom right
4. Confirm by clicking **"Publish"** in the dialog

## Step 9: Understanding the Rules

What these rules do:
- ✅ Users can **create** employees (and must mark themselves as owner)
- ✅ Users can **read** all employees (so the "All Workers" page works)
- ✅ Users can only **edit/delete** their own employees (not others')
- ✅ Prevents attackers from modifying data they don't own

## Step 10: Create Your First Collection (Optional)

You don't HAVE to do this - Firestore will auto-create collections when you add data. But if you want to test manually:

1. Go to the **"Data"** tab
2. Click **"Start collection"**
3. Collection ID: `employees`
4. Click **"Next"**
5. Click **"Auto-id"** (Firebase will generate a unique ID)
6. Add a test document with these fields:

| Field Name | Type | Value |
|---|---|---|
| name | string | John Doe |
| age | number | 28 |
| ghanaCard | string | GHA-123-456-789 |
| status | string | Hireable |
| ownerId | string | (leave blank for now, your app will set this) |
| createdAt | timestamp | (leave blank) |
| updatedAt | timestamp | (leave blank) |

7. Click **"Save"**

## Step 11: Test with Your App

Now that Firestore is set up:

1. Run your app:
```powershell
npm run dev
```

2. Visit http://localhost:3000/login
3. Sign up with a test email
4. Click **"Add Employee"** in the toolbar
5. Fill in the form and click **"Add Employee"**
6. Check back in **Firebase Console** → **Firestore** → **Data** tab
7. You should see your employee in the `employees` collection!

## Troubleshooting

**Q: I see "Permission denied" in browser console**
- Make sure you published the security rules (Step 8)
- Make sure you're logged in

**Q: I don't see my employees in Firestore**
- Check the browser console for errors (F12)
- Make sure the employee form submitted successfully
- Refresh the Firestore console page

**Q: The database creation button doesn't appear**
- Make sure you're in the right project (top of console)
- Try refreshing the page

**Q: I accidentally chose "test mode" instead of "production mode"**
- Go to Rules tab and replace with the production rules above
- Click Publish

## Next Steps

Once your database is working:
1. You can view/add/edit employees through the app
2. Firebase will handle all the security
3. Later, we'll add image upload to Firebase Storage

You're almost done! Let me know when you've completed Steps 1-8 and I'll help you test it! 🎉
