import { jwtDecode } from "jwt-decode";

class TokenManager {
  constructor() {
    this.checkInterval = null;
  }

  logExpiry(token) {
    if (!token) {
      console.log("[TokenManager] No token found");
      return;
    }
    try {
      const decoded = jwtDecode(token);
      const expSec = decoded?.exp; // seconds
      if (!expSec) {
        console.log("[TokenManager] Token has no exp claim");
        return;
      }
      const expMs = expSec * 1000;
      const expDate = new Date(expMs);
      const now = new Date();

      console.log("[TokenManager] Token expires at:", expDate.toLocaleString());
      console.log(
        "[TokenManager] Seconds remaining:",
        Math.max(0, Math.floor((expMs - Date.now()) / 1000))
      );
      console.log("[TokenManager] Now:", now.toLocaleString());
    } catch (e) {
      console.error("[TokenManager] Error decoding token:", e);
    }
  }

  isTokenExpired(token) {
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error decoding token:", error);
      return true;
    }
  }

  getTimeUntilExpiry(token) {
    if (!token) return 0;
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp - currentTime;
    } catch (error) {
      return 0;
    }
  }

  isTokenExpiringSoon(token, thresholdMinutes = 5) {
    const timeUntilExpiry = this.getTimeUntilExpiry(token);
    return timeUntilExpiry > 0 && timeUntilExpiry < thresholdMinutes * 60;
  }

  startTokenCheck(onExpired, onExpiringSoon, checkIntervalMs = 30000) {
    this.stopTokenCheck();

    const THRESHOLD_MINUTES = 2; 

    const check = () => {
      const token = localStorage.getItem("token");
      this.logExpiry(token);

      if (this.isTokenExpired(token)) {
        onExpired();
      } else if (this.isTokenExpiringSoon(token, THRESHOLD_MINUTES)) {
        onExpiringSoon(); // your UI will open the dialog
      }
    };

    check();
    this.checkInterval = setInterval(check, checkIntervalMs);
  }

  stopTokenCheck() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }
}

const tokenManager = new TokenManager();
export default tokenManager;


// // src/utils/TokenManager.js
// import { jwtDecode } from 'jwt-decode';

// class TokenManager {
//   constructor() {
//     this.checkInterval = null;
//   }

//   // Decode and check if token is expired
//   isTokenExpired(token) {
//     if (!token) return true;
    
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
//       return decoded.exp < currentTime;
//     } catch (error) {
//       console.error('Error decoding token:', error);
//       return true;
//     }
//   }

//   // Get time until token expires (in seconds)
//   getTimeUntilExpiry(token) {
//     if (!token) return 0;
    
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
//       return decoded.exp - currentTime;
//     } catch (error) {
//       return 0;
//     }
//   }

//   // Check if token will expire soon (within 5 minutes)
//   isTokenExpiringSoon(token, thresholdMinutes = 5) {
//     const timeUntilExpiry = this.getTimeUntilExpiry(token);
//     return timeUntilExpiry > 0 && timeUntilExpiry < (thresholdMinutes * 60);
//   }

//   // Start checking token expiration
//   startTokenCheck(onExpired, onExpiringSoon, checkIntervalMs = 60000) {
//     this.stopTokenCheck(); // Clear any existing interval
    
//     this.checkInterval = setInterval(() => {
//       const token = localStorage.getItem('token');
      
//       if (this.isTokenExpired(token)) {
//         onExpired();
//       } 
//       else if (this.isTokenExpiringSoon(token, 1)) { // 1 minute threshold
//   onExpiringSoon();
// }

//       // else if (this.isTokenExpiringSoon(token)) {
//       //   onExpiringSoon();
//       // }
//     }, checkIntervalMs);

//     // Also check immediately
//     const token = localStorage.getItem('token');
//     if (this.isTokenExpired(token)) {
//       onExpired();
//     } 
//     else if (this.isTokenExpiringSoon(token)) {
//       onExpiringSoon();
//     }
//   }

//   // Stop checking token expiration
//   stopTokenCheck() {
//     if (this.checkInterval) {
//       clearInterval(this.checkInterval);
//       this.checkInterval = null;
//     }
//   }
// }




// const tokenManager = new TokenManager();
// export default tokenManager;