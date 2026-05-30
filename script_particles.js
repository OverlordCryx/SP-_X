document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    document.getElementById('particle-canvas').appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    // Więcej cząsteczek dla bogatszego efektu!
    const particleCount = window.innerWidth < 600 ? 60 : 130;

    // Pozycja myszki do interakcji
    let mouse = { x: null, y: null, radius: 150 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            // Zwiększona prędkość, żeby było "cooler"
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2 + 0.5;
            this.baseAlpha = Math.random() * 0.5 + 0.1;
            this.pulse = Math.random() * 0.02;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            this.baseAlpha += this.pulse;
            if(this.baseAlpha > 0.8 || this.baseAlpha < 0.1) this.pulse = -this.pulse;

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;

            // Cząsteczki uciekają przed kursorem myszki (Pole Siłowe)
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= forceDirectionX * force * 3;
                    this.y -= forceDirectionY * force * 3;
                }
            }
        }
        draw() {
            // Główny kolor: #3100FF -> RGB(49, 0, 255)
            ctx.fillStyle = `rgba(49, 0, 255, ${this.baseAlpha})`;
            
            // Efekt mocnego neonowego glow (światła) wokół kulek
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#3100FF';

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        // Zwykłe czyszczenie klatki jest 100x szybsze i nie spowalnia przeglądarki
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }

        requestAnimationFrame(animate);
    }

    animate();
});
