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
    let targets: {x: number, y: number}[] = [];
    let locations: {x: number, y: number}[] = [];
    let fontSize = 100;
    
    // Animation States: 0 = Wandering, 1 = Forming, 2 = Holding, 3 = Breaking
    let currentState = 0;
    let stateTimer = 0;
    let maxParticles = 400; // More particles for better shape
    let textOpacity = 0;

    const getTextTargets = () => {
      targets = [];
      const offscreen = document.createElement('canvas');
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext('2d');
      if (!offCtx) return;

      fontSize = Math.min(width * 0.15, 180); 
      offCtx.fillStyle = 'white';
      offCtx.font = `900 ${fontSize}px "Arial", sans-serif`;
      offCtx.textAlign = 'center';
      offCtx.textBaseline = 'middle';
      
      // Draw AIO in multiple locations
      locations = [
        { x: width * 0.2, y: height * 0.25 },
        { x: width * 0.8, y: height * 0.25 },
        { x: width * 0.2, y: height * 0.75 },
        { x: width * 0.8, y: height * 0.75 },
        { x: width * 0.5, y: height * 0.5 } // Center
      ];

      locations.forEach(loc => {
        offCtx.fillText('AIO', loc.x, loc.y);
      });

      const imageData = offCtx.getImageData(0, 0, width, height).data;
      
      const potentialTargets = [];
      for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
          const index = (y * width + x) * 4;
          const alpha = imageData[index + 3];
          if (alpha > 128) {
            potentialTargets.push({ x, y });
          }
        }
      }
      
      maxParticles = Math.min(Math.floor((width * height) / 4000), 500);
      
      if (potentialTargets.length > 0) {
        const step = Math.max(1, Math.floor(potentialTargets.length / maxParticles));
        for(let i = 0; i < potentialTargets.length; i += step) {
           targets.push(potentialTargets[i]);
           if (targets.length >= maxParticles) break;
        }
      }
    };

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      targetX: number;
      targetY: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.radius = Math.random() * 2 + 1.5;
        this.targetX = this.x;
        this.targetY = this.y;
        this.color = Math.random() > 0.5 ? 'rgba(0, 243, 255, 0.9)' : 'rgba(255, 0, 255, 0.9)';
      }

      assignTarget(target: {x: number, y: number}) {
        this.targetX = target.x;
        this.targetY = target.y;
      }

      update(state: number) {
        if (state === 0 || state === 3) {
          this.x += this.vx;
          this.y += this.vy;

          if (this.x < 0) { this.x = 0; this.vx = -this.vx; }
          if (this.x > width) { this.x = width; this.vx = -this.vx; }
          if (this.y < 0) { this.y = 0; this.vy = -this.vy; }
          if (this.y > height) { this.y = height; this.vy = -this.vy; }
          
        } else if (state === 1) {
          const dx = this.targetX - this.x;
          const dy = this.targetY - this.y;
          this.x += dx * 0.1; // Move faster to target
          this.y += dy * 0.1;
        } else if (state === 2) {
          this.x = this.targetX + (Math.random() - 0.5) * 1;
          this.y = this.targetY + (Math.random() - 0.5) * 1;
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
      getTextTargets();
      particles = [];
      const count = targets.length > 0 ? targets.length : maxParticles; 
      
      for (let i = 0; i < count; i++) {
        const p = new Particle();
        if (targets.length > 0) {
          p.assignTarget(targets[i]);
        }
        particles.push(p);
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
      } else if (currentState === 1 && stateTimer > 120) { 
        currentState = 2;
        stateTimer = 0;
      } else if (currentState === 2 && stateTimer > 180) { 
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

      // Handle text hologram opacity
      if (currentState === 1) textOpacity = Math.min(1, textOpacity + 0.02);
      else if (currentState === 2) textOpacity = 1;
      else if (currentState === 3) textOpacity = Math.max(0, textOpacity - 0.05);
      else textOpacity = 0;

      // Draw Holographic Text behind particles
      if (textOpacity > 0 && locations.length > 0) {
        ctx.font = `900 ${fontSize}px "Arial", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineWidth = 2;
        
        locations.forEach(loc => {
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
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          let connectDist = currentState === 1 || currentState === 2 ? 20 : 90;

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
