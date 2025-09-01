const userName = "Faisal Adama";
const apiUrl = `https://linkhub-fullstack-project-production.up.railway.app/api/user/${encodeURIComponent(userName)}`;

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

    // Versi sederhana TANPA ikon
    data.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        // Class yang disederhanakan untuk tombol tanpa ikon
        a.className = 'block w-full bg-secondary p-4 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/20';
        // Langsung isi teksnya
        a.textContent = link.title;

        linksSection.appendChild(a);
    });
}