'use client';

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================
  // АНИМАЦИЯ СФЕРЫ ДЛЯ ПЕРВОГО ЭКРАНА
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width: number, height: number;
    let lines: any[] = [];
    let isMobile = false;
    let animationFrameId: number;
    
    const config = {
      sphereColor: '139, 253, 168', // Фирменный зеленый цвет #8BFDA8
      lineCount: window.innerWidth < 768 ? 300 : 800,
      sphereRadius: window.innerWidth < 768 ? 480 : 650,
      mouseInfluence: 0.0015,
      autoRotateSpeed: window.innerWidth < 768 ? 0.003 : 0.002,
      centerX: 0,
      centerY: 0
    };

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight; 
    
    let targetRotX = 0;
    let targetRotY = 0;
    let rotX = 0;
    let rotY = 0;
    let time = 0;
    
    let introTime = 0; 
    let introProgress = 0;

    function resize() {
      isMobile = window.innerWidth < 768; 
      width = canvas!.width = window.innerWidth;
      // Делаем высоту канваса больше экрана, чтобы сфера плавно уходила вниз
      height = canvas!.height = window.innerHeight * 1.5; 
      config.centerX = width / 2;
      
      if (isMobile) {
          config.centerY = (height / 2) - (window.innerHeight * 0.15);
          mouseX = config.centerX;
          mouseY = config.centerY;
      } else {
          config.centerY = window.innerHeight / 2; // Центрируем по первому экрану
      }
    }

    class Line {
      alpha: number;
      hasDot: boolean;
      localProgress: number;
      flash: number;
      theta!: number;
      phi!: number;
      length!: number;
      origX!: number;
      origY!: number;
      origZ!: number;

      constructor() {
          this.initGeometry();
          // Сделали линии немного прозрачнее (было 0.3-1.0, стало 0.1-0.6)
          this.alpha = Math.random() * 0.5 + 0.1; 
          this.hasDot = Math.random() > 0.3;      
          
          this.localProgress = 1; 
          this.flash = 0; 
      }
      
      initGeometry() {
          this.theta = Math.random() * Math.PI * 2; 
          this.phi = Math.acos((Math.random() * 2) - 1); 
          this.length = config.sphereRadius * (0.2 + 0.8 * Math.sqrt(Math.random()));
          this.origX = this.length * Math.sin(this.phi) * Math.cos(this.theta);
          this.origY = this.length * Math.sin(this.phi) * Math.sin(this.theta);
          this.origZ = this.length * Math.cos(this.phi);
      }

      respawn() {
          this.initGeometry();
          this.localProgress = 0; 
          this.flash = 1.0; 
      }
      
      draw(rx: number, ry: number, globalProgress: number) {
          let currentProgress = (globalProgress < 1) ? globalProgress : this.localProgress;

          if (globalProgress >= 1 && this.localProgress < 1) {
              this.localProgress += 0.04; 
              if (this.localProgress > 1) this.localProgress = 1;
          }

          if (this.flash > 0 && this.localProgress >= 1) {
              this.flash -= 0.005; 
              if (this.flash < 0) this.flash = 0;
          }

          let curX = this.origX * currentProgress;
          let curY = this.origY * currentProgress;
          let curZ = this.origZ * currentProgress;

          let tempX = curX * Math.cos(ry) - curZ * Math.sin(ry);
          let tempZ = curX * Math.sin(ry) + curZ * Math.cos(ry);
          
          let finalY = curY * Math.cos(rx) - tempZ * Math.sin(rx);
          let finalZ = curY * Math.sin(rx) + tempZ * Math.cos(rx);
          let finalX = tempX;
          
          const perspective = 800 / (800 - finalZ);
          const screenX = config.centerX + (finalX * perspective);
          const screenY = config.centerY + (finalY * perspective);
          
          const zAlpha = (finalZ + config.sphereRadius) / (config.sphereRadius * 2);
          const fadeAlpha = Math.min(1, currentProgress * 1.5); 
          const drawAlpha = this.alpha * zAlpha * fadeAlpha;

          if (drawAlpha <= 0) return; 
          
          ctx!.beginPath();
          ctx!.moveTo(config.centerX, config.centerY);
          ctx!.lineTo(screenX, screenY);
          
          let grad = ctx!.createLinearGradient(config.centerX, config.centerY, screenX, screenY);
          grad.addColorStop(0, `rgba(${config.sphereColor}, 0)`);
          grad.addColorStop(1, `rgba(${config.sphereColor}, ${drawAlpha * 0.8})`);
          
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 0.6 * perspective; 
          ctx!.stroke();

          if (this.flash > 0) {
              ctx!.beginPath();
              ctx!.moveTo(config.centerX, config.centerY);
              ctx!.lineTo(screenX, screenY);
              
              let flashGrad = ctx!.createLinearGradient(config.centerX, config.centerY, screenX, screenY);
              flashGrad.addColorStop(0, `rgba(255, 255, 255, 0)`);
              flashGrad.addColorStop(1, `rgba(255, 255, 255, ${this.flash * drawAlpha})`);
              
              ctx!.strokeStyle = flashGrad;
              ctx!.lineWidth = (0.6 + this.flash * 2.0) * perspective; 
              ctx!.stroke();
          }
          
          if (this.hasDot) {
              ctx!.beginPath();
              ctx!.arc(screenX, screenY, 1.2 * perspective, 0, Math.PI * 2); 
              ctx!.fillStyle = `rgba(${config.sphereColor}, ${drawAlpha})`;
              ctx!.fill();

              if (this.flash > 0) {
                  ctx!.beginPath();
                  ctx!.arc(screenX, screenY, (1.2 + this.flash * 1.5) * perspective, 0, Math.PI * 2); 
                  ctx!.fillStyle = `rgba(255, 255, 255, ${this.flash * drawAlpha})`;
                  ctx!.fill();
              }
          }
      }
    }

    function initCanvas() {
        resize();
        lines = [];
        introTime = 0; 
        introProgress = 0; 
        for (let i = 0; i < config.lineCount; i++) {
            lines.push(new Line());
        }
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (isMobile) return; 
        mouseX = e.pageX;
        mouseY = e.pageY;
    };

    const handleResize = () => {
        resize();
        if (Math.abs(width - window.innerWidth) > 50) initCanvas();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    function animate() {
        ctx!.clearRect(0, 0, width, height);
        
        if (introTime < 1) {
            introTime += 0.008; 
            introProgress = 1 - Math.pow(1 - introTime, 4);
        } else {
            introProgress = 1;

            if (Math.random() < 0.025) {
                const randomIndex = Math.floor(Math.random() * lines.length);
                lines[randomIndex].respawn();
            }
        }

        const glowRadius = config.sphereRadius * 1.4; 
        const currentGlowRadius = glowRadius * (0.3 + 0.7 * introProgress); 
        
        const coreGlow = ctx!.createRadialGradient(
            config.centerX, config.centerY, 0,
            config.centerX, config.centerY, currentGlowRadius
        );
        
        coreGlow.addColorStop(0, `rgba(${config.sphereColor}, 0.15)`);  
        coreGlow.addColorStop(0.4, `rgba(${config.sphereColor}, 0.05)`); 
        coreGlow.addColorStop(1, `rgba(${config.sphereColor}, 0)`);    

        ctx!.beginPath();
        ctx!.arc(config.centerX, config.centerY, currentGlowRadius, 0, Math.PI * 2);
        ctx!.fillStyle = coreGlow;
        ctx!.fill();
        
        time += config.autoRotateSpeed;
        
        targetRotY = (mouseX - config.centerX) * config.mouseInfluence;
        targetRotX = (mouseY - config.centerY) * (config.mouseInfluence * 0.5) - 0.5; 

        rotX += (targetRotX - rotX) * 0.05;
        rotY += (targetRotY - rotY) * 0.05;
        
        const finalRotY = rotY + time;

        lines.forEach(line => line.draw(rotX, finalRotY, introProgress));

        animationFrameId = requestAnimationFrame(animate);
    }

    initCanvas();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#8BFDA8] selection:text-black relative">
      
      {/* CANVAS BACKGROUND (ТОЛЬКО ЧЕРНЫЙ ФОН И СФЕРА) */}
      <canvas 
        ref={canvasRef} 
        className="absolute top-0 left-0 w-full z-0 pointer-events-none"
        style={{ 
          height: '150vh', 
          background: 'radial-gradient(circle at 50% 50%, #060b17 0%, #000000 60%)' 
        }}
      />

      {/* КЛЮЧЕВЫЕ АНИМАЦИИ */}
      <style dangerouslySetInnerHTML={{__html: `
        /* 1. Чат */
        .anim-msg-user { animation: chatUser 10s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom right; }
        .anim-typing { animation: chatTyping 10s infinite; transform-origin: bottom left; }
        .anim-msg-ai { animation: chatAi 10s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: bottom left; }
        .dot-1 { animation: dotBlink 1.4s infinite ease-in-out both; animation-delay: -0.32s; }
        .dot-2 { animation: dotBlink 1.4s infinite ease-in-out both; animation-delay: -0.16s; }
        .dot-3 { animation: dotBlink 1.4s infinite ease-in-out both; }

        @keyframes chatUser {
          0%, 5% { opacity: 0; transform: scale(0.8) translate(10px, 10px); }
          10%, 85% { opacity: 1; transform: scale(1) translate(0, 0); }
          90%, 100% { opacity: 0; transform: scale(0.9) translateY(10px); }
        }
        @keyframes chatTyping {
          0%, 15% { opacity: 0; transform: scale(0.8); }
          20%, 35% { opacity: 1; transform: scale(1); }
          40%, 100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes chatAi {
          0%, 40% { opacity: 0; transform: scale(0.8) translate(-10px, 10px); }
          45%, 85% { opacity: 1; transform: scale(1) translate(0, 0); }
          90%, 100% { opacity: 0; transform: scale(0.9) translateY(10px); }
        }
        @keyframes dotBlink {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; } 
          40% { transform: scale(1); opacity: 1; }
        }

        /* 2. Stories */
        .anim-spin-grad { animation: spinGrad 3s linear infinite; }
        .anim-story-avatar { animation: storyAvatar 10s infinite; }
        .anim-story-modal { animation: storyModal 10s infinite cubic-bezier(0.25, 0.8, 0.25, 1); transform-origin: center; }
        .anim-story-cursor { animation: storyCursor 10s infinite; }
        .anim-story-btn { animation: storyBtn 10s infinite; }

        @keyframes spinGrad { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes storyAvatar {
          0%, 15% { transform: scale(1); opacity: 1; }
          18% { transform: scale(0.9); opacity: 1; }
          22%, 80% { transform: scale(0.9); opacity: 0; pointer-events: none; }
          85%, 100% { transform: scale(1); opacity: 1; }
        }
        @keyframes storyModal {
          0%, 20% { opacity: 0; transform: scale(0.5) translateY(50px); pointer-events: none; }
          25%, 75% { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; }
          80%, 100% { opacity: 0; transform: scale(0.8) translateY(20px); pointer-events: none; }
        }
        @keyframes storyCursor {
          0%, 35% { transform: translate(40px, 60px); opacity: 0; }
          40% { transform: translate(40px, 60px); opacity: 1; }
          50%, 65% { transform: translate(0px, 0px); opacity: 1; }
          70%, 100% { transform: translate(40px, 60px); opacity: 0; }
        }
        @keyframes storyBtn {
          0%, 53% { transform: scale(1); background: #8BFDA8; }
          55% { transform: scale(0.95); background: #34C759; }
          58%, 100% { transform: scale(1); background: #8BFDA8; }
        }

        /* 3. Каталог */
        .anim-cat-cursor { animation: catCursor 10s infinite; }
        .anim-cat-btn { animation: catBtn 10s infinite; }
        .anim-cat-badge { animation: catBadge 10s infinite cubic-bezier(0.175, 0.885, 0.32, 1.275); }

        @keyframes catCursor {
          0%, 15% { transform: translate(50px, 50px); opacity: 0; }
          25% { transform: translate(50px, 50px); opacity: 1; }
          40%, 75% { transform: translate(0px, 0px); opacity: 1; }
          85%, 100% { transform: translate(50px, 50px); opacity: 0; }
        }
        @keyframes catBtn {
          0%, 48% { transform: scale(1); background-color: #8BFDA8; }
          50% { transform: scale(0.95); background-color: #34C759; }
          55%, 100% { transform: scale(1); background-color: #8BFDA8; }
        }
        @keyframes catBadge {
          0%, 50% { opacity: 0; transform: scale(0); }
          55%, 90% { opacity: 1; transform: scale(1); }
          95%, 100% { opacity: 0; transform: scale(0); }
        }

        /* 4. Заявки (Лиды) */
        .anim-lead-form { animation: leadForm 10s infinite; }
        .anim-lead-type1 { animation: leadType1 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-lead-type2 { animation: leadType2 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-lead-btn { animation: leadBtn 10s infinite; }
        .anim-lead-success { animation: leadSuccess 10s infinite; }

        @keyframes leadForm {
          0%, 65% { opacity: 1; transform: scale(1); pointer-events: auto; }
          70%, 100% { opacity: 0; transform: scale(0.9); pointer-events: none; }
        }
        @keyframes leadType1 { 0%, 15% { width: 0%; opacity: 0; } 25%, 100% { width: 60%; opacity: 1; } }
        @keyframes leadType2 { 0%, 30% { width: 0%; opacity: 0; } 40%, 100% { width: 80%; opacity: 1; } }
        @keyframes leadBtn {
          0%, 48% { transform: scale(1); } 50% { transform: scale(0.95); background: #34C759; } 55%, 100% { transform: scale(1); }
        }
        @keyframes leadSuccess {
          0%, 65% { opacity: 0; transform: scale(0.5); pointer-events: none; }
          70%, 95% { opacity: 1; transform: scale(1); pointer-events: auto; }
          100% { opacity: 0; transform: scale(0.9); pointer-events: none; }
        }

        /* 5. Аналитика */
        .anim-bar-1 { animation: bar1 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-bar-2 { animation: bar2 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        .anim-bar-3 { animation: bar3 10s infinite cubic-bezier(0.4, 0, 0.2, 1); }
        
        @keyframes bar1 { 0%, 10% { height: 10%; } 30%, 90% { height: 60%; } 100% { height: 10%; } }
        @keyframes bar2 { 0%, 20% { height: 15%; } 40%, 90% { height: 40%; } 100% { height: 15%; } }
        @keyframes bar3 { 0%, 30% { height: 20%; } 50%, 90% { height: 90%; } 100% { height: 20%; } }
      `}} />

      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 border-b border-zinc-900/80 backdrop-blur-md bg-black/40">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center cursor-pointer">
             <svg className="h-[14px] w-auto" viewBox="0 0 99 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M98.0879 13.7771H92.4758L89.457 10.1911H83.0142V13.7771H78.8203V6.84812H90.6118C91.2602 6.84812 91.8072 6.71305 92.2529 6.44291C92.6987 6.17278 92.9215 5.80134 92.9215 5.3286C92.9215 4.80183 92.7189 4.41013 92.3137 4.1535C91.9085 3.88336 91.3412 3.7483 90.6118 3.7483H78.8203V0.223007H90.2674C91.0373 0.223007 91.8342 0.297295 92.6581 0.44587C93.4821 0.580939 94.2317 0.830816 94.9071 1.1955C95.5824 1.56019 96.1362 2.05319 96.5684 2.6745C97.0141 3.29582 97.237 4.09272 97.237 5.06522C97.237 5.59198 97.156 6.09174 96.9939 6.56448C96.8318 7.03722 96.5954 7.46268 96.2848 7.84087C95.9876 8.21906 95.6162 8.54323 95.1704 8.81337C94.7382 9.07 94.2452 9.25234 93.6914 9.36039C93.921 9.53598 94.1777 9.75885 94.4613 10.029C94.745 10.2991 95.1232 10.6706 95.5959 11.1433L98.0879 13.7771Z" fill="white"/>
                <path d="M76.4839 7.86113C76.4839 11.9537 73.6677 14 68.0353 14C66.401 14 64.9963 13.8717 63.8212 13.6151C62.6461 13.3584 61.6736 12.9735 60.9037 12.4602C60.1473 11.947 59.5868 11.3121 59.2221 10.5558C58.8709 9.78586 58.6953 8.88765 58.6953 7.86113V0.223007H62.8689V7.86113C62.8689 8.36089 62.9365 8.7796 63.0716 9.11727C63.2066 9.45494 63.4565 9.73183 63.8212 9.94794C64.1994 10.1505 64.7261 10.2991 65.4015 10.3937C66.0768 10.4747 66.9548 10.5152 68.0353 10.5152C68.8458 10.5152 69.5211 10.468 70.0614 10.3734C70.6017 10.2789 71.0339 10.1235 71.358 9.90742C71.6822 9.69131 71.9118 9.41442 72.0469 9.07675C72.1955 8.73908 72.2698 8.33387 72.2698 7.86113V0.223007H76.4839V7.86113Z" fill="white"/>
                <path d="M54.0961 13.9999C53.826 13.9999 53.5559 13.9526 53.2857 13.858C53.0291 13.777 52.7387 13.5811 52.4145 13.2705L44.1078 5.8147V13.777H40.2988V2.53254C40.2988 2.08681 40.3596 1.70186 40.4812 1.3777C40.6162 1.05353 40.7851 0.790151 40.9877 0.587548C41.2038 0.384945 41.4469 0.23637 41.7171 0.141821C42.0007 0.0472738 42.2911 0 42.5883 0C42.8449 0 43.1015 0.0472738 43.3581 0.141821C43.6283 0.222862 43.9322 0.418712 44.2699 0.729369L52.5766 8.18515V0.222863H56.4058V11.4471C56.4058 11.8928 56.3383 12.2777 56.2032 12.6019C56.0817 12.9261 55.9128 13.1962 55.6967 13.4123C55.4941 13.6149 55.251 13.7635 54.9673 13.858C54.6837 13.9526 54.3933 13.9999 54.0961 13.9999Z" fill="white"/>
                <path d="M11.4062 0C12.0411 0 12.5686 0.148162 12.9873 0.445312C13.4195 0.72895 13.7839 1.08733 14.0811 1.51953L22.5498 13.7773H6.78711L9.31934 10.292H13.9795C14.4252 10.292 14.8106 10.306 15.1348 10.333C14.9457 10.0899 14.7225 9.78558 14.4658 9.4209C14.2227 9.04277 13.9864 8.6913 13.7568 8.36719L11.3252 4.78125L4.96387 13.7773H0L8.69141 1.51953C8.97505 1.12783 9.3334 0.776478 9.76562 0.46582C10.1977 0.155307 10.7447 5.27822e-05 11.4062 0ZM28.2998 13.7773H24.1055V0.222656H28.2998V13.7773Z" fill="#8BFDA8"/>
             </svg>
          </div>
          <nav className="flex items-center gap-4 text-[13px] font-medium">
            <Link href="/login" className="text-zinc-400 hover:text-white transition-colors hidden sm:block">
              Вход
            </Link>
            <Link href="/login" className="bg-[#8BFDA8] text-black px-5 py-2 rounded-[10px] hover:scale-105 transition-all font-bold">
              Регистрация
            </Link>
          </nav>
        </div>
      </header>

      {/* HERO SECTION (Добавлен padding top, чтобы компенсировать fixed шапку) */}
      <section className="relative z-10 pt-36 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8BFDA8]/30 bg-[#8BFDA8]/10 text-[#8BFDA8] text-[11px] font-bold uppercase tracking-widest mb-6">
            <Zap size={12} fill="currentColor" className="animate-pulse" /> Полная автоматизация продаж
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6 leading-[1.1]">
            Продавайте <span className="text-[#8BFDA8]">24/7</span><br />
            без участия менеджера
          </h1>
          <p className="text-base md:text-lg text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI NUR — это виджет с искусственным интеллектом. Бесплатно настройте его в личном кабинете, скопируйте 1 строку кода на свой сайт и получайте заявки.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto h-12 px-8 bg-[#8BFDA8] text-black rounded-[12px] font-bold text-base flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(139,253,168,0.4)] transition-all active:scale-95">
              Создать виджет бесплатно <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ФУНКЦИОНАЛ: BENTO GRID */}
      <section id="features" className="relative z-10 py-12 px-6 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* БЛОК 1: ИИ-ЧАТ (Занимает 2 колонки) */}
          <div className="col-span-1 lg:col-span-2 bg-[#111111] border border-zinc-800/80 rounded-[24px] overflow-hidden flex flex-col">
            {/* Анимация сверху */}
            <div className="h-[240px] bg-[#161616] border-b border-zinc-800/80 flex items-center justify-center relative overflow-hidden">
               <div className="w-full max-w-[380px] flex flex-col gap-3 px-6 relative z-10 mt-[-20px]">
                 <div className="anim-msg-user self-end bg-[#8BFDA8] text-black px-4 py-2.5 rounded-[16px] rounded-br-sm text-[13px] font-medium shadow-lg">
                    У вас есть кроссовки Nike?
                 </div>
                 <div className="anim-typing self-start bg-[#2C2C2E] px-3.5 py-3 rounded-[16px] rounded-bl-sm flex gap-1 items-center shadow-lg">
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-1"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-2"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-zinc-400 dot-3"></div>
                 </div>
                 <div className="anim-msg-ai self-start bg-[#2C2C2E] text-white px-4 py-2.5 rounded-[16px] rounded-bl-sm text-[13px] font-medium shadow-lg leading-relaxed mt-[-36px]">
                    Да! Nike Air Max в наличии. Цена 45 000 ₸. Можете оформить заказ прямо здесь в корзине.
                 </div>
               </div>
            </div>
            {/* Текст снизу */}
            <div className="p-6 flex-shrink-0">
               <h3 className="text-lg font-bold mb-2 text-white">Нейросеть-продавец</h3>
               <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
                 ИИ мгновенно отвечает клиентам 24/7, консультирует по каталогу и сам закрывает сделки.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Вы перестаете терять клиентов ночью, в выходные или когда менеджер занят.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Повышает лояльность за счет моментального и точного ответа по базе знаний.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 2: STORIES */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[24px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[240px] bg-[#161616] border-b border-zinc-800/80 flex items-center justify-center relative">
               {/* Кружок Stories (Настроен как в реальном виджете) */}
               <div className="anim-story-avatar relative w-16 h-16 flex-shrink-0 z-10">
                  <svg className="anim-spin-grad absolute inset-0 w-full h-full" viewBox="0 0 60 60">
                     <defs><linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#8BFDA8"/><stop offset="100%" stopColor="#00B0F2"/></linearGradient></defs>
                     <circle cx="30" cy="30" r="26" stroke="url(#grad1)" strokeWidth="6" fill="none" strokeDasharray="50 15" strokeLinecap="round" />
                  </svg>
                  <div className="absolute inset-[4px] bg-zinc-800 rounded-full border-[2px] border-[#1A1A1A] flex items-center justify-center">
                    <span className="text-zinc-500 text-[9px] font-bold uppercase tracking-wider">News</span>
                  </div>
               </div>

               {/* Модальное окно (Открытый сторис) */}
               <div className="anim-story-modal absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm z-20">
                  <div className="w-[130px] h-[200px] bg-zinc-900 rounded-xl border border-zinc-700 relative overflow-hidden flex flex-col shadow-2xl">
                     <div className="absolute top-2 left-2 right-2 flex gap-1"><div className="h-1 bg-white/50 w-full rounded"></div></div>
                     <div className="flex-1 flex items-center justify-center text-white/20 font-bold text-[10px]">VIDEO</div>
                     <div className="p-2 absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent">
                        <div className="anim-story-btn w-full bg-[#8BFDA8] text-black text-[9px] font-bold py-2 rounded-md text-center">Оставить заявку</div>
                     </div>
                     {/* Курсор */}
                     <div className="anim-story-cursor absolute z-30" style={{ bottom: '5px', left: '50px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'}}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.6 7.4c.14.28.47.4.75.26l2.16-1.05c.28-.14.4-.47.26-.75l-3.55-7.3 5.48-.55c.44-.04.62-.6.28-.88L6.34 2.86c-.32-.28-.84-.06-.84.35z"/></svg>
                     </div>
                  </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 flex-shrink-0">
               <h3 className="text-lg font-bold mb-2 text-white">Интерактивные Stories</h3>
               <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
                 Загружайте короткие видео и фото прямо из админки в привычном формате.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Быстро делитесь акциями или новинками.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Конвертирует просмотры в заявки напрямую через кнопки в видео.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 3: КАТАЛОГ */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[24px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[240px] bg-[#161616] border-b border-zinc-800/80 flex items-center justify-center relative">
               <div className="absolute top-4 right-6 bg-zinc-800 p-2 rounded-full">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8BFDA8" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
                  <div className="anim-cat-badge absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8BFDA8] text-black text-[9px] font-bold rounded-full flex items-center justify-center">1</div>
               </div>
               <div className="bg-zinc-900 border border-zinc-800 rounded-[16px] p-3 w-[160px] shadow-2xl relative">
                  <div className="w-full h-[70px] bg-zinc-800 rounded-lg mb-3"></div>
                  <div className="h-2 w-3/4 bg-zinc-700 rounded mb-2"></div>
                  <div className="h-2 w-1/3 bg-zinc-800 rounded mb-3"></div>
                  <div className="anim-cat-btn bg-[#8BFDA8] text-black font-bold text-[10px] py-2 rounded-md text-center">В корзину</div>
                  <div className="anim-cat-cursor absolute z-20" style={{ bottom: '2px', right: '15px', filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'}}>
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="1.5"><path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86 3.6 7.4c.14.28.47.4.75.26l2.16-1.05c.28-.14.4-.47.26-.75l-3.55-7.3 5.48-.55c.44-.04.62-.6.28-.88L6.34 2.86c-.32-.28-.84-.06-.84.35z"/></svg>
                  </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 flex-shrink-0">
               <h3 className="text-lg font-bold mb-2 text-white">Встроенный каталог</h3>
               <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
                 Клиенты просматривают услуги и товары, не покидая чат.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Бесшовный опыт: клиенту не нужно искать товары на основном сайте.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Удобная корзина прямо в виджете повышает конверсию.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 4: ЗАЯВКИ */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[24px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[240px] bg-[#161616] border-b border-zinc-800/80 flex items-center justify-center relative">
               <div className="anim-lead-form bg-zinc-900 border border-zinc-800 rounded-[16px] p-4 w-[180px] shadow-2xl absolute flex flex-col gap-3">
                  <div className="h-2 w-1/2 bg-zinc-700 rounded mb-1 mx-auto"></div>
                  <div className="h-7 w-full bg-zinc-800 rounded-md relative overflow-hidden px-2 flex items-center">
                     <div className="anim-lead-type1 h-2 bg-zinc-600 rounded"></div>
                  </div>
                  <div className="h-7 w-full bg-zinc-800 rounded-md relative overflow-hidden px-2 flex items-center">
                     <div className="anim-lead-type2 h-2 bg-zinc-600 rounded"></div>
                  </div>
                  <div className="anim-lead-btn bg-[#8BFDA8] text-black font-bold text-[10px] py-2 rounded-md text-center mt-1">Отправить</div>
               </div>

               <div className="anim-lead-success absolute flex flex-col items-center gap-2">
                  <div className="w-10 h-10 bg-[#34C759] rounded-full flex items-center justify-center">
                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div className="text-white font-bold text-[13px]">Отправлено</div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 flex-shrink-0">
               <h3 className="text-lg font-bold mb-2 text-white">Генерация лидов</h3>
               <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
                 Сбор контактов без сложных и скучных форм.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>ИИ сам предложит клиенту оставить номер WhatsApp, если тот сомневается.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Вы получаете базу теплых контактов для продаж.</span>
                 </li>
               </ul>
            </div>
          </div>

          {/* БЛОК 5: АНАЛИТИКА */}
          <div className="col-span-1 bg-[#111111] border border-zinc-800/80 rounded-[24px] overflow-hidden flex flex-col">
            {/* Анимация */}
            <div className="h-[240px] bg-[#161616] border-b border-zinc-800/80 flex items-center justify-center relative p-6">
               <div className="w-[80%] h-full border-b border-l border-zinc-800 flex items-end justify-around pb-1 pl-3 gap-3">
                  <div className="w-full bg-zinc-700 rounded-t-sm anim-bar-1 relative">
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-zinc-500 font-mono">1.2k</div>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-t-sm anim-bar-2 relative">
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-zinc-500 font-mono">840</div>
                  </div>
                  <div className="w-full bg-[#8BFDA8] rounded-t-sm anim-bar-3 relative shadow-[0_0_15px_rgba(139,253,168,0.3)]">
                     <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] text-[#8BFDA8] font-bold font-mono">3.4k</div>
                  </div>
               </div>
            </div>
            {/* Текст */}
            <div className="p-6 flex-shrink-0">
               <h3 className="text-lg font-bold mb-2 text-white">Сквозная аналитика</h3>
               <p className="text-zinc-400 text-[13px] leading-relaxed mb-4">
                 Следите за всеми метриками в удобной панели управления.
               </p>
               <ul className="space-y-2">
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Точно знаете, сколько человек открыли виджет или перешли в каталог.</span>
                 </li>
                 <li className="flex items-start gap-2 text-[12px] text-zinc-300">
                    <CheckCircle2 size={14} className="text-[#8BFDA8] mt-[2px] shrink-0"/> 
                    <span>Помогает оценивать эффективность маркетинга и рекламы.</span>
                 </li>
               </ul>
            </div>
          </div>

        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative z-10 py-20 border-t border-zinc-900 bg-gradient-to-b from-transparent to-[#8BFDA8]/5 mt-10">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-black mb-6">Начните собирать заявки <br /> уже сегодня</h2>
          <p className="text-sm md:text-base text-zinc-400 mb-8">
            Регистрация и базовая настройка полностью бесплатны.
          </p>
          <Link href="/login" className="inline-flex h-12 px-8 bg-[#8BFDA8] text-black rounded-[12px] font-bold text-base items-center justify-center hover:scale-105 transition-all active:scale-95 shadow-[0_0_30px_rgba(139,253,168,0.2)]">
            Создать платформу
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-10 border-t border-zinc-900 bg-black">
        <div className="max-w-[1200px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="opacity-40 grayscale hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer flex items-center">
             <span className="text-white font-black text-lg tracking-tighter">AI NUR</span>
          </div>
          <div className="text-xs text-zinc-600">
            © 2026 AI NUR Platform. Все права защищены.
          </div>
        </div>
      </footer>

    </div>
  );
}