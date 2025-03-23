let map;
let userLocation;

// Initialize Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById("map-area"), {
        center: { lat: -34.397, lng: 150.644 }, // Default center
        zoom: 12,
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                map.setCenter(userLocation);
                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "You are here",
                });
            },
            () => {
                alert("Unable to retrieve your location.");
            }
        );
    } else {
        alert("Geolocation is not supported by your browser.");
    }
}

// Tab Navigation
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`.tab[onclick="showTab('${tabId}')"]`).classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`.nav-item[onclick="showTab('${tabId}')"]`).classList.add('active');

    // Re-initialize map when Map tab is selected
    if (tabId === 'map' && !map) {
        initMap();
    }
}

// User Dropdown
document.addEventListener("DOMContentLoaded", function () {
    const userMenu = document.getElementById("userMenu");
    userMenu.addEventListener("click", function (event) {
        event.stopPropagation();
        userMenu.classList.toggle("active");
    });
    document.addEventListener("click", function (event) {
        if (!userMenu.contains(event.target)) {
            userMenu.classList.remove("active");
        }
    });

    // Hospitals Button Functionality
    document.getElementById("hospitals-btn").addEventListener("click", () => {
        if (!userLocation) {
            alert("Please allow location access to find nearby hospitals.");
            return;
        }

        const request = {
            location: userLocation,
            radius: 5000, // 5km radius
            type: "hospital",
        };

        const service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
                results.forEach((place) => {
                    new google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                        title: place.name,
                        icon: {
                            url: "http://maps.google.com/mapfiles/ms/icons/hospital.png",
                        },
                    });
                });
                const bounds = new google.maps.LatLngBounds();
                results.forEach((place) => bounds.extend(place.geometry.location));
                map.fitBounds(bounds);
            } else {
                alert("No hospitals found nearby.");
            }
        });
    });

    // Carousel Functionality
    const track = document.querySelector('.carousel-track');
    const items = document.querySelectorAll('.carousel-item');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const progressBar = document.getElementById('progressBar');
    let currentIndex = 0;
    let interval;
    let animationPaused = false;
    let progressWidth = 0;
    let progressInterval;

    function showSlide(index) {
        track.style.transform = `translateX(-${index * 20}%)`;
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
        resetProgressBar();
    }

    function startAutoSlide() {
        interval = setInterval(() => {
            if (!animationPaused) {
                let nextIndex = (currentIndex + 1) % items.length;
                showSlide(nextIndex);
            }
        }, 5000);
        startProgressBar();
    }

    function startProgressBar() {
        progressWidth = 0;
        progressBar.style.width = '0%';
        progressInterval = setInterval(() => {
            if (!animationPaused) {
                progressWidth += 0.02;
                progressBar.style.width = `${progressWidth}%`;
            }
        }, 1);
    }

    function resetProgressBar() {
        clearInterval(progressInterval);
        progressWidth = 0;
        progressBar.style.width = '0%';
        startProgressBar();
    }

    function stopAutoSlide() {
        clearInterval(interval);
        clearInterval(progressInterval);
    }

    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    prevBtn.addEventListener('click', function() {
        let prevIndex = (currentIndex - 1 + items.length) % items.length;
        showSlide(prevIndex);
        stopAutoSlide();
        startAutoSlide();
    });

    nextBtn.addEventListener('click', function() {
        let nextIndex = (currentIndex + 1) % items.length;
        showSlide(nextIndex);
        stopAutoSlide();
        startAutoSlide();
    });

    const carouselContainer = document.querySelector('.carousel-container');
    carouselContainer.addEventListener('mouseenter', () => animationPaused = true);
    carouselContainer.addEventListener('mouseleave', () => animationPaused = false);

    startAutoSlide();
});
document.addEventListener('DOMContentLoaded', () => {
    // Update Year
    document.getElementById('year').textContent = new Date().getFullYear();

    // Subscribe Form
    const subscribeForm = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');
    const subscribeBtn = document.getElementById('subscribeBtn');
    const message = document.getElementById('subscribeMessage');

    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = emailInput.value.trim();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            showMessage('Invalid email address', 'error');
            return;
        }

        subscribeBtn.disabled = true;
        subscribeBtn.textContent = 'Sending...';
        subscribeBtn.style.background = 'rgba(155, 93, 229, 0.5)';

        // Simulate API call
        setTimeout(() => {
            showMessage('Subscribed! Welcome aboard!', 'success');
            subscribeForm.reset();
            subscribeBtn.disabled = false;
            subscribeBtn.textContent = 'Sign Up';
            subscribeBtn.style.background = 'var(--neon-purple)';
        }, 2000);
    });

    function showMessage(text, type) {
        message.textContent = text;
        message.className = 'message'; // Reset classes
        message.classList.add('show', type);
        setTimeout(() => {
            message.classList.remove('show');
        }, 3000);
    }

    // Social Buttons Animation
    const socialBtns = document.querySelectorAll('.social-btn');
    socialBtns.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.animation = 'pulseGlow 1s infinite';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.animation = 'none';
        });
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const platform = btn.dataset.tooltip;
            // Simulate navigation (replace with actual links)
            console.log(`Navigating to ${platform}`);
        });
    });

    // Dynamic Neon Effect on Links
    const glowLinks = document.querySelectorAll('.glow-link');
    glowLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left;
            link.style.background = `radial-gradient(circle at ${x}px 50%, rgba(155, 93, 229, 0.2), transparent 50%)`;
        });
        link.addEventListener('mouseleave', () => {
            link.style.background = 'none';
        });
    });
});

// Add dynamic styles
const style = document.createElement('style');
style.textContent = `
    @keyframes pulseGlow {
        0% { box-shadow: 0 0 5px var(--neon-purple); }
        50% { box-shadow: 0 0 15px var(--neon-purple), 0 0 25px var(--neon-pink); }
        100% { box-shadow: 0 0 5px var(--neon-purple); }
    }
`;
document.head.appendChild(style);