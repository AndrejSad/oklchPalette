document.getElementById("email-btn").addEventListener("click", function (e) {
  e.preventDefault();

  const email = "info@oklchpalette.com";
  const textSpan = this.querySelector(".email-text");
  const iconSpan = this.querySelector(".arrow");
  const originalText = textSpan.textContent;

  navigator.clipboard.writeText(email).then(() => {
    textSpan.textContent = "Copied!";
    iconSpan.textContent = "check";
    this.style.borderColor = "var(--accent)";

    setTimeout(() => {
      textSpan.textContent = originalText;
      iconSpan.textContent = "content_copy";
      this.style.borderColor = "";
    }, 2000);
  });
});
