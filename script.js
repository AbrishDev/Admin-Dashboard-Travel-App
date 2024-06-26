// Populate guides in the add tour form
async function populateGuideOptions() {
  const guides = await fetchGuides();
  const guideSelect = document.getElementById("tourGuide");
  guideSelect.innerHTML = ""; // Clear existing options

  guides.forEach((guide) => {
    const option = document.createElement("option");
    option.value = JSON.stringify({ id: guide._id, name: guide.fullName });
    option.textContent = guide.fullName;
    guideSelect.appendChild(option);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  populateGuideOptions();
});

// Function to fetch users from backend
async function fetchUsers() {
  try {
    const response = await fetch("http://localhost:5000/api/users");
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    const users = await response.json();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to populate users in the table
function populateUsers(users) {
  const tableBody = document.getElementById("userTableBody");
  tableBody.innerHTML = ""; // Clear existing rows
  let userID = 0;

  users.forEach((user) => {
    const row = document.createElement("tr");
    userID++;
    row.innerHTML = `
        <td>${userID}</td>
        <td>${user.username}</td>
        <td>${user.fullName}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>
          <button onclick="displayBookings('${user.username}')">Booking</button>
        </td>
      `;
    tableBody.appendChild(row);
  });
}

// Function to handle button click to fetch and display users
async function showUsers() {
  const users = await fetchUsers();
  populateUsers(users);
}

// Function to fetch tours from backend
async function fetchTours() {
  try {
    const response = await fetch("http://localhost:5000/api/tours/tours");
    if (!response.ok) {
      throw new Error("Failed to fetch tours");
    }
    const data = await response.json();
    return data.data.tours;
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

// Function to populate tours in the table
function populateTours(tours) {
  const tableBody = document.getElementById("tourTableBody");
  tableBody.innerHTML = ""; // Clear existing rows
  let tourID = 0;

  tours.forEach((tour) => {
    const row = document.createElement("tr");
    tourID++;
    row.innerHTML = `
        <td>${tourID}</td>
        <td>${tour.name}</td>
        <td>${tour.location}</td>
        <td><img src="${tour.image}" alt="${
      tour.name
    }" style="width: 100px; height: auto;"></td>
        <td>${tour.description}</td>
        <td>${tour.price}</td>
        <td>${tour.people}</td>
        <td>${
          tour.guideName ? tour.guideName : "Not Assigned"
        }</td>
      `;
    tableBody.appendChild(row);
  });
}

// Function to handle button click to fetch and display tours
async function showTours() {
  const tours = await fetchTours();
  populateTours(tours);
}

// Function to show the Add Tour form modal
function showAddTourForm() {
  const modal = document.getElementById("addTourModal");
  modal.style.display = "block";
}

// Function to close the Add Tour form modal
function closeAddTourForm() {
  const modal = document.getElementById("addTourModal");
  modal.style.display = "none";
}

async function submitTourForm(event) {
  event.preventDefault();

  const selectedGuide = JSON.parse(document.getElementById("tourGuide").value);

  const tourData = {
    name: document.getElementById("tourName").value,
    location: document.getElementById("tourLocation").value,
    image: document.getElementById("tourImageURL").value,
    description: document.getElementById("tourDescription").value,
    price: parseInt(document.getElementById("tourPrice").value),
    people: parseInt(document.getElementById("tourPeople").value),
    assignedGuide: selectedGuide.id,
    guideName: selectedGuide.name // Add guide name to the tour data
  };

  try {
    const response = await fetch("http://localhost:5000/api/tours/addTours", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tourData),
    });

    if (!response.ok) {
      throw new Error("Failed to add tour");
    }

    // Close modal and optionally update UI to reflect the added tour
    closeAddTourForm();
    alert("Tour added successfully!");

    // Remove the assigned guide from the available guides list
    const guideSelect = document.getElementById("tourGuide");
    const optionToRemove = guideSelect.querySelector(`option[value='${JSON.stringify(selectedGuide)}']`);
    if (optionToRemove) {
      guideSelect.removeChild(optionToRemove);
    }

    // Optionally update UI to reflect the added tour
    // fetchTours(); // Uncomment to fetch and populate tours after adding a new one
  } catch (error) {
    console.error("Error adding tour:", error);
    alert("Failed to add tour");
  }
}


// Function to fetch bookings for a specific user
async function fetchBookings(username) {
  try {
    const response = await fetch(
      `http://localhost:5000/api/bookings/${username}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    const data = await response.json();
    return data.data.bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

// Function to display bookings in the HTML
async function displayBookings(username) {
  const bookingDetails = document.getElementById("bookingDetails");
  bookingDetails.innerHTML = ""; // Clear previous content

  const bookings = await fetchBookings(username);
  if (bookings.length === 0) {
    bookingDetails.innerHTML = "<p>No bookings found.</p>";
    return;
  }

  const bookingsHTML = bookings
    .map(
      (booking) => `
      <div class="booking-item">
        <p><strong>Tour Name:</strong> ${booking.tourName}</p>
        <p><strong>Booked At:</strong> ${new Date(
          booking.createdAt
        ).toLocaleString()}</p>
        <hr>
      </div>
    `
    )
    .join("");

  bookingDetails.innerHTML = bookingsHTML;
}

function logout() {
  // Redirect to login page
  window.location.href = "./login/login.html";
}

// Function to submit Add Guide form
async function submitGuideForm(event) {
  event.preventDefault();

  const formData = new FormData();
  formData.append("fullName", document.getElementById("guideFullName").value);
  formData.append("location", document.getElementById("guideLocation").value);
  formData.append("email", document.getElementById("guideEmail").value);
  formData.append("cv", document.getElementById("guideCV").files[0]);
  formData.append("phone", document.getElementById("guidePhone").value);

  try {
    const response = await fetch("http://localhost:5000/api/guides/addGuide", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to add guide");
    }

    // Close modal and optionally update UI to reflect the added guide
    closeAddGuideForm();
    alert("Guide added successfully!");
    // Optionally update UI to reflect the added guide
    // fetchGuides(); // Uncomment to fetch and populate guides after adding a new one
  } catch (error) {
    console.error("Error adding guide:", error);
    alert("Failed to add guide");
  }
}

// Function to show Add Guide modal
function showAddGuideForm() {
  document.getElementById("addGuideModal").style.display = "block";
}

// Function to close Add Guide modal
function closeAddGuideForm() {
  document.getElementById("addGuideModal").style.display = "none";
}

// Function to fetch guides from backend
async function fetchGuides() {
  try {
    const response = await fetch("http://localhost:5000/api/guides/available");
    if (!response.ok) {
      throw new Error("Failed to fetch guides");
    }
    const data = await response.json();
    return data.guides;
  } catch (error) {
    console.error("Error fetching guides:", error);
    return [];
  }
}

// Function to populate guides in the table
function populateGuides(guides) {
  const tableBody = document.getElementById("guideTableBody");
  tableBody.innerHTML = ""; // Clear existing rows
  let guideID = 0;

  guides.forEach((guide) => {
    guideID++;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${guideID}</td>
      <td>${guide.fullName}</td>
      <td>${guide.location}</td>
      <td>${guide.email}</td>
      <td>${guide.phone}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Function to handle button click to fetch and display guides
async function showAvailableGuides() {
  const guides = await fetchGuides();
  populateGuides(guides);
}
