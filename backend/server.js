//require('dotenv').config(); // Panggil ini paling atas
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js'); // Import Supabase

const app = express();

console.log("--- MEMERIKSA KUNCI RAHASIA (DEBUGGING DETAIL) ---");
const urlValue = process.env.SUPABASE_URL;
const keyValue = process.env.SUPABASE_KEY;

console.log("Tipe data SUPABASE_URL:", typeof urlValue);
console.log("Nilai SUPABASE_URL (20 karakter pertama):", urlValue ? urlValue.substring(0, 20) + '...' : "TIDAK DITEMUKAN / KOSONG");

console.log("Tipe data SUPABASE_KEY:", typeof keyValue);
console.log("Nilai SUPABASE_KEY (10 karakter pertama):", keyValue ? keyValue.substring(0, 10) + '...' : "TIDAK DITEMUKAN / KOSONG");
console.log("-------------------------------------------------");

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
        console.log(`[LOG] Mencari user dengan nama: "${userName}"`);

        // 1. Ambil data profil dari tabel 'profiles'
        // Gunakan .maybeSingle() untuk tes, ini lebih aman dari .single()
        // .maybeSingle() tidak akan error jika ada duplikat, tapi akan mengembalikan baris pertama.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('name', userName)
            .maybeSingle(); // <-- GANTI DARI .single() untuk debugging

        // Jika ada error dari Supabase, log dan kirim respons error
        if (profileError) {
            console.error('[ERROR] Kesalahan saat query profil:', profileError);
            // PostgREST error (misal: tabel tidak ditemukan) akan masuk ke sini
            if (profileError.code === '42P01') {
                 return res.status(500).json({ message: "Kesalahan pada server: Tabel 'profiles' tidak ditemukan. Periksa nama tabel Anda." });
            }
            return res.status(500).json({ message: "Gagal mengambil data profil", error: profileError });
        }
        
        // Jika profil tidak ditemukan sama sekali
        if (!profile) {
            console.log(`[LOG] User dengan nama "${userName}" tidak ditemukan.`);
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        console.log(`[LOG] Profil ditemukan, ID: ${profile.id}. Mengambil links...`);

        // 2. Ambil data link
        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('title, url')
            .eq('profile_id', profile.id);

        if (linksError) {
            console.error('[ERROR] Kesalahan saat query links:', linksError);
            return res.status(500).json({ message: "Gagal mengambil data link", error: linksError });
        }

        console.log(`[LOG] Berhasil mengambil ${links.length} link.`);

        // 3. Gabungkan data dan kirim
        const responseData = {
            ...profile,
            links: links
        };
        res.json(responseData);

    } catch (error) {
        // Menangkap error tak terduga lainnya
        console.error('[FATAL ERROR] Terjadi kesalahan tak terduga pada endpoint:', error);
        res.status(500).json({ message: "Terjadi kesalahan fatal pada server", error: error.message });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server berjalan di port ${PORT}`);
});