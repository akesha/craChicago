# Live Wall — Firebase setup (one time, ~10 min, free)

The warm-up's **Live Wall** lets the room post what guidance they've been given and
see it appear live on a projected screen — text responses, a clarity tally, and a
count. It runs entirely from the hosted HTML file using **Google Firebase
(Firestore)** on the free **Spark** plan. No server to manage.

Until you paste your keys, the warm-up still works — it just saves on each person's
own device and the Live Wall shows this setup guide.

---

## 1. Create a Firebase project
- Go to **https://console.firebase.google.com** and sign in with a Google account.
- **Add project** → give it any name (e.g. "make-the-case") → you can disable
  Google Analytics → **Create project**.

## 2. Register a Web app and copy the config
- On the project overview, click the **Web** icon `</>`.
- Give it a nickname, **Register app**.
- It shows a `firebaseConfig` object like:
  ```js
  const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "make-the-case.firebaseapp.com",
    projectId: "make-the-case",
    storageBucket: "make-the-case.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abc123"
  };
  ```
  Keep this handy.

## 3. Paste the six values into the HTML file
- Open **`Make the Case.dc.html`** in any text editor.
- Near the top, find the block labelled **`LIVE WARM-UP · Firebase setup`**.
- Paste your values between the quotes for `apiKey`, `authDomain`, `projectId`,
  `storageBucket`, `messagingSenderId`, and `appId`.

## 4. Enable Firestore
- In the console: **Build → Firestore Database → Create database**.
- Choose **Start in test mode** (open read/write for 30 days — fine for a workshop)
  → pick a location → **Enable**.

## 5. Host it and go live
- Host the HTML file on **GitHub Pages**, **Netlify**, or **Vercel** (drag-and-drop
  deploy works).
- Open the page. In the **Live Wall** tab the badge turns **green · connected**.
- Project that tab. As people tap **Share with the room** on the warm-up, responses
  appear instantly.

---

## Sessions
- By default everyone shares a wall keyed to **today's date** (`mtc-YYYY-MM-DD`), so a
  single event just works with zero coordination.
- To run a separate room, change the **Session code** field on the Live Wall — anyone
  using that same code joins that wall. Changing it starts a fresh, empty session.

## Security rules (after the event / for longer use)
Test mode expires after 30 days. For a longer-lived deployment, restrict writes to the
responses collection. A reasonable starting rule (Firestore → Rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /mtc-sessions/{session}/responses/{doc} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['text','clarity','name','ts'])
                    && request.resource.data.text.size() < 800;
      allow update, delete: if false;
    }
  }
}
```
This allows the room to post and read, but not edit or delete each other's responses.
Ask me if you want a tighter, auth-gated rule set.

## Cost
A live workshop generates a handful of reads/writes — comfortably inside the free
Spark tier. No billing setup required.
