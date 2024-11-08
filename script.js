const methods = ['frequency', 'velocity'];
const currentDate = new Date();
const today = currentDate.toISOString().slice(0, 10); // Format current date (YYYY-MM-DD)

let selectedMethod = 'frequency';  // Track the current selected method
let selectedDate = 'latest';  // Track the current selected date

function capitalize(str) {
    str += " ";
    str = str.substring(0, 1).toUpperCase() + str.substring(1)
    return str
}

function getMinuteTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    return `${year}${month}${day}${hour}${minute}`;
}

// Function to change the main image based on the selected stats method
function changeImage(method, date = selectedDate) {
    // Save in URL
    window.location.href = window.location.href.split("#")[0] + `#${method}+${date}`

    // Update the current method and date
    selectedMethod = method;
    selectedDate = date;

    let imagePath = `Images/${method}-${date}.png`;
    if (date == "latest") imagePath += "?"+getMinuteTimestamp(); // Avoid caching latest images
    document.getElementById("main-image").src = imagePath;

    // Update the label to reflect the image date
    const imageLabel = date === "latest" ? `Latest - ${capitalize(method)}` : `${date} - ${capitalize(method)} (selected)`;
    document.getElementById("image-label").textContent = imageLabel;

    updateSidebarImages(method, date);  // Update the sidebar with the current date
}

// Function to check if an image exists (returns true if exists, false if not)
function imageExists(url) {
    const img = new Image();
    img.src = url;
    return new Promise((resolve) => {
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}

// Function to calculate days ago
function daysAgo(date) {
    const diffTime = currentDate - date;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Function to dynamically generate images for the past week
async function updateSidebarImages(method, selectedDate) {
    const sidebarImagesContainer = document.querySelector('.sidebar-images');

    // Store current scroll position
    const currentScrollPos = sidebarImagesContainer.scrollTop;

    // Generate past week's images (only update if the images are different)
    let currentImages = sidebarImagesContainer.querySelectorAll('.image-container');
    let imageCount = 0;

    for (let i = -1; i <= 14; i++) {
        // Get date, or latest for first one
        let pastDate;
        let pastDateStr;
        if (i == -1) {
            pastDateStr = "latest"
        } else {
            pastDate = new Date(currentDate);
            pastDate.setDate(currentDate.getDate() - i); // Go back i days
            pastDateStr = pastDate.toISOString().slice(0, 10); // Format past date (YYYY-MM-DD)
        }

        let imageUrl = `Images/${method}-${pastDateStr}.png`;
        if (pastDateStr == "latest") imageUrl += "?"+getMinuteTimestamp();

        // Check if the image exists before adding to sidebar
        const exists = await imageExists(imageUrl);
        if (exists) {
            let imageContainer = currentImages[imageCount];

            if (!imageContainer) {
                // If no container exists, create a new one
                imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');
                sidebarImagesContainer.appendChild(imageContainer);
            }

            // Create date label (X days ago)
            const days = daysAgo(pastDate);
            let dateLabel = imageContainer.querySelector('.date-label');
            if (!dateLabel) {
                dateLabel = document.createElement('div');
                dateLabel.classList.add('date-label');
                imageContainer.appendChild(dateLabel);
            }

            if (pastDateStr == "latest") {
                dateLabel.textContent = `Latest`;
            }
            else {
                dateLabel.textContent = `${days} days ago`;
            }

            // Create image element
            let imgElement = imageContainer.querySelector('img');
            if (!imgElement) {
                imgElement = document.createElement('img');
                imageContainer.appendChild(imgElement);
            }
            // Reregister click method with new params
            imgElement.onclick = () => {
                // Change the main image to the clicked sidebar image
                changeImage(method, pastDateStr);
            };
            imgElement.src = imageUrl;
            imgElement.alt = `Stats from ${pastDateStr}`;

            imageCount++;
        }
    }

    // Restore the previous scroll position
    sidebarImagesContainer.scrollTop = currentScrollPos;

    // Mark the selected date image in the sidebar
    const allSidebarImages = sidebarImagesContainer.querySelectorAll('img');
    allSidebarImages.forEach((img) => {
        if (img.src.includes(selectedDate)) {
            img.style.border = "3px solid #007BFF"; // Highlight selected image
        } else {
            img.style.border = "none";
        }
    });
}

// Initialize with Stats Method "frequency" and the "latest" image when the page loads
window.onload = () => {
    let selectedData = window.location?.href?.split("#")?.[1]?.split("+").slice(0, 2);

    if (selectedData) changeImage(...selectedData);
    else changeImage("frequency", "latest"); // Default image when the page loads
};
