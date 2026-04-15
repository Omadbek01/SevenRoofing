document.addEventListener('DOMContentLoaded', function() {
    if (window.location.search.indexOf('error=1') !== -1) {
        var forms = document.querySelectorAll('.enquiry-form');
        forms.forEach(function(form) {
            var status = form.querySelector('.form-status');
            if (status) {
                status.textContent = 'Sorry, there was an error sending your message. Please try again or call us on 0404 402 145.';
                status.className = 'form-status error';
            }
        });
    }

    var forms = document.querySelectorAll('.enquiry-form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function() {
            var btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.textContent = 'Sending...';
            }

            window.dataLayer = window.dataLayer || [];
            dataLayer.push({
                event: 'form_submit',
                form_name: form.id || 'enquiry_form',
                form_location: window.location.pathname
            });

            if (typeof gtag === 'function') {
                gtag('event', 'generate_lead', {
                    event_category: 'form',
                    form_name: form.id || 'enquiry_form',
                    page_location: window.location.href,
                    transport_type: 'beacon'
                });
            }
        });
    });
});
