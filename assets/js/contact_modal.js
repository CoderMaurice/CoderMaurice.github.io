(function () {
  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.top = "-9999px";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyText(text));
    }

    return fallbackCopyText(text);
  }

  function setCopiedState(button, copied) {
    const label = button.getAttribute("data-copy-label") || "contact detail";
    const icon = button.querySelector("i");
    const text = copied ? "Copied" : `Copy ${label}`;

    button.classList.toggle("is-copied", copied);
    button.setAttribute("aria-label", text);
    button.setAttribute("title", text);

    if (icon) {
      icon.className = copied ? "fa-solid fa-check" : "fa-regular fa-copy";
    }
  }

  document.querySelectorAll(".contact-modal-copy").forEach((button) => {
    let resetTimer;

    button.addEventListener("click", (event) => {
      const value = button.getAttribute("data-copy-value");
      const shouldBlurAfterReset = event.detail > 0;

      if (!value) {
        return;
      }

      copyText(value).then(() => {
        window.clearTimeout(resetTimer);
        setCopiedState(button, true);
        resetTimer = window.setTimeout(() => {
          setCopiedState(button, false);

          if (shouldBlurAfterReset) {
            button.blur();
          }
        }, 1600);
      });
    });
  });
})();
