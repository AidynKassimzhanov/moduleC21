const Booking = require("../models/bookings");
const Concert = require("../models/concerts");
const Row = require("../models/location_seat_rows");
const Seat = require("../models/location_seats");
const Location = require("../models/locations");
const Show = require("../models/shows");
const Ticket = require("../models/tickets");

const tickets = async (req, res) => {
    try {
        let {code, name} = req.body

        const booking = await Booking.findOne({where: {name: name}})
        const ticket = await Ticket.findOne({where: {code: code}})

        if (!booking || !ticket) {
            return res.status(401).json({"error": "Unauthorized"})
        }

        const tickets = await Ticket.findAll({where: {booking_id: booking.id}})

        const tickets_array = await Promise.all(tickets.map( async (ticket) =>{
            
            const seat = await Seat.findOne({ where: { ticket_id: ticket.id } })
            const row = await Row.findOne({where: {id: seat.location_seat_row_id}})
            const show = await Show.findOne({where: {id: row.show_id}})
            const concert = await Concert.findOne({where: {id: show.concert_id}})
            const location = await Location.findOne({where: {id: concert.location_id}})
            
            return {
                id: ticket.id,
                code: ticket.code,
                name: booking.name,
                created_at: ticket.created_at,
                row: { id: row.id, name: row.name },
                seat: seat.number,
                show: {
                    id: show.id,
                    start: show.start,
                    end: show.end,
                    concert: { 
                        id: concert.id, 
                        name: concert.artist, 
                        location: { 
                            id: location.id, 
                            name: location.name 
                        } 
                    }
                }
            }
        }))

        res.status(201).json({"tickets": tickets_array})

    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = tickets