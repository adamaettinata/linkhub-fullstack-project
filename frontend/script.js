const userName = "Faisal Adama";
const apiUrl = `http://localhost:3000/api/user/${encodeURIComponent(userName)}`;

fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data diterima dari backend:', data); 
        buildPage(data);
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
        document.body.innerHTML = '<p>Gagal memuat data. Pastikan server backend berjalan.</p>';
    });

function buildPage(data) {
    // Menggunakan selector ID yang lebih spesifik dan aman
    document.querySelector('#profile-img').src = data.picture;
    document.querySelector('#profile-name').textContent = data.name;
    document.querySelector('#profile-bio').textContent = data.bio;

    const linksSection = document.querySelector('.links-section');
    linksSection.innerHTML = ''; 

    const iconMap = {
        'GitHub': 'github',
        'LinkedIn': 'linkedin',
        'Twitter / X': 'twitter',
        'Website Portofolio': 'globe'
    };

    // HANYA SATU BLOK forEach ini yang dibutuhkan
    data.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.className = 'flex items-center justify-center gap-3 bg-secondary p-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20';

        const iconName = iconMap[link.title] || 'link-2';
        const iconEl = document.createElement('i');
        iconEl.setAttribute('data-lucide', iconName);
        
        const textEl = document.createElement('span');
        textEl.textContent = link.title;

        a.appendChild(iconEl);
        a.appendChild(textEl);
        linksSection.appendChild(a);
    });

    // Panggil fungsi createIcons() dari Lucide setelah semua elemen ditambahkan ke DOM
    lucide.createIcons();
}