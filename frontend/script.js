// Firebase Config
// Note: In a real application, you would load this from environment variables
const firebaseConfig = {
    // Replace with your Firebase config
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // DOM elements
  const loginTab = document.getElementById('loginTab');
  const registerTab = document.getElementById('registerTab');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const googleLoginBtn = document.getElementById('googleLogin');
  const alert = document.getElementById('alert');
  const alertMessage = document.getElementById('alertMessage');
  const alertIcon = document.getElementById('alertIcon');
  
  // Tab switching
  loginTab.addEventListener('click', () => {
    loginTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    loginTab.classList.remove('text-gray-500');
    registerTab.classList.add('text-gray-500');
    registerTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  });
  
  registerTab.addEventListener('click', () => {
    registerTab.classList.add('text-indigo-600', 'border-b-2', 'border-indigo-600');
    registerTab.classList.remove('text-gray-500');
    loginTab.classList.add('text-gray-500');
    loginTab.classList.remove('text-indigo-600', 'border-b-2', 'border-indigo-600');
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
  });
  
  // Login form submission
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
      // Using the backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      
      const user = await response.json();
      console.log('Login successful', user);
      // Redirect or update UI as needed
      showAlert('Login successful!', 'success');
      // window.location.href = '/dashboard'; // Uncomment to redirect
    } catch (error) {
      console.error('Login error:', error);
      showAlert(formatErrorMessage(error.message), 'error');
    }
  });
  
  // Register form submission
  registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
      showAlert('Passwords do not match', 'error');
      return;
    }
    
    try {
      // Using the backend API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      
      const user = await response.json();
      console.log('Registration successful', user);
      showAlert('Account created successfully!', 'success');
      // Switch to login tab
      loginTab.click();
    } catch (error) {
      console.error('Registration error:', error);
      showAlert(formatErrorMessage(error.message), 'error');
    }
  });
  
  // Google Sign-in
  googleLoginBtn.addEventListener('click', async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
      const result = await auth.signInWithPopup(provider);
      // Get the ID token
      const idToken = await result.user.getIdToken();
      
      // Send the token to your backend
      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: idToken })
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }
      
      const user = await response.json();
      console.log('Google sign-in successful', user);
      showAlert('Google sign-in successful!', 'success');
      // window.location.href = '/dashboard'; // Uncomment to redirect
    } catch (error) {
      console.error('Google sign-in error:', error);
      showAlert(formatErrorMessage(error.message), 'error');
    }
  });
  
  // Alert functions
  function showAlert(message, type) {
    alertMessage.textContent = message;
    
    if (type === 'success') {
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
    
    // Show alert
    alert.classList.remove('translate-x-full');
    alert.classList.add('translate-x-0');
    
    // Hide after 3 seconds
    setTimeout(() => {
      alert.classList.remove('translate-x-0');
      alert.classList.add('translate-x-full');
    }, 3000);
  }
  
  // Format error messages
  function formatErrorMessage(errorMsg) {
    if (errorMsg.includes('auth/wrong-password') || errorMsg.includes('auth/user-not-found')) {
      return 'Invalid email or password';
    } else if (errorMsg.includes('auth/email-already-in-use')) {
      return 'Email is already in use';
    } else if (errorMsg.includes('auth/weak-password')) {
      return 'Password is too weak';
    } else if (errorMsg.includes('auth/invalid-email')) {
      return 'Invalid email format';
    } else {
      return 'An error occurred. Please try again.';
    }
  }