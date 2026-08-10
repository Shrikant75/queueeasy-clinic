let queueNumber = 2;

function generateToken() {

    // Simulated token generation
    queueNumber++;

    const token = `Q-${String(queueNumber).padStart(2, "0")}`;

    const position = queueNumber;

    const estimatedWait = position * 4;

    // Save token locally
    localStorage.setItem("quteToken", token);
    localStorage.setItem("qutePosition", position);

    // Update UI
    document.getElementById("tokenNumber").textContent = token;

    document.getElementById("position").textContent = position;

    document.getElementById(
        "estimatedWait"
    ).textContent = `${estimatedWait} min`;

    document.getElementById(
        "waitingCount"
    ).textContent = position - 1;

    document.getElementById(
        "waitTime"
    ).textContent = `${estimatedWait} min`;

    const progress =
        Math.max(
            5,
            Math.min(95, 100 - position * 10)
        );

    document.getElementById(
        "progressBar"
    ).style.width = `${progress}%`;

    document.getElementById(
        "progressText"
    ).textContent = `${progress}%`;

    // Hide join section
    document
        .getElementById("joinSection")
        .classList.add("hidden");

    // Show token
    document
        .getElementById("tokenSection")
        .classList.remove("hidden");

    // Scroll
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function leaveQueue() {

    localStorage.removeItem("quteToken");
    localStorage.removeItem("qutePosition");

    document
        .getElementById("tokenSection")
        .classList.add("hidden");

    document
        .getElementById("joinSection")
        .classList.remove("hidden");
}


/*
 * Restore token if customer
 * refreshes the page
 */

window.addEventListener("load", () => {

    const token =
        localStorage.getItem("quteToken");

    const position =
        localStorage.getItem("qutePosition");

    if (token && position) {

        document.getElementById(
            "tokenNumber"
        ).textContent = token;

        document.getElementById(
            "position"
        ).textContent = position;

        document
            .getElementById("joinSection")
            .classList.add("hidden");

        document
            .getElementById("tokenSection")
            .classList.remove("hidden");
    }
});


/*
 * Register PWA service worker
 */

if ("serviceWorker" in navigator) {

    window.addEventListener("load", () => {

        navigator.serviceWorker
            .register("sw.js")
            .then(() => {
                console.log("PWA ready");
            })
            .catch(error => {
                console.log(
                    "Service Worker Error:",
                    error
                );
            });

    });

}
