const express = require("express");
const passport = require("passport");
const { registerUser, loginUser } = require("../auth/emailAuth");

const router = express.Router();

// Email/Password Authentication Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Google Authentication Routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.redirect("/dashboard"); // Redirect if not using a popup
});

// 🔹 Google Login for Popup
router.get("/google/popup", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/popup/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
    res.send(`
        <script>
            window.opener.postMessage(${JSON.stringify(req.user)}, "http://localhost:3000");
            window.close();
        </script>
    `);
});

// 🔹 Check If User is Logged In
router.get("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.json({ authenticated: false });
    }
});

// ✅ Correct Export
module.exports = router;
