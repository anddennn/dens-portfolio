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

//////////////////////////////////////////////

const dog = document.getElementById('dog');
const dogImg = dog.querySelector('img') || dog;

let pos = { x: 100, y: window.innerHeight - 120 }; // 120 = approx dog height, adjust as needed
let velocity = { x: 2, y: 0 };
let isDragging = false;
let dragStart = { x: 0, y: 0 };
let last = { x: 0, y: 0, time: 0 };
let throwVelocity = { x: 0, y: 0 };

const bounds = {
  width: window.innerWidth,
  height: window.innerHeight
};

const gravity = 0.7; // px/frame^2
const bounce = 0.7;  // energy loss on bounce

dog.style.position = 'fixed';
dog.style.left = `${pos.x}px`;
dog.style.top = `${pos.y}px`;

function updatePosition() {
  if (!isDragging) {
    velocity.y += gravity;
    pos.x += velocity.x;
    pos.y += velocity.y;

    const rect = dog.getBoundingClientRect();

    // Bounce off left/right
    if (pos.x <= 0) {
      pos.x = 0;
      velocity.x *= -1;
    } else if (pos.x + rect.width >= bounds.width) {
      pos.x = bounds.width - rect.width;
      velocity.x *= -1;
    }

    // Bounce off floor/ceiling
    if (pos.y + rect.height >= bounds.height) {
      pos.y = bounds.height - rect.height;
      velocity.y *= -bounce;
      // Stop tiny bounces
      if (Math.abs(velocity.y) < 2) velocity.y = 0;
    } else if (pos.y <= 0) {
      pos.y = 0;
      velocity.y *= -bounce;
    }

    // Flip dog image (reverse direction)
    dogImg.style.transform = velocity.x > 0 ? 'scaleX(-1)' : 'scaleX(1)';
    dog.style.left = `${pos.x}px`;
    dog.style.top = `${pos.y}px`;
  }
  requestAnimationFrame(updatePosition);
}

// DRAG START
dog.addEventListener('mousedown', (e) => {
  isDragging = true;
  dragStart.x = e.clientX - pos.x;
  dragStart.y = e.clientY - pos.y;
  last.x = e.clientX;
  last.y = e.clientY;
  last.time = Date.now();
  throwVelocity = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };
  document.body.style.userSelect = 'none';
});

// DRAG MOVE
window.addEventListener('mousemove', (e) => {
  if (!isDragging) return;

  const now = Date.now();
  const newX = e.clientX - dragStart.x;
  const newY = e.clientY - dragStart.y;

  const dt = now - last.time || 16;
  throwVelocity.x = (e.clientX - last.x) / dt * 16;
  throwVelocity.y = (e.clientY - last.y) / dt * 16;

  last.x = e.clientX;
  last.y = e.clientY;
  last.time = now;

  const rect = dog.getBoundingClientRect();
  pos.x = Math.max(0, Math.min(newX, bounds.width - rect.width));
  pos.y = Math.max(0, Math.min(newY, bounds.height - rect.height));
  dog.style.left = `${pos.x}px`;
  dog.style.top = `${pos.y}px`;
});

// DRAG END
window.addEventListener('mouseup', () => {
  if (!isDragging) return;
  isDragging = false;

  // Apply captured throw velocity
  velocity.x = throwVelocity.x || 2;
  velocity.y = throwVelocity.y || 0;

  document.body.style.userSelect = '';
});


// Update bounds on resize
window.addEventListener('resize', () => {
  bounds.width = window.innerWidth;
  bounds.height = window.innerHeight;
});

updatePosition();


window.addEventListener('mousedown', () => console.log('MOUSEDOWN'));
window.addEventListener('mousemove', () => console.log('MOUSEMOVE'));
window.addEventListener('mouseup', () => console.log('MOUSEUP'));

console.log('Dragging:', pos.x, pos.y);