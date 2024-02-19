const Row = require("../models/location_seat_rows");
const Seat = require("../models/location_seats");

async function seatings (req, res) {
    try {
        const concertId = req.params.concertId
        const showId = req.params.showId

        const rows = await Row.findAll({
            where: {show_id: showId},
            order: [['order', 'asc']]
        })

        if (rows.length === 0) {
            return res.status(404).json({ error: 'A concert or show with this ID does not exist' });
        }    
        
        const rows_array = [];
        for (const row of rows) {
            let seats = await Seat.findAll({
                where: { location_seat_row_id: row.id }, 
                order: [['number', 'ASC']] 
            });

            const unavailable = seats
                .map(seat => seat.ticket_id !== null ? seat.number : null)
                .filter(number => number !== null);

            seats_json = {
                total: seats.length,
                unavailable: unavailable
            }

            row_json = {
                id: row.id,
                name: row.name,
                seats: seats_json
            }
            rows_array.push(row_json)
        }

        res.json(rows_array)

    } catch(error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = seatings