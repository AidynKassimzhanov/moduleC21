const Concert = require("../models/concerts")
const Location = require("../models/locations")
const Show = require("../models/shows")

async function concerts (req, res) {
    try {
        const concerts = await Concert.findAll({
            order: [['artist', 'ASC']]
        });
        const concert_array = [];
    
        for (const concert of concerts) {
            let show_array = await Show.findAll({ where: { concert_id: concert.id }, order: [['start', 'ASC']] });
            show_array = show_array.map(show => ({
                id: show.id,
                start: show.start,
                end: show.end
            }));
    
            let location = await Location.findOne({ where: { id: concert.location_id } });
            let location_json = {
                id: location.id,
                name: location.name
            };
    
            const concert_json = {
                id: concert.id,
                artist: concert.artist,
                location: location_json,
                shows: show_array
            };
    
            concert_array.push(concert_json);
        }
    
        const json = {
            concerts: concert_array
        };
    
        res.json(json)
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = concerts