/* =========================================================
   SUPABASE CONFIGURATION
========================================================= */

const SUPABASE_URL = 'https://aljhdenowhmktczsfjjh.supabase.co';

const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_2epoy6mf-WE-NwxsEg9YUw_q0nWmMv3';

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);


/* =========================================================
   LOADING SCREEN
========================================================= */

window.addEventListener('load', () => {

  const loading = document.getElementById('loading');

  setTimeout(() => {
    if (loading) {
      loading.classList.add('hidden');
    }
  }, 700);

});


/* =========================================================
   OPEN INVITATION
========================================================= */

const openBtn = document.getElementById('openBtn');
const cover = document.getElementById('cover');
const invitation = document.getElementById('invitation');

if (openBtn) {

  openBtn.addEventListener('click', () => {

    cover.classList.add('opened');

    setTimeout(() => {

      cover.style.display = 'none';

      invitation.classList.remove('hidden');

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

    }, 700);

  });

}


/* =========================================================
   COUNTDOWN
========================================================= */

const weddingDate = new Date('2026-11-01T18:00:00+05:30');

function updateCountdown() {

  const now = new Date();

  const difference = weddingDate.getTime() - now.getTime();

  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const secondsElement = document.getElementById('seconds');

  if (!daysElement) return;

  if (difference <= 0) {

    daysElement.textContent = '0';
    hoursElement.textContent = '0';
    minutesElement.textContent = '0';
    secondsElement.textContent = '0';

    return;
  }

  const days = Math.floor(
    difference / (1000 * 60 * 60 * 24)
  );

  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );

  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );

  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  daysElement.textContent = days;
  hoursElement.textContent = hours;
  minutesElement.textContent = minutes;
  secondsElement.textContent = seconds;
}

updateCountdown();

setInterval(updateCountdown, 1000);


/* =========================================================
   NOVEMBER 2026 CALENDAR
========================================================= */

function createCalendar() {

  const calendarDays = document.getElementById('calendarDays');

  if (!calendarDays) return;

  calendarDays.innerHTML = '';

  const year = 2026;
  const month = 10; // November (0 = January)

  const firstDay = new Date(year, month, 1).getDay();

  const totalDays = new Date(
    year,
    month + 1,
    0
  ).getDate();

  // Empty spaces before November 1
  for (let i = 0; i < firstDay; i++) {

    const empty = document.createElement('span');

    empty.className = 'empty-day';

    calendarDays.appendChild(empty);
  }

  // Days
  for (let day = 1; day <= totalDays; day++) {

    const dayElement = document.createElement('span');

    dayElement.textContent = day;

    if (day === 1) {
      dayElement.classList.add('wedding-day');
    }

    calendarDays.appendChild(dayElement);
  }
}

createCalendar();


/* =========================================================
   ADD TO GOOGLE CALENDAR
========================================================= */

const calendarBtn = document.getElementById('calendarBtn');

if (calendarBtn) {

  calendarBtn.addEventListener('click', () => {

    const googleCalendarUrl =
      'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=Akshay%20Shaji%20%26%20Aparna%20Aji%20Wedding%20Reception' +
      '&dates=20261101T123000Z/20261101T143000Z' +
      '&details=Wedding%20Reception%20of%20Akshay%20Shaji%20%26%20Aparna%20Aji' +
      '&location=ST%20Martin%20de%20Pores%20Church%2C%20Palarivattom';

    window.open(
      googleCalendarUrl,
      '_blank',
      'noopener'
    );

  });

}


/* =========================================================
   RSVP MODAL
========================================================= */

const rsvpBtn = document.getElementById('rsvpBtn');
const rsvpModal = document.getElementById('rsvpModal');

if (rsvpBtn && rsvpModal) {

  rsvpBtn.addEventListener('click', () => {

    rsvpModal.classList.remove('hidden');

    const nameInput =
      document.getElementById('rsvpName');

    if (nameInput) {
      setTimeout(() => nameInput.focus(), 100);
    }

  });

}


/* =========================================================
   CLOSE MODALS
========================================================= */

document.querySelectorAll('[data-close]').forEach(button => {

  button.addEventListener('click', () => {

    const modalId = button.getAttribute('data-close');

    const modal = document.getElementById(modalId);

    if (modal) {
      modal.classList.add('hidden');
    }

  });

});


/* Close when clicking outside modal */

document.querySelectorAll('.modal').forEach(modal => {

  modal.addEventListener('click', event => {

    if (event.target === modal) {
      modal.classList.add('hidden');
    }

  });

});


/* =========================================================
   RSVP → SUPABASE DATABASE
========================================================= */

const rsvpForm = document.getElementById('rsvpForm');

if (rsvpForm) {

  rsvpForm.addEventListener('submit', async (event) => {

    event.preventDefault();

    const nameInput =
      document.getElementById('rsvpName');

    const attendanceInput =
      document.getElementById('attendance');

    const guestCountInput =
      document.getElementById('guestCount');

    const messageInput =
      document.getElementById('rsvpMessageText');

    const submitButton =
      document.getElementById('rsvpSubmit');

    const messageElement =
      document.getElementById('rsvpMessage');


    const name =
      nameInput.value.trim();

    const attendance =
      attendanceInput.value;

    const guests =
      parseInt(guestCountInput.value, 10);

    const message =
      messageInput.value.trim();


    /* Basic validation */

    if (name.length < 2) {

      messageElement.textContent =
        'Please enter your name.';

      return;
    }

    if (guests < 1 || guests > 20) {

      messageElement.textContent =
        'Guest count must be between 1 and 20.';

      return;
    }


    /* Disable button */

    submitButton.disabled = true;

    submitButton.textContent =
      'SENDING...';

    messageElement.textContent =
      '';


    try {

      const { error } =
        await supabaseClient
          .from('rsvps')
          .insert([
            {
              name: name,
              attendance: attendance,
              guests: guests,
              message: message || null
            }
          ]);


      if (error) {

        console.error(
          'Supabase RSVP error:',
          error
        );

        throw error;
      }


      /* Success */

      messageElement.textContent =
        'Thank you! Your attendance has been confirmed. ❤️';

      messageElement.classList.add('success');


      /* Reset form */

      rsvpForm.reset();

      guestCountInput.value = 1;


      /* Change button */

      submitButton.textContent =
        'CONFIRMED ✓';


      /* Close modal after a short delay */

      setTimeout(() => {

        rsvpModal.classList.add('hidden');

        submitButton.disabled = false;

        submitButton.textContent =
          'CONFIRM';

        messageElement.textContent =
          '';

        messageElement.classList.remove('success');

      }, 2500);


    } catch (error) {

      console.error(error);

      messageElement.textContent =
        'Something went wrong. Please try again.';

      messageElement.classList.remove('success');

      submitButton.disabled = false;

      submitButton.textContent =
        'CONFIRM';

    }

  });

}