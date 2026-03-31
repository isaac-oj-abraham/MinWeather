export default async function handler(req, res) {
    const city = req.query.city;
    const apikey = process.env.OWM_API_KEY;

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=imperial`;

    try {
        const response = await fetch(url); // grabs raw HTTP data (visualize an envelope)
        const data = await response.json(); // opens 'envelope' and reads inside
        res.status(200).json(data); // this just means everything went fine
    }
    catch (err){
        res.status(500).json({ error: "failed to fetch weather"});
    }

}