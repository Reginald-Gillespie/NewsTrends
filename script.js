// Array containing the different methods of stats images
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

// Function to change the main image based on the selected stats method
function changeImage(method, date = selectedDate) {
    // Update the current method and date
    selectedMethod = method;
    selectedDate = date;

    const imagePath = `Images/${method}-${date}.png`;
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

    for (let i = 0; i <= 14; i++) {
        const pastDate = new Date(currentDate);
        pastDate.setDate(currentDate.getDate() - i); // Go back i days
        const pastDateStr = pastDate.toISOString().slice(0, 10); // Format past date (YYYY-MM-DD)

        const imageUrl = `Images/${method}-${pastDateStr}.png`;

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
            dateLabel.textContent = `${days} days ago`;

            // Create image element
            let imgElement = imageContainer.querySelector('img');
            if (!imgElement) {
                imgElement = document.createElement('img');
                imgElement.onclick = () => {
                    // Change the main image to the clicked sidebar image
                    changeImage(method, pastDateStr);
                };
                imageContainer.appendChild(imgElement);
            }
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
    changeImage('frequency'); // Default image when the page loads
};
