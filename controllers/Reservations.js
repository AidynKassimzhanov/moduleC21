const Concert = require("../models/concerts");
const Row = require("../models/location_seat_rows");
const Seat = require("../models/location_seats");
const Reservation = require("../models/reservations");
const Show = require("../models/shows");
const uuid = require('uuid');
const { Op } = require('sequelize');

// Создание токена для резервации с временем истечения
async function createReservationToken(reservation_token, duration) {
    const newToken = uuid.v4(); // Генерация уникального идентификатора
    if (duration===null) {
        duration = 300
    }
    const expires_at = Date.now() + duration * 1000; // Текущее время + 300 секунд

    let token;

    if (!reservation_token) {
        token = await Reservation.create({token: newToken, expires_at: expires_at})
    }else{
        token = await Reservation.findOne({where: {token: reservation_token}})
        if (token.expires_at < new Date()) {
            await Reservation.update(
                { token: reservation_token, expires_at: expires_at },
                { where: { token: reservation_token } }
            );
            token = await Reservation.findOne({ where: { token: reservation_token } });    
        }
    }

    return token;
}

const isValidReservation = async (reservations, show, duration) => {
    for (const reservation of reservations) {
        if (!reservation.row || !reservation.seat) {
            return 'The row or seat field is required.'
        }
        const row = await Row.findOne({ where: { order: reservation.row, show_id: show.id } });
        if (!row) {
            return `Seat ${reservation.seat} in row ${reservation.row} is invalid.`
        }
    
        const seat = await Seat.findOne({ where: { number: reservation.seat, location_seat_row_id: row.id } });
        if (!seat) {
            return `Seat ${reservation.seat} in row ${reservation.row} is invalid.`;
        }
    
        if (seat.reservation_id !== null || seat.ticket_id !== null) {
            return `Seat ${reservation.seat} in row ${reservation.row} is already taken.`;
        }

        if (duration > 300 || duration < 1) {
            return 'The duration must be between 1 and 300.';
        }
    }
    
    return null;
};

async function clearExpiredReservations() {
    const expiredReservations = await Reservation.findAll({ where: { expires_at: { [Op.lt]: new Date() } } });

    for (const reservation of expiredReservations) {
        console.log(reservation)
        await Seat.update({ reservation_id: null }, { where: { reservation_id: reservation.id } });
    }
}

async function createReservation(reservations, reservationToken) {
    
    for (const reservation of reservations) {
        let row = await Row.findOne({where: { order: reservation.row}})
        Seat.update(
            {reservation_id: reservationToken.id},
            {where: {number: reservation.seat, location_seat_row_id: row.id}}
        )
    } 
}



const reservations = async (req, res) => {
    try {
        await clearExpiredReservations()

        const concertId = req.params.concertId
        const showId = req.params.showId
        let { reservation_token, reservations, duration } = req.body
    
        const concert = await Concert.findOne({where: {id: parseInt(concertId)}})
        const show = await Show.findOne({where: {id: showId}})
    //Проверка наличия концерта или шоу 
        if (!concert || !show) {
            return res.status(404).json({ error: 'A concert or show with this ID does not exist' });
        }
    //проверка валидности введенных данных
        const error = await isValidReservation(reservations, show, duration);
        if (error) {
            return res.status(422).json({ error: error });
        }
    
    //Проверка и создание токена   
        const reservationToken = await createReservationToken(reservation_token, duration)
    
        await createReservation(reservations, reservationToken)
    
        const json = {
            reserved: true,
            reservation_token: reservationToken.token,
            reserved_until: reservationToken.expires_at
        }
    
        res.status(201).json(json)
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = reservations;