export const getSignupErrorMessage = (errorCode) => {
    switch (errorCode) {
        case "auth/email-already-in-use":
            return "This email is already registered";
        case "auth/weak-password":
            return "Password should be at least 6 characters";
        case "auth/invalid-email":
            return "Invalid email address";
        default:
            return "An error occurred. Please try again.";
    }
}

export const getLoginErrorMessage = (errorCode) => {
    switch (errorCode) {
        case "auth/invalid-credential":
        case "auth/user-not-found":
        case "auth/wrong-password":
            return "Invalid email or password";
        case "auth/too-many-requests":
            return "Too many failed attempts. Please try again later.";
        case "auth/user-disabled":
            return "This account has been disabled";
        default:
            return "An error occurred. Please try again.";
    }
};