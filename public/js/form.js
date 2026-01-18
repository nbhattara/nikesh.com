const form = () => {
  const contactForm = document.querySelector(".contactForm");
  const responseMessage = document.querySelector(".response");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      message: formData.get("message"),
    };

    responseMessage.classList.add("open");
    responseMessage.textContent = "Please wait...";

    try {
      const res = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.text();
      responseMessage.textContent = result;
    } catch (error) {
      console.error(error.message);
      responseMessage.textContent = "An error occurred. Please try again.";
    } finally {
      setTimeout(() => {
        responseMessage.classList.remove("open");
      }, 3000);
      e.target.reset();
    }
  });
};

export default form;