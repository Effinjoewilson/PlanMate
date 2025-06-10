✅ 1. 🔥 Starting the Server and Client
Server:
    Files Involved:

        server/app.py → Starts the Flask app
        Loads config from server/config/settings.py
        Initializes DB via server/db/__init__.py
        Loads routes: server/routes/auth_routes.py

Client:
    React app runs on localhost:3000, talking to Flask API at localhost:5000

✅ 2. 🧾 Signup Flow (Register New User)
Frontend:
    File: client/src/components/Signup.js
    Sends POST request to http://localhost:5000/api/signup with name, email, password

Backend:
    File: server/routes/auth_routes.py
    Route: /signup
    Hashes password → utils/auth_utils.py
    Stores user in DB → db/models.py, db = SQLAlchemy()
    Returns success response

✅ 3. 🔐 Login Flow (Authentication + Cookie)
Frontend:
    File: client/src/components/Login.js
    Sends POST request to /api/login with email, password
    Uses:
        axios.post(..., { withCredentials: true })
    to receive the JWT in an httpOnly cookie

Backend:
    File: server/routes/auth_routes.py
    Route: /login
        Verifies user password → utils/auth_utils.py
        Generates JWT → utils/jwt_utils.py
        Sets JWT in httpOnly cookie using make_response

✅ 4. 🧠 Auth Check on Dashboard Load
Frontend:
    File: client/src/components/Dashboard.js
    On mount, sends GET request to:
        http://localhost:5000/api/me
        
    Uses:
        axios.get(..., { withCredentials: true })
    Shows:
        Loading... while waiting
        Dashboard if user is valid
        "Unauthorized" if not

Backend:
    File: server/routes/auth_routes.py
    Route: /me
        Reads JWT from cookie
        Verifies it → utils/jwt_utils.py
        Fetches and returns user data from DB

✅ 5. 📅 Dashboard Activity Feature
File: Dashboard.js

    Lets user select date and input activities
    Not yet connected to backend (you can later store this per-date in DB)

✅ 6. 🚪 Logout Flow (Not yet implemented but here's what you'd do:)
    Frontend:
        Call GET /api/logout (you need to build this)

    Backend:
        Clear cookie by setting:
            resp.set_cookie("jwt", "", expires=0, httponly=True)

✅ 7. 🔐 JWT Auth Summary
        JWT is generated in: utils/jwt_utils.py → generate_token()
        Stored securely in httpOnly cookie
        Verified from cookie in /api/me using verify_token()

