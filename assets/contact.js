(function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusEl = document.getElementById("contact-form-status");
    var submitBtn = document.getElementById("contact-form-submit");

    function setStatus(message, isError) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? "#c0392b" : "#2e7d32";
    }

    /*  reCAPTCHA v2 INVISIBLE. There is no checkbox: submitting starts the
     *  challenge, and Google calls window.onContactCaptcha with a token once it
     *  passes. The send therefore happens in that callback, not here. */
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

        if (typeof grecaptcha === "undefined") {
            setStatus("Verification failed to load. Please reload the page.", true);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = "Verifying…";
        try {
            grecaptcha.execute();
        } catch (err) {
            submitBtn.disabled = false;
            submitBtn.textContent = "Send message";
            setStatus("Could not start verification. Please reload the page.", true);
        }
    });

    // Named on the widget via data-callback, so it has to be global.
    window.onContactCaptcha = function (recaptchaResponse) {
        var name = form.name.value.trim();
        var email = form.email.value.trim();
        var message = form.message.value.trim();

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
    };

    // Challenge abandoned or token expired - re-enable so the visitor is not stuck.
    window.onContactCaptchaError = function () {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send message";
        setStatus("Verification did not complete. Please try again.", true);
        if (typeof grecaptcha !== "undefined") grecaptcha.reset();
    };
})();
