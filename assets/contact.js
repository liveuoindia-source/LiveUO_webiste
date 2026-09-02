(function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusEl = document.getElementById("contact-form-status");
    var submitBtn = document.getElementById("contact-form-submit");

    function setStatus(message, isError) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? "#c0392b" : "#2e7d32";
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        setStatus("", false);

        var name = form.name.value.trim();
        var email = form.email.value.trim();
        var message = form.message.value.trim();
        if (!name || !email || !message) {
            setStatus("Please fill in your name, email, and message.", true);
            return;
        }

        var recaptchaResponse = typeof grecaptcha !== "undefined" ? grecaptcha.getResponse() : "";
        if (!recaptchaResponse) {
            setStatus("Please complete the reCAPTCHA check.", true);
            return;
        }

        var payload = {
            name: name,
            email: email,
            company: form.company.value.trim(),
            service: form.service.value,
            message: message,
            website: form.website.value,
            "g-recaptcha-response": recaptchaResponse
        };

        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";

        fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        })
            .then(function (res) {
                return res.json().then(function (data) {
                    return { ok: res.ok, data: data };
                });
            })
            .then(function (result) {
                if (!result.ok) {
                    throw new Error(result.data.error || "Something went wrong. Please try again.");
                }
                if (result.data.warning) {
                    setStatus(result.data.warning, false);
                } else {
                    setStatus("Thanks — your message is on its way. We'll get back to you within one business day.", false);
                }
                form.reset();
                if (typeof grecaptcha !== "undefined") grecaptcha.reset();
            })
            .catch(function (err) {
                setStatus(err.message, true);
                if (typeof grecaptcha !== "undefined") grecaptcha.reset();
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = "Send message";
            });
    });
})();
