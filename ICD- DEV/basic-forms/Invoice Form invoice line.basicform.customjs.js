document.addEventListener("DOMContentLoaded", function () {
    // Check for the form element by ID (use the actual form ID, not the hidden input ID)
    const formElement = document.getElementById("yourFormId"); // Replace 'yourFormId' with the actual form's ID

    if (formElement) {
        console.log("Form element found!");

        // Create a dummy button
        const button = document.createElement("button");

        // Set button text
        button.innerHTML = "Click Me";

        // Optionally, style the button
        button.style.backgroundColor = "#007BFF"; // Blue color
        button.style.color = "white";
        button.style.padding = "10px 20px";
        button.style.fontSize = "16px";
        button.style.cursor = "pointer";

        // Append the button to the form
        formElement.appendChild(button);

        // Add a click event to the button
        button.addEventListener("click", function () {
            alert("Button clicked!");
        });
    } else {
        console.log("Form element not found! Check the form ID.");
    }

    // Access the hidden field with app ID and log its value
    const appID = document.getElementById("icd_application").value;
    console.log("Application ID:", appID); // You can use this value for further actions
});