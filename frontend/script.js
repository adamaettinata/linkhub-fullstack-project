// File: script.js

// --- (BLOK KODE VANILLA TILT DIHAPUS DARI SINI) ---

// --- Efek Aurora Spotlight Tetap Ada ---
document.addEventListener('mousemove', (e) => {
    document.body.style.setProperty('--x', `${e.clientX}px`);
    document.body.style.setProperty('--y', `${e.clientY}px`);
});

// --- Ambil Data dan Bangun Halaman ---
const userName = "Faisal Adama";
// PASTIKAN URL INI BENAR SESUAI DENGAN DEPLOYMENT RAILWAY ANDA
const apiUrl = `https://linkhub-fullstack-project-production.up.railway.app/api/user/${encodeURIComponent(userName)}`;

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Gagal mengambil data: ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        buildPage(data);
    })
    .catch(error => {
        console.error('Terjadi masalah dengan fetch:', error);
        document.body.innerHTML = `<div class="text-white text-center">
                                     <h2 class="text-2xl font-bold">Oops!</h2>
                                     <p>Gagal memuat data dari server.</p>
                                   </div>`;
    });

function buildPage(data) {
    document.querySelector('#profile-img').src = data.picture;
    document.querySelector('#profile-name').textContent = data.name;
    document.querySelector('#profile-bio').textContent = data.bio;

    const linksSection = document.querySelector('.links-section');
    linksSection.innerHTML = '';
    data.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.className = 'link-button';
        a.textContent = link.title;
        linksSection.appendChild(a);
    });

    // --- Animasi GSAP Tetap Ada ---
    gsap.from('header > *', {
        duration: 1,
        y: 30,
        opacity: 0,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    gsap.from('.link-button', {
        duration: 0.8,
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.5
    });

    gsap.from('footer', {
        duration: 1,
        opacity: 0,
        delay: 1.2
    });
}