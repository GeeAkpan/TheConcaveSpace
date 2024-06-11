document.addEventListener('DOMContentLoaded', () => {
    const individualDesks = 10;
    const teamDesks = 5;
    let bookings = [];

    // Generate desk elements
    const individualDeskContainer = document.getElementById('individual-desks');
    const teamDeskContainer = document.getElementById('team-desks');

    for (let i = 1; i <= individualDesks; i++) {
        const desk = document.createElement('div');
        desk.className = 'desk';
        desk.textContent = `Desk ${i}`;
        desk.dataset.type = 'individual';
        desk.dataset.number = i;
        individualDeskContainer.appendChild(desk);
    }

    for (let i = 1; i <= teamDesks; i++) {
        const desk = document.createElement('div');
        desk.className = 'desk';
        desk.textContent = `Desk ${i}`;
        desk.dataset.type = 'team';
        desk.dataset.number = i;
        teamDeskContainer.appendChild(desk);
    }

    const bookingForm = document.getElementById('booking-form');
    bookingForm.addEventListener('submit', handleBooking);

    function handleBooking(event) {
        event.preventDefault();

        const deskType = document.getElementById('desk-type').value;
        const deskNumber = parseInt(document.getElementById('desk-number').value);
        const membershipTier = document.getElementById('membership-tier').value;
        const hours = parseInt(document.getElementById('hours').value);

        if (isDeskBooked(deskType, deskNumber)) {
            alert('This desk is already booked.');
            return;
        }

        let pricePerHour;
        if (deskType === 'individual') {
            switch (membershipTier) {
                case 'basic':
                    pricePerHour = 10;
                    break;
                case 'premium':
                    pricePerHour = 15;
                    break;
                case 'executive':
                    pricePerHour = 20;
                    break;
            }
        } else {
            pricePerHour = 25;
        }

        let totalCharge = pricePerHour * hours;
        if (hours > 3) {
            totalCharge *= 0.9;
        }

        markDeskAsBooked(deskType, deskNumber);
        displayTotalCharge(totalCharge);

        // Record the booking
        bookings.push({ deskType, deskNumber, membershipTier, hours, totalCharge });

        // Update the dashboard
        updateRevenueDashboard();
    }

    function isDeskBooked(deskType, deskNumber) {
        const deskSelector = `[data-type="${deskType}"][data-number="${deskNumber}"]`;
        const desk = document.querySelector(deskSelector);
        return desk.classList.contains('booked');
    }

    function markDeskAsBooked(deskType, deskNumber) {
        const deskSelector = `[data-type="${deskType}"][data-number="${deskNumber}"]`;
        const desk = document.querySelector(deskSelector);
        desk.classList.add('booked');
    }

    function displayTotalCharge(amount) {
        const totalChargeDiv = document.getElementById('total-charge');
        totalChargeDiv.textContent = `Total Charge: $${amount.toFixed(2)}`;
    }

    function updateRevenueDashboard() {
        const revenueSummary = document.getElementById('revenue-summary');
        revenueSummary.innerHTML = ''; // Clear previous summary

        const revenueByTier = bookings.reduce((acc, booking) => {
            const tier = booking.membershipTier;
            if (!acc[tier]) acc[tier] = 0;
            acc[tier] += booking.totalCharge;
            return acc;
        }, {});

        for (const tier in revenueByTier) {
            const div = document.createElement('div');
            div.textContent = `${tier.charAt(0).toUpperCase() + tier.slice(1)}: $${revenueByTier[tier].toFixed(2)}`;
            revenueSummary.appendChild(div);
        }
    }
});
