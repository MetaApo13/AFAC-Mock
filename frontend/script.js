import tailwind from 'tailwindcss';

const tailwindConfig = {
    theme: {
        extend: {},
    },
};

tailwind.config = tailwindConfig;

document.getElementById("google-login").addEventListener("click", async () => {
    try {
        const response = await fetch("http://localhost:5000/auth/google", {
            method: "GET",
            credentials: "include",
        });
        const data = await response.json();
        
        if (data.success) {
            alert("Login successful!");
            window.location.href = "/dashboard";
        } else {
            alert("Login failed");
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
});

document.getElementById("email-login").addEventListener("click", async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        const data = await response.json();
        
        if (data.success) {
            alert("Login successful!");
            window.location.href = "/dashboard";
        } else {
            alert("Invalid credentials");
        }
    } catch (error) {
        console.error("Error logging in:", error);
    }
});
