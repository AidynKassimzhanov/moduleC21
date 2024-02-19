const Router = require('express');
const concerts = require('./controllers/Concerts');
const concert = require('./controllers/Concert');
const seatings = require('./controllers/Seatings');
const reservations = require('./controllers/Reservations');
const booking = require('./controllers/Booking');
const tickets = require('./controllers/Tickets');
const ticketCancel = require('./controllers/TicketCancel');

const router = new Router()

router.get('/concerts', concerts);
router.get('/concerts/:concertId', concert);
router.get('/concerts/:concertId/shows/:showId/seating', seatings);

router.post('/concerts/:concertId/shows/:showId/reservation', reservations);
router.post('/concerts/:concertId/shows/:showId/booking', booking);
router.post('/tickets', tickets);
router.post('/tickets/:ticketId/cancel', ticketCancel);

module.exports = router