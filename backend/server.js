const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// --- ENDPOINT UNTUK TES KESEHATAN SERVER ---
app.get('/', (req, res) => {
    res.send('<h1>Server berjalan. Endpoint Supabase ada di /api/user/:name</h1>');
});

// --- ENDPOINT ASLI DENGAN INISIALISASI DI DALAM ---
app.get('/api/user/:name', async (req, res) => {
    try {
        console.log('[LOG] Endpoint dipanggil. Mencoba membuat Supabase client...');
        
        // INISIALISASI DIPINDAHKAN KE SINI!
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;

        // Validasi sederhana sebelum membuat client
        if (!supabaseUrl || !supabaseKey) {
            console.error('[FATAL ERROR] SUPABASE_URL atau SUPABASE_KEY tidak ada saat endpoint dipanggil!');
            return res.status(500).json({ message: "Konfigurasi server error." });
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log('[LOG] Supabase client berhasil dibuat.');

        const userName = req.params.name;
        console.log(`[LOG] Mencari user dengan nama: "${userName}"`);

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('name', userName)
            .maybeSingle();

        if (profileError) {
            console.error('[ERROR] Kesalahan saat query profil:', profileError);
            return res.status(500).json({ message: "Gagal mengambil data profil", error: profileError });
        }
        
        if (!profile) {
            console.log(`[LOG] User dengan nama "${userName}" tidak ditemukan.`);
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        console.log(`[LOG] Profil ditemukan, ID: ${profile.id}. Mengambil links...`);

        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('title, url')
            .eq('profile_id', profile.id);

        if (linksError) {
            console.error('[ERROR] Kesalahan saat query links:', linksError);
            return res.status(500).json({ message: "Gagal mengambil data link", error: linksError });
        }

        const responseData = { ...profile, links: links };
        res.json(responseData);

    } catch (error) {
        console.error('[FATAL ERROR] Terjadi kesalahan tak terduga pada endpoint:', error);
        res.status(500).json({ message: "Terjadi kesalahan fatal pada server", error: error.message });
    }
});

// --- SERVER LISTENER & PENANGKAP ERROR GLOBAL ---
const server = app.listen(PORT, '0.0.0.0', () => {
    const addressInfo = server.address();
    console.log(`🚀 Server berjalan stabil di port ${PORT}, alamat ${addressInfo.address}`);
    console.log('Menunggu panggilan ke endpoint untuk menginisialisasi Supabase...');
});

process.on('uncaughtException', (error, origin) => {
    console.error('💥 UNCAUGHT EXCEPTION:', error, origin);
    process.exit(1);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 UNHANDLED REJECTION:', reason);
});