(function () {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var statusEl = document.getElementById("contact-form-status");
    var submitBtn = document.getElementById("contact-form-submit");

    function setStatus(message, isError) {
        statusEl.textContent = message;
        statusEl.style.color = isError ? "#c0392b" : "#2e7d32";
    }

    /*  POST to the API, tolerating a host that cannot rewrite URLs.
     *
     *  This page is a static file served by IIS, so "/api/contact" only
     *  reaches Node when something rewrites it - a Cloudflare Transform Rule,
     *  or the IIS URL Rewrite module. Where neither is in place IIS answers
     *  the request itself and the form fails with a 404 the visitor cannot
     *  act on.
     *
     *  iisnode is always reachable at /server.js/<path>, and server.js strips
     *  that prefix, so the fallback works on either configuration. The first
     *  path is tried first deliberately: once the rewrite is working this
     *  succeeds immediately and the fallback is never used, so nothing has to
     *  be undone later.
     *
     *  The body is read as text before parsing - an unrewritten request comes
     *  back as an empty body or an IIS HTML page, and JSON.parse on that
     *  reports a syntax error rather than anything the visitor can act on.
     */
    function postToApi(path, payload) {
        function attempt(url) {
            return fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            }).then(function (res) {
                return res.text().then(function (raw) {
                    var data = null;
                    try {
                        data = raw ? JSON.parse(raw) : null;
                    } catch (err) {
                        data = null;
                    }
                    return { ok: res.ok, status: res.status, json: data !== null, data: data || {} };
                });
            });
        }

        return attempt(path).then(function (result) {
            if (result.json) return result;
            // Not JSON: the request never reached the app. Retry via iisnode.
            return attempt("/server.js" + path).then(function (viaNode) {
                if (viaNode.json) return viaNode;
                return {
                    ok: false,
                    data: { error: "The contact service is unavailable right now. Please email info@liveuo.com." }
                };
            });
        });
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

        postToApi("/api/contact", payload)
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
