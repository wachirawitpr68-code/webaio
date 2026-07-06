"use client";

import React, { useEffect, useRef } from 'react';

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let particles: Particle[] = [];
    let relativeTargets: {x: number, y: number}[] = [];
    let activeLocations: {x: number, y: number, vx: number, vy: number}[] = [];
    let fontSize = 100;
    
    // Animation States: 0 = Wandering, 1 = Forming, 2 = Holding, 3 = Breaking
    let currentState = 0;
    let stateTimer = 0;
    let maxParticles = 400; 
    let textOpacity = 0;
    const numWords = 5;

    const getRelativeTargets = () => {
      relativeTargets = [];
      const offscreen = document.createElement('canvas');
      const tw = 400;
      const th = 200;
      offscreen.width = tw;
      offscreen.height = th;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      fontSize = Math.min(width * 0.12, 120); 
      offCtx.fillStyle = 'white';
      offCtx.font = `900 ${fontSize}px "Arial", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      offCtx.fillText('AIO', tw / 2, th / 2);

      const imageData = offCtx.getImageData(0, 0, tw, th).data;
      
      const potentialTargets = [];
      for (let y = 0; y < th; y += 4) {
        for (let x = 0; x < tw; x += 4) {
          const index = (y * tw + x) * 4;
          const alpha = imageData[index + 3];
          if (alpha > 128) {
            potentialTargets.push({ x: x - tw / 2, y: y - th / 2 }); // Center around 0,0
          }
        }
      }
      
      maxParticles = Math.min(Math.floor((width * height) / 4000), 500);
      
      if (potentialTargets.length > 0) {
        // We only need a fraction of targets to form the letters, the rest is handled by particle count
        const particlesPerWord = Math.floor(maxParticles / numWords);
        const step = Math.max(1, Math.floor(potentialTargets.length / particlesPerWord));
        for(let i = 0; i < potentialTargets.length; i += step) {
           relativeTargets.push(potentialTargets[i]);
        }
      }
    };

    const randomizeLocations = () => {
       activeLocations = [];
       for (let i = 0; i < numWords; i++) {
          activeLocations.push({
             x: Math.random() * (width - 300) + 150, // Keep away from edges
             y: Math.random() * (height - 200) + 100,
             vx: (Math.random() - 0.5) * 1.5, // Slow drifting speed
             vy: (Math.random() - 0.5) * 1.5,
          });
       }

       // Assign particles to locations
       particles.forEach((p, idx) => {
          p.locIndex = idx % numWords;
          if (relativeTargets.length > 0) {
              const rt = relativeTargets[idx % relativeTargets.length];
              p.relativeX = rt.x;
              p.relativeY = rt.y;
          }
       });
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      relativeX: number;
      relativeY: number;
      locIndex: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1.5;
        this.relativeX = 0;
        this.relativeY = 0;
        this.locIndex = 0;
        this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.9)' : 'rgba(255, 0, 255, 0.9)';
      }

      update(state: number) {
        if (state === 0 || state === 3) {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0) { this.x = 0; this.vx = -this.vx; }
          if (this.x > width) { this.x = width; this.vx = -this.vx; }
          if (this.y < 0) { this.y = 0; this.vy = -this.vy; }
          if (this.y > height) { this.y = height; this.vy = -this.vy; }
          
        } else if (state === 1 || state === 2) {
          const loc = activeLocations[this.locIndex];
          if (!loc) return;
          const targetX = loc.x + this.relativeX;
          const targetY = loc.y + this.relativeY;
          
          if (state === 1) {
             this.x += (targetX - this.x) * 0.1; // Ease in
             this.y += (targetY - this.y) * 0.1;
          } else {
             // Hold tight but still follow the drifting target
             this.x = targetX + (Math.random() - 0.5) * 1;
             this.y = targetY + (Math.random() - 0.5) * 1;
          }
        }
      }

      draw(state: number) {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    const initParticles = () => {
      getRelativeTargets();
      particles = [];
      for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // State Machine Logic
      stateTimer++;
      if (currentState === 0 && stateTimer > 300) { 
        currentState = 1;
        stateTimer = 0;
        randomizeLocations();
      } else if (currentState === 1 && stateTimer > 120) { 
        currentState = 2;
        stateTimer = 0;
      } else if (currentState === 2 && stateTimer > 240) { // Hold longer (4s)
        currentState = 3;
        stateTimer = 0;
        particles.forEach(p => {
          p.vx = (Math.random() - 0.5) * 15; // Faster explosion
          p.vy = (Math.random() - 0.5) * 15;
        });
      } else if (currentState === 3 && stateTimer > 40) { 
        currentState = 0;
        stateTimer = 0;
        particles.forEach(p => {
           p.vx = (Math.random() - 0.5) * 1.5;
           p.vy = (Math.random() - 0.5) * 1.5;
        });
      }

      // Update drifting locations
      if (currentState === 1 || currentState === 2) {
         activeLocations.forEach(loc => {
            loc.x += loc.vx;
            loc.y += loc.vy;
            // Bounce off invisible margins
            if (loc.x < 100 || loc.x > width - 100) loc.vx *= -1;
            if (loc.y < 100 || loc.y > height - 100) loc.vy *= -1;
         });
      }

      // Handle text hologram opacity
      if (currentState === 1) textOpacity = Math.min(1, textOpacity + 0.02);
      else if (currentState === 2) textOpacity = 1;
      else if (currentState === 3) textOpacity = Math.max(0, textOpacity - 0.05);
      else textOpacity = 0;

      // Draw Holographic Text behind particles
      if (textOpacity > 0 && activeLocations.length > 0) {
        ctx.font = `900 ${fontSize}px "Arial", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 2;
        
        activeLocations.forEach(loc => {
          ctx.shadowBlur = 20;
          ctx.shadowColor = `rgba(0, 243, 255, ${textOpacity})`;
          ctx.fillStyle = `rgba(0, 243, 255, ${textOpacity * 0.1})`; 
          ctx.strokeStyle = `rgba(0, 243, 255, ${textOpacity * 0.8})`;
          
          ctx.fillText('AIO', loc.x, loc.y);
          ctx.strokeText('AIO', loc.x, loc.y);
        });
        ctx.shadowBlur = 0; // reset
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(currentState);
        particles[i].draw(currentState);

        for (let j = i + 1; j < particles.length; j++) {
          // Optimization: only draw connections between particles of the same word when forming
          if ((currentState === 1 || currentState === 2) && particles[i].locIndex !== particles[j].locIndex) {
              continue;
          }

          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let connectDist = currentState === 1 || currentState === 2 ? 25 : 90;

          if (distance < connectDist) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            
            let alpha = 0;
            if (currentState === 1 || currentState === 2) {
                alpha = 0.6 - distance / connectDist;
            } else {
                alpha = 0.4 - distance / connectDist;
            }
                
            ctx.strokeStyle = `rgba(0, 243, 255, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    />
  );
}
