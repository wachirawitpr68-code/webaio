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
    let maxParticles = 600; 
    let textOpacity = 0;
    const numWords = 7;

    const getRelativeTargets = () => {
      relativeTargets = [];
      const offscreen = document.createElement('canvas');
      const tw = 400;
      const th = 200;
      offscreen.width = tw;
      offscreen.height = th;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      fontSize = Math.min(width * 0.12, 100); 
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
            potentialTargets.push({ x: x - tw / 2, y: y - th / 2 });
          }
        }
      }
      
      // Ensure we have enough particles for 7 words to be clearly visible
      maxParticles = Math.max(500, Math.min(Math.floor((width * height) / 2000), 700));
      
      if (potentialTargets.length > 0) {
        const particlesPerWord = Math.floor(maxParticles / numWords);
        const step = Math.max(1, Math.floor(potentialTargets.length / particlesPerWord));
        for(let i = 0; i < potentialTargets.length; i += step) {
           relativeTargets.push(potentialTargets[i]);
        }
      }
    };

    const randomizeLocations = () => {
       activeLocations = [];
       // Divide screen into a 3x3 grid to guarantee spread and prevent overlapping
       const cols = 3;
       const rows = 3;
       const cellW = width / cols;
       const cellH = height / rows;
       
       let cells: {r: number, c: number}[] = [];
       for(let r = 0; r < rows; r++) {
           for(let c = 0; c < cols; c++) {
               // Don't spawn in the very top-center or bottom-center if we can avoid it to keep it spread
               cells.push({r, c});
           }
       }
       
       // Shuffle the grid cells
       cells.sort(() => Math.random() - 0.5);
       
       for (let i = 0; i < numWords; i++) {
          const cell = cells[i % cells.length];
          const cx = cell.c * cellW + cellW / 2;
          const cy = cell.r * cellH + cellH / 2;
          
          activeLocations.push({
             x: cx + (Math.random() - 0.5) * (cellW * 0.4),
             y: cy + (Math.random() - 0.5) * (cellH * 0.4),
             vx: (Math.random() - 0.5) * 1.5,
             vy: (Math.random() - 0.5) * 1.5,
          });
       }

       const particlesPerWord = Math.floor(particles.length / numWords);
       particles.forEach((p, idx) => {
          p.locIndex = Math.min(Math.floor(idx / particlesPerWord), numWords - 1);
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
             this.x += (targetX - this.x) * 0.12; 
             this.y += (targetY - this.y) * 0.12;
          } else {
             this.x = targetX + (Math.random() - 0.5) * 1;
             this.y = targetY + (Math.random() - 0.5) * 1;
          }
        }
      }

      draw() {
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

      stateTimer++;
      if (currentState === 0 && stateTimer > 300) { 
        currentState = 1;
        stateTimer = 0;
        randomizeLocations();
      } else if (currentState === 1 && stateTimer > 120) { 
        currentState = 2;
        stateTimer = 0;
      } else if (currentState === 2 && stateTimer > 240) { 
        currentState = 3;
        stateTimer = 0;
        particles.forEach(p => {
          p.vx = (Math.random() - 0.5) * 15; 
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

      if (currentState === 1 || currentState === 2) {
         activeLocations.forEach(loc => {
            loc.x += loc.vx;
            loc.y += loc.vy;
            if (loc.x < 100 || loc.x > width - 100) loc.vx *= -1;
            if (loc.y < 100 || loc.y > height - 100) loc.vy *= -1;
         });
      }

      if (currentState === 1) textOpacity = Math.min(1, textOpacity + 0.02);
      else if (currentState === 2) textOpacity = 1;
      else if (currentState === 3) textOpacity = Math.max(0, textOpacity - 0.05);
      else textOpacity = 0;

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
        ctx.shadowBlur = 0; 
      }

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(currentState);
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
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
