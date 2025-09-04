const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('<h1>API LinkHub Aktif</h1>');
});

app.get('/api/user/:name', async (req, res) => {
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_KEY;
        
        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Konfigurasi Supabase tidak ditemukan di server.");
        }
        
        const supabase = createClient(supabaseUrl, supabaseKey);
        const userName = req.params.name;

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('name', userName)
            .maybeSingle();

        if (profileError) throw profileError;
        if (!profile) return res.status(404).json({ message: "User tidak ditemukan" });

        const { data: links, error: linksError } = await supabase
            .from('links')
            .select('title, url')
            .eq('profile_id', profile.id);

        if (linksError) throw linksError;

        res.json({ ...profile, links: links });

    } catch (error) {
        console.error('[SERVER ERROR]', error);
        res.status(500).json({ message: error.message || "Terjadi kesalahan pada server." });
    }
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server berjalan di http://0.0.0.0:${PORT}`);
});