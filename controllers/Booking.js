const Booking = require("../models/bookings")
const Concert = require("../models/concerts")
const Row = require("../models/location_seat_rows")
const Seat = require("../models/location_seats")
const Location = require("../models/locations")
const Reservation = require("../models/reservations")
const Show = require("../models/shows")
const Ticket = require("../models/tickets")
const uuid = require('uuid');

const isValidRequestData = (requestData) => {
    let errors = []
    let error
    for (const key in requestData) {
        if (requestData[key] === "") {
            error = {key : `The ${key} field is required.`}
            errors.push(error)
        }
        if (typeof requestData[key] !== 'string') {
            error = {key : `The ${key} must be a string.`}
            errors.push(error)
        }
    }
    return errors
}

const generateUniqueRandomString = async () => {
    let randomString;
    let isUnique = false;

    while (!isUnique) {
        randomString = uuid.v4().replace(/-/g, '').toUpperCase().slice(0, 10);                                                  // Генерируем случайную строку
        const existingReservation = await Ticket.findOne({ where: { code: randomString } });    // Проверяем, существует ли такая строка в базе данных
        if (!existingReservation) {                                                             // Если строка не существует, помечаем ее как уникальную и выходим из цикла
            isUnique = true;
        }
    }
    return randomString;
}

const booking = async (req, res) => {
    try {
    //Получение данных с запроса
        const concertId = req.params.concertId
        const showId = req.params.showId
        let requestData = req.body
        const concert = await Concert.findOne({where: {id: concertId}})
        const show = await Show.findOne({where: {id: showId}})

    //Проверка наличия концерта или шоу 
        if (!concert || !show) {
            return res.status(404).json({ error: 'A concert or show with this ID does not exist' });
        }    
    //Проверка срока действительности токена
        const reservation = await Reservation.findOne({where: {token: requestData.reservation_token}})
        if (!reservation || reservation.expires_at < new Date()) {
            return res.status(401).json({"error": "Unauthorized"})
        }
    //Проверка валидности данных запроса
        const validErrors = isValidRequestData(requestData)
        if (validErrors.length !== 0) {
            const error = {
                "error": "Validation failed", 
                "fields": validErrors
            }
            return res.status(422).json(error)
        } 
    //Бронирование 
        const newBooking = await Booking.create({
            name: requestData.name,
            address: requestData.address,
            city: requestData.city,
            zip: requestData.zip,
            country: requestData.country,
            created_at: new Date()
        })

        const seats = await Seat.findAll({where: {reservation_id: reservation.id}})

        let tickets = []
        for (const seat of seats) {
            if (seat.ticket_id) {
                continue
            }
            const ticket = await Ticket.create({
                code: await generateUniqueRandomString(),
                created_at: new Date(),
                booking_id: newBooking.id
            })
            await seat.update(
                {ticket_id: ticket.id, reservation_id: null},
                // {where: {number: reservation.seat, location_seat_row_id: row.id}}
            )

            const row = await Row.findOne({where: {id: seat.location_seat_row_id}})
            const row_json = {
                id: row.id,
                name: row.name
            }

            const location = await Location.findOne({where: {id: concert.location_id}})
            const location_json = {
                id: location.id,
                name: location.name
            }   
            
            const concert_json = {
                id: concert.id,
                name: concert.artist,
                location: location_json
            }   

            const show_json = {
                id: show.id,
                start: show.start,
                end: show.end,
                concert: concert_json
            }               

            const ticket_json = {
                id: ticket.id,
                code: ticket.code,
                name: newBooking.name,
                created_at: ticket.created_at,
                row : row_json,
                seat: seat.number,
                show: show_json
            }
            tickets.push(ticket_json)
        }

        if (tickets.length===0) {
            return res.status(422).json({"error" : "Selected tickets are already booked"})
        }

        res.status(201).json(tickets)

    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = booking