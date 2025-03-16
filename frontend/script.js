// DOM elements
const loginTab = document.getElementById('loginTab');
const registerTab = document.getElementById('registerTab');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const googleLoginBtn = document.getElementById('googleLogin');
const alertBox = document.getElementById('alert');
const alertMessage = document.getElementById('alertMessage');
const alertIcon = document.getElementById('alertIcon');

// Tab switching logic
loginTab.addEventListener('click', () => {
    loginTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    registerTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
});

registerTab.addEventListener('click', () => {
    registerTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    loginTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// Login form submission (Backend Integration)
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            showAlert("Login successful!", "success");
            window.location.href = "/dashboard"; // Redirect to dashboard after login
        } else {
            showAlert(data.message || "Invalid credentials", "error");
        }
    } catch (error) {
        console.error("Login error:", error);
        showAlert("An error occurred. Please try again.", "error");
    }
});

// Register form submission (Backend Integration)
registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showAlert("Passwords do not match", "error");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();

        if (response.ok) {
            showAlert("Account created successfully! Please log in.", "success");
            loginTab.click(); // Switch to login tab
        } else {
            showAlert(data.message || "Registration failed", "error");
        }
    } catch (error) {
        console.error("Registration error:", error);
        showAlert("An error occurred. Please try again.", "error");
    }
});

// Google Sign-in (Redirect to Backend OAuth)
googleLoginBtn.addEventListener("click", async () => {
    const popup = window.open(
        "http://localhost:5000/auth/google/popup",
        "Google Login",
        "width=500,height=600"
    );

    const checkPopup = setInterval(() => {
        if (!popup || popup.closed) {
            clearInterval(checkPopup);
            checkLoginStatus(); // Check if the user is authenticated
        }
    }, 1000);
});

// Function to check if the user is authenticated
async function checkLoginStatus() {
    try {
        const response = await fetch("http://localhost:5000/auth/status", {
            credentials: "include",
        });
        const data = await response.json();

        if (data.authenticated) {
            showAlert(`Welcome ${data.user.name}!`, "success");
            window.location.href = "/dashboard"; // Redirect to dashboard
        } else {
            showAlert("Google login failed. Please try again.", "error");
        }
    } catch (error) {
        console.error("Error checking login status:", error);
        showAlert("An error occurred. Please try again.", "error");
    }
}

// Function to check if user is authenticated
async function checkLoginStatus() {
    try {
        const response = await fetch("http://localhost:5000/auth/status", {
            credentials: "include",
        });
        const data = await response.json();

        if (data.authenticated) {
            showAlert("Google login successful!", "success");
            window.location.href = "/dashboard"; // Redirect to dashboard
        } else {
            showAlert("Google login failed. Please try again.", "error");
        }
    } catch (error) {
        console.error("Error checking login status:", error);
        showAlert("An error occurred. Please try again.", "error");
    }
}

// Alert function to display messages
function showAlert(message, type) {
    alertMessage.textContent = message;

    if (type === "success") {
        alertIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="text-green-500">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
            </svg>
        `;
    } else {
        alertIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="text-red-500">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
            </svg>
        `;
    }

    alertBox.classList.remove("translate-x-full");
    alertBox.classList.add("translate-x-0");

    // Hide after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove("translate-x-0");
        alertBox.classList.add("translate-x-full");
    }, 3000);
}
