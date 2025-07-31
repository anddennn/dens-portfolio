const openButton = document.getElementById('open-sidebar-button')
const navbar = document.getElementById('navbar')

const media = window.matchMedia('(max-width: 48rem)')

media.addEventListener('change', (e) => updateNavbar(e))

function updateNavbar(e){
    const isMobile = e.matches
    console.log(isMobile);
    if(isMobile){
        navbar.setAttribute('inert', '')
    } else {
        // desktop device
        navbar.removeAttribute('inert')
    }
}

function openSideBar() {
    navbar.classList.add('show')
    openButton.setAttribute('aria-expanded', 'true');
    navbar.removeAttribute('inert')
}

function closeSideBar() {
    navbar.classList.remove('show');
    openButton.setAttribute('aria-expanded','false')
    navbar.setAttribute('inert', '')
}

const navLinks = document.querySelectorAll('nav a')
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (media.matches) {
            closeSideBar();
        }
    });
});

updateNavbar(media)