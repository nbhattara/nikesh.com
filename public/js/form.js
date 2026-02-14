const form = () => {
  const contactForm = document.querySelector(".contactForm");
  const submitButton = contactForm.querySelector("button[type='submit']");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    // Store original button text
    const originalButtonText = submitButton.innerHTML;
    
    // Disable button and show sending state
    submitButton.disabled = true;
    submitButton.innerHTML = `<span class="btn-spinner" aria-hidden="true"></span> Sending...`;
    
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json().catch(() => null);

      if (res.ok) {
        // Show success state on button
        submitButton.innerHTML = `<span class="btn-tick" aria-hidden="true">✓</span> Sent!`;
        submitButton.classList.add("success");
        
        // Reset button after delay
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
          submitButton.classList.remove("success");
        }, 2000);
      } else {
        // Show error state on button
        submitButton.innerHTML = `<span class="btn-error" aria-hidden="true">✖</span> Error`;
        submitButton.classList.add("error");
        
        // Reset button on error after delay
        setTimeout(() => {
          submitButton.disabled = false;
          submitButton.innerHTML = originalButtonText;
          submitButton.classList.remove("error");
        }, 2000);
      }
    } catch (error) {
      console.error(error.message);
      
      // Show error state on button
      submitButton.innerHTML = `<span class="btn-error" aria-hidden="true">✖</span> Error`;
      submitButton.classList.add("error");
      
      // Reset button on error after delay
      setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
        submitButton.classList.remove("error");
      }, 2000);
    } finally {
      e.target.reset();
    }
  });
};

export default form;