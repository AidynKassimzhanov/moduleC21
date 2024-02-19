const Booking = require("../models/bookings")
const Seat = require("../models/location_seats")
const Ticket = require("../models/tickets")

const ticketCancel = async (req, res) => {
    try {
        const ticketId = req.params.ticketId
        let {code, name} = req.body

        const ticket = await Ticket.findOne({where: {id: ticketId}})
        if (!ticket) {
            return res.status(404).json({"error": "A ticket with this ID does not exist"})
        }
        const ticket2 = await Ticket.findOne({where: {code: code}})
        
        const booking = await Booking.findOne({where: {name: name, id: ticket.booking_id}})

        if (!booking || !ticket2) {
            return res.status(401).json({"error": "Unauthorized"})
        }

        await Seat.update(
            {ticket_id: null, reservation_id: null},
            {where: {ticket_id: ticket.id}}
        )
        await ticket.destroy()

        return res.status(204).json({"del":"Deleted"})
    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = ticketCancel