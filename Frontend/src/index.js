// Toggle mobile navigation menu
document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const navMenu = document.querySelector(".nav-menu");
  
    if (navToggle && navMenu) {
      navToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
      });
    }
  
    // Auto-hide success or error messages (e.g. appointment booked successfully)
    const successMsg = document.querySelector(".success-message");
    const errorMsg = document.querySelector(".error-message");
  
    if (successMsg || errorMsg) {
      setTimeout(() => {
        if (successMsg) successMsg.style.display = "none";
        if (errorMsg) errorMsg.style.display = "none";
      }, 5000); // Hide after 5 seconds
    }
  
    // Logout button logic
    const logoutBtn = document.querySelector("#logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        fetch("/logout")
          .then(() => {
            window.location.href = "/";
          })
          .catch(err => {
            console.error("Logout failed:", err);
          });
      });
    }
  
    // Appointment form validation
    const appointmentForm = document.querySelector("#appointmentForm");
    if (appointmentForm) {
      appointmentForm.addEventListener("submit", (e) => {
        const requiredFields = [
          "name", "age", "number", "date", "email", "time", "gender", "drname"
        ];
  
        let isValid = true;
        requiredFields.forEach(fieldId => {
          const field = document.querySelector(`#${fieldId}`);
          if (!field || !field.value.trim()) {
            isValid = false;
            field?.classList.add("input-error");
          } else {
            field?.classList.remove("input-error");
          }
        });
  
        if (!isValid) {
          e.preventDefault();
          alert("Please fill in all required fields.");
        }
      });
    }
  });
  