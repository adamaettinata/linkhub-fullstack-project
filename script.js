const userProfile = {
    name: "Faisal Adama",
    bio: "Ordinary Engineer",
    picture: "profile_picture.png"
};

const links = [
    { title: "GitHub", url: "https://github.com/adamaettinata" },
    { title: "LinkedIn", url: "https://www.linkedin.com/in/faisal-adama-971a4a312/" },
    { title: "Twitter / X", url: "https://twitter.com/adamaettinata/" },
    { title: "Website Portofolio", url: "#" }
];

document.querySelector('.profile-picture').src = userProfile.picture;
document.querySelector('h1').textContent = userProfile.name;
document.querySelector('header p').textContent = userProfile.bio;

const linksSection = document.querySelector('.links-section');
links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.textContent = link.title;
    a.target = '_blank';
    a.className = 'link-button';
    linksSection.appendChild(a);
});