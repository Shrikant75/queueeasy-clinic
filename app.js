const STARTING_QUEUE_COUNT = 2;


/*
 * Automatically generate token
 * when customer opens the QR link.
 */

function generateToken() {

    let existingToken =
        localStorage.getItem("quteToken");

    // Don't generate another token
    // if customer refreshes the page.
    if (existingToken) {

        document.getElementById(
            "tokenNumber"
        ).textContent = existingToken;

        return;
    }

    /*
     * Demo logic:
     * 2 people are already waiting.
     * First customer gets Q-03.
     */

    const nextToken =
        STARTING_QUEUE_COUNT + 1;

    const token =
        `Q-${String(nextToken).padStart(2, "0")}`;

    localStorage.setItem(
        "quteToken",
        token
    );

    document.getElementById(
        "tokenNumber"
    ).textContent = token;
}


/*
 * Enable browser notifications
 */

async function enableNotifications() {

    if (!("Notification" in window)) {

        alert(
            "Notifications are not supported on this device."
        );

        return;
    }

    const permission =
        await Notification.requestPermission();

    const button =
        document.getElementById(
            "notificationButton"
        );

    if (permission === "granted") {

        button.innerHTML =
            "<span>✓</span>" +
            "<span>Notifications Enabled</span>";

        button.classList.add(
            "notification-enabled"
        );

    } else {

        button.innerHTML =
            "<span>🔔</span>" +
            "<span>Enable Notification</span>";
    }
}


/*
 * Leave queue
 */

function leaveQueue() {

    localStorage.removeItem(
        "quteToken"
    );

    // In production this will also
    // call the backend to remove the token.

    window.location.reload();
}


/*
 * Automatically generate token
 * as soon as QR landing page loads.
 */

window.addEventListener(
    "DOMContentLoaded",
    () => {

        generateToken();

    }
);


/*
 * Register PWA
 */

if ("serviceWorker" in navigator) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker.register(
                "sw.js"
            );

        }
    );
}
