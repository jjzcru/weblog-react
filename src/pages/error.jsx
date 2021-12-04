import React from "react";

export function Error() {
    return (
        <div className="text-center">
            <br />
            <h1>404 ERROR: Page Not Found</h1>
            <br />
            <a href="/">Return Home</a>
            <br />
            <a href="/categories">View Categories</a>
            <br />
            <a href="/signup">Sign Up</a>
            <br />
            <a href="/signin">Sign In</a>
        </div>
    );
}