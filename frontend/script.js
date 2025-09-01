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
    document.querySelector('#profile-img').src = data.picture;
    document.querySelector('h1').textContent = data.name;
    document.querySelector('header p').textContent = data.bio;

    const linksSection = document.querySelector('.links-section');
    linksSection.innerHTML = ''; 

    data.links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.textContent = link.title;
        a.target = '_blank';
        a.className = 'block bg-gray-700 p-4 rounded-lg font-bold transition-transform duration-200 hover:scale-105 hover:bg-blue-600';
        linksSection.appendChild(a);
    });
}