const Concert = require("../models/concerts")
const Location = require("../models/locations")
const Show = require("../models/shows")

async function concert (req, res) {
    try {
        const concert_id = req.params.concertId
        const concert = await Concert.findOne({where: {id: concert_id}})
        
        if (!concert) {
            return res.status(404).json({ error: 'A concert with this ID does not exist' });
        }

        let shows = await Show.findAll({ where: { concert_id: concert.id }, order: [['start', 'ASC']] })
        const show_array = shows.map(show => ({
            id: show.id,
            start: show.start,
            end: show.end
        }));
        let location = await Location.findOne({id: concert.id})
        const location_json = {
            id: location.id,
            name: location.name
        }
        const concert_json = {
            id: concert.id,
            artist: concert.artist,
            location: location_json,
            shows: show_array
        };

        const json = {concert: concert_json}

        res.json(json)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = concert