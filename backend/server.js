//require('dotenv').config(); // Panggil ini paling atas
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // Import Supabase

const app = express();

console.log("--- MEMERIKSA KUNCI RAHASIA ---");
console.log("SUPABASE_URL yang diterima:", process.env.SUPABASE_URL ? "ADA" : "TIDAK ADA / KOSONG");
console.log("SUPABASE_KEY yang diterima:", process.env.SUPABASE_KEY ? "ADA" : "TIDAK ADA / KOSONG");
console.log("---------------------------------");

const PORT = process.env.PORT || 3000;

// --- KONEKSI SUPABASE ---
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(cors());

// --- API ENDPOINTS ---
app.get('/', (req, res) => {
    res.send('<h1>Selamat datang di API LinkHub dengan Supabase!</h1>');
});

// Ubah endpoint untuk mengambil data dari Supabase
app.get('/api/user/:name', async (req, res) => {
    try {
        const userName = req.params.name;

        // 1. Ambil data profil dari tabel 'profiles'
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('name', userName)
            .single(); // .single() untuk mengambil satu baris saja

        if (profileError || !profile) {
            return res.status(404).json({ message: "User tidak ditemukan", error: profileError });
        }

        // 2. Ambil data link yang berhubungan dengan profil tersebut
        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('title, url')
            .eq('profile_id', profile.id);

        if (linksError) {
            return res.status(500).json({ message: "Gagal mengambil data link", error: linksError });
        }

        // 3. Gabungkan data dan kirim sebagai respons
        const responseData = {
            ...profile,
            links: links
        };

        res.json(responseData);

    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});