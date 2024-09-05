
// classroom-script.js

document.addEventListener('DOMContentLoaded', function () {
    const availabilityForm = document.getElementById('availabilityForm');
    const bookingForm = document.getElementById('bookingForm');
    const bookingList = document.getElementById('bookingList');
    const availabilityResult = document.getElementById('availabilityResult');

    const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

    // Function to check availability
    availabilityForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const classroomID = document.getElementById('classroomID').value;
        const bookingDate = document.getElementById('bookingDate').value;
        const bookingTime = document.getElementById('bookingTime').value;
        const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);

        const isAvailable = bookings.every(booking => {
            return booking.classroomID !== classroomID || 
                   (booking.endTime <= bookingDateTime || booking.startTime >= bookingDateTime);
        });

        if (isAvailable) {
            availabilityResult.textContent = "Classroom is available.";
            availabilityResult.style.color = "green";
        } else {
            availabilityResult.textContent = "Classroom is not available.";
            availabilityResult.style.color = "red";
        }
    });

    // Function to book a classroom
    bookingForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const bookerName = document.getElementById('bookerName').value;
        const bookerID = document.getElementById('bookerID').value;
        const classroomID = document.getElementById('classroomToBook').value;
        const bookingStart = new Date(document.getElementById('bookingStart').value);
        const bookingEnd = new Date(document.getElementById('bookingEnd').value);

        const newBooking = {
            id: Date.now(),
            name: bookerName,
            userId: bookerID,
            classroomID: classroomID,
            startTime: bookingStart,
            endTime: bookingEnd
        };

        bookings.push(newBooking);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        // Render the new booking and clear form
        renderBooking(newBooking);
        bookingForm.reset();
    });

    // Function to render a booking
    function renderBooking(booking) {
        const listItem = document.createElement('li');
        listItem.textContent = `${booking.name} (ID: ${booking.userId}) booked Classroom ${booking.classroomID} from ${booking.startTime.toLocaleString()} to ${booking.endTime.toLocaleString()}`;
        bookingList.appendChild(listItem);
    }

    // Render all existing bookings
    bookings.forEach(renderBooking);
});
