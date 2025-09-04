// File: script.js

document.addEventListener('DOMContentLoaded', () => {

    // --- KONFIGURASI ---
    const userName = "Faisal Adama";
    const apiUrl = `https://linkhub-fullstack-project-production.up.railway.app/api/user/${encodeURIComponent(userName)}`;

    // --- ELEMEN DOM ---
    const profileImg = document.querySelector('#profile-img');
    const profileName = document.querySelector('#profile-name');
    const profileBio = document.querySelector('#profile-bio');
    const socialIconsContainer = document.querySelector('#social-icons');
    const linksSection = document.querySelector('#links-section');
    const footerText = document.querySelector('#footer-text');
    const mainContent = document.querySelector('main');

    // --- FUNGSI-FUNGSI ---

    /**
     * Membangun halaman dengan data dari API.
     * @param {object} data - Data user dari API.
     */
    function buildPage(data) {
        // Set info profil
        profileImg.src = data.picture;
        profileName.textContent = data.name;
        profileBio.textContent = data.bio;

        // Set footer dinamis
        const currentYear = new Date().getFullYear();
        footerText.textContent = `© ${currentYear} by ${data.name}. All rights reserved.`;

        // Buat ikon sosial
        if (data.socials && Array.isArray(data.socials)) {
            data.socials.forEach(social => {
                const a = document.createElement('a');
                a.href = social.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'social-icon text-gray-400 hover:text-cyan-400 transition-colors duration-300';
                
                // === PERBAIKAN DI SINI ===
                // Kembali menggunakan `social.name` untuk membuat kelas ikon
                const icon = document.createElement('i');
                icon.classList.add('fab', `fa-${social.name}`); // Contoh: 'fab' dan 'fa-github'
                a.appendChild(icon);
                // === AKHIR PERBAIKAN ===
                
                socialIconsContainer.appendChild(a);
            });
        }

        // Buat tombol link
        if (data.links && Array.isArray(data.links)) {
            data.links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
                a.className = 'link-button';
                a.textContent = link.title;
                linksSection.appendChild(a);
            });
        }
        
        // Jalankan animasi setelah konten dimuat
        runAnimations();
    }

    /**
     * Menjalankan semua animasi intro menggunakan GSAP Timeline.
     */
    function runAnimations() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        tl.to(profileImg, { duration: 1, opacity: 1, scale: 1 })
          .from(profileName, { duration: 0.8, y: 30, opacity: 0 }, "-=0.7")
          .from(profileBio, { duration: 0.8, y: 20, opacity: 0 }, "-=0.6")
          .from('.social-icon', { duration: 0.5, y: 20, opacity: 0, stagger: 0.1 }, "-=0.5")
          .from('.link-button', { duration: 0.5, opacity: 0, y: 20, stagger: 0.1 }, "-=0.3")
          .from(footerText, { duration: 1, opacity: 0 }, "-=0.2");
    }

    /**
     * Menampilkan pesan error jika fetch gagal.
     * @param {Error} error - Objek error.
     */
    function displayError(error) {
        console.error('Terjadi masalah dengan fetch:', error);
        mainContent.innerHTML = `
            <div class="text-white text-center">
                <h2 class="text-2xl font-bold">Oops! Terjadi Kesalahan</h2>
                <p class="mt-2">Gagal memuat data dari server. Silakan coba lagi nanti.</p>
                <p class="text-sm text-gray-400 mt-4">${error.message}</p>
            </div>`;
    }

    /**
     * Mengupdate posisi spotlight effect.
     * @param {MouseEvent} e - Event mouse.
     */
    function updateSpotlight(e) {
        document.body.style.setProperty('--x', `${e.clientX}px`);
        document.body.style.setProperty('--y', `${e.clientY}px`);
    }

    // --- INISIALISASI ---

    // Fetch data dari API
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Gagal mengambil data (Status: ${response.status})`);
            }
            return response.json();
        })
        .then(buildPage)
        .catch(displayError);

    // Tambahkan event listener untuk efek spotlight
    document.addEventListener('mousemove', updateSpotlight);
});