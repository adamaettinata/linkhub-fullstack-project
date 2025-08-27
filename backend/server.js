const express = require('express');
const cors = require('cors');

const app = express();

const PORT = 3000;

app.use(cors());

const userData = {
    name: "Faisal Adama",
    bio: "Ordinary Engineer",
    picture: "profile_picture.png", 
    links: [
        { title: "GitHub", url: "https://github.com/adamaettinata" },
        { title: "LinkedIn", url: "https://www.linkedin.com/in/faisal-adama-971a4a312/" },
        { title: "Twitter / X", url: "https://twitter.com/adamaettinata/" },
        { title: "Website Portofolio", url: "#" }
    ]
};


app.get('/api/user', (req, res) => {
    res.json(userData);
});

app.get('/', (req, res) => {
    res.send('<h1>Selamat datang di API untuk LinkHub!</h1><p>Coba akses <a href="/api/user">/api/user</a> untuk melihat data.</p>');
});

app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});