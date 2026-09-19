import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { CarouselImageItem, CarouselRole } from '../types';
import { GrainOverlay } from './GrainOverlay';
import blueFigurine from '../assets/blue.png';
import greenFigurine from '../assets/green.png';
import redFigurine from '../assets/red.png';

const IMAGES: CarouselImageItem[] = [
  {
    id: '01',
    model: 'MODEL // TG-01',
    name: 'AERO COBALT',
    tagline: 'HIGH-VELOCITY KINETIC SPEC',
    description:
      'Equipped with pressurized aerogel composite armor and magnetic suspension runners. Optimized for hypersonic urban patrol and aerial drop deployment.',
    edition: '1 OF 500',
    scale: '1:6 SCALE',
    src: blueFigurine,
    bg: '#1D64EC', // Electric Royal Blue matching blue.webp
    panel: '#38BDF8',
  },
  {
    id: '02',
    model: 'MODEL // TG-02',
    name: 'VERDANT ECHO',
    tagline: 'BIO-SYNTHETIC ENDURANCE SPEC',
    description:
      'Engineered with jade-alloy kinetic dampeners and adaptive environmental camouflage. Built for sustained low-altitude tactical stealth operations.',
    edition: '2 OF 500',
    scale: '1:6 SCALE',
    src: greenFigurine,
    bg: '#16A34A', // Vivid Emerald Green matching green.webp
    panel: '#4ADE80',
  },
  {
    id: '03',
    model: 'MODEL // TG-03',
    name: 'CRIMSON APEX',
    tagline: 'OVERCLOCKED ASSAULT SPEC',
    description:
      'Forged with heat-treated crimson carbon plating and twin thermal discharge exchangers. Calibrated for relentless frontline kinetic output.',
    edition: '3 OF 500',
    scale: '1:6 SCALE',
    src: redFigurine,
    bg: '#DC2626', // Bold Crimson Red matching red.webp
    panel: '#F87171',
  },
];

export const CarouselHero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [lastDirection, setLastDirection] = useState<'next' | 'prev'>('next');
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  );

  // Preload all official figurine images on mount
  useEffect(() => {
    IMAGES.forEach((item) => {
      const img = new Image();
      img.src = item.src;
    });
  }, []);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Navigate next or prev with 650ms animation lock
  const navigate = useCallback(
    (direction: 'next' | 'prev') => {
      if (isAnimating) return;
      setIsAnimating(true);
      setLastDirection(direction);
      setActiveIndex((prev) =>
        direction === 'next'
          ? (prev + 1) % IMAGES.length
          : (prev - 1 + IMAGES.length) % IMAGES.length
      );
      setTimeout(() => {
        setIsAnimating(false);
      }, 650);
    },
    [isAnimating]
  );

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        navigate('prev');
      } else if (e.key === 'ArrowRight') {
        navigate('next');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Roles derived from activeIndex for 3 items:
  // center = activeIndex
  // right = (activeIndex + 1) % 3
  // left = (activeIndex - 1 + 3) % 3
  const getRole = (index: number): CarouselRole => {
    if (index === activeIndex) return 'center';
    if (index === (activeIndex + 1) % IMAGES.length) return 'right';
    if (index === (activeIndex - 1 + IMAGES.length) % IMAGES.length) return 'left';
    return 'back';
  };

  // Dynamic z-index layering during 3-item orbital transition:
  // 1. New center comes forward to the top (zIndex 30)
  // 2. Outgoing center transitions smoothly to the side (zIndex 15)
  // 3. Side item traversing across the background stays behind both (zIndex 5)
  const getRoleZIndex = (role: CarouselRole): number => {
    if (role === 'center') return isAnimating ? 30 : 20;
    if (!isAnimating) return 10;
    if (lastDirection === 'next') {
      return role === 'left' ? 15 : 5;
    } else {
      return role === 'right' ? 15 : 5;
    }
  };

  // Role-based positioning, scale, blur, opacity, and transitions
  const getRoleStyle = (role: CarouselRole): React.CSSProperties => {
    const transition =
      'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1)';

    const zIndex = getRoleZIndex(role);

    switch (role) {
      case 'center':
        return {
          position: 'absolute',
          aspectRatio: '0.667 / 1',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom center',
          filter: 'blur(0px)',
          opacity: 1,
          zIndex,
          left: '50%',
          height: isMobile ? '64%' : '82%',
          bottom: isMobile ? '16%' : '1%',
          transition,
          willChange: 'transform, filter, opacity',
        };
      case 'left':
        return {
          position: 'absolute',
          aspectRatio: '0.667 / 1',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom center',
          filter: 'blur(2.5px)',
          opacity: 0.75,
          zIndex,
          left: isMobile ? '18%' : '26%',
          height: isMobile ? '28%' : '44%',
          bottom: isMobile ? '26%' : '10%',
          transition,
          willChange: 'transform, filter, opacity',
          cursor: 'pointer',
        };
      case 'right':
        return {
          position: 'absolute',
          aspectRatio: '0.667 / 1',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom center',
          filter: 'blur(2.5px)',
          opacity: 0.75,
          zIndex,
          left: isMobile ? '82%' : '74%',
          height: isMobile ? '28%' : '44%',
          bottom: isMobile ? '26%' : '10%',
          transition,
          willChange: 'transform, filter, opacity',
          cursor: 'pointer',
        };
      case 'back':
        return {
          position: 'absolute',
          aspectRatio: '0.667 / 1',
          transform: 'translateX(-50%)',
          transformOrigin: 'bottom center',
          filter: 'blur(4px)',
          opacity: 0,
          zIndex: 5,
          left: '50%',
          height: isMobile ? '20%' : '35%',
          bottom: isMobile ? '26%' : '10%',
          transition,
          willChange: 'transform, filter, opacity',
        };
    }
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: IMAGES[activeIndex].bg,
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        className="relative w-full"
        style={{
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* 1. Grain overlay */}
        <GrainOverlay />

        {/* 2. Dynamic active-state ambient spotlight based on active figurine */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            zIndex: 1,
            background: `radial-gradient(ellipse 65% 55% at 50% 60%, ${IMAGES[activeIndex].panel}30 0%, transparent 75%)`,
            transition: 'background 650ms cubic-bezier(0.4,0,0.2,1)',
          }}
        />

        {/* 3. Giant ghost text "GENERATION" + Left-aligned Tagline */}
        <div
          className="absolute inset-x-0 flex flex-col pointer-events-none select-none"
          style={{
            zIndex: 2,
            top: isMobile ? '15%' : '13%',
          }}
        >
          <div
            className="w-full flex items-center justify-center uppercase text-white"
            style={{
              fontFamily: "'Circuit Forem', sans-serif",
              fontSize: 'clamp(46px, 12.8vw, 215px)',
              fontWeight: 400,
              color: 'white',
              opacity: 1,
              lineHeight: 1,
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
            }}
          >
            GENERATION
          </div>
        </div>

        {/* 4. Top-left brand label "THIRD GEN" */}
        <header
          className="absolute top-6 left-4 sm:left-8 text-xs font-semibold uppercase text-white"
          style={{
            zIndex: 60,
            opacity: 0.9,
            letterSpacing: '0.18em',
          }}
        >
          THIRD GEN
        </header>

        {/* 5. Carousel figurines */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3 }}
          aria-label="Character figurine carousel"
        >
          {IMAGES.map((item, index) => {
            const role = getRole(index);
            const style = getRoleStyle(role);

            return (
              <div
                key={item.src}
                style={style}
                onClick={() => {
                  if (role === 'left') navigate('prev');
                  if (role === 'right') navigate('next');
                }}
                role={role === 'left' || role === 'right' ? 'button' : undefined}
                aria-label={
                  role === 'left'
                    ? 'Previous figurine'
                    : role === 'right'
                    ? 'Next figurine'
                    : `Active figurine ${index + 1}`
                }
                tabIndex={role === 'left' || role === 'right' ? 0 : -1}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (role === 'left') navigate('prev');
                    if (role === 'right') navigate('next');
                  }
                }}
              >
                <img
                  src={item.src}
                  alt={`THIRD GEN character figurine ${index + 1}`}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                  className="pointer-events-none select-none"
                />
              </div>
            );
          })}
        </div>

        {/* 5. Bottom-left text + nav buttons */}
        <div
          className="absolute bottom-6 left-4 sm:bottom-20 sm:left-24 text-white"
          style={{
            zIndex: 60,
            maxWidth: '320px',
          }}
        >
          <p
            className="font-bold uppercase tracking-widest mb-2 sm:mb-3 text-base sm:text-[22px]"
            style={{
              opacity: 0.95,
              letterSpacing: '0.02em',
            }}
          >
            THIRD GEN FIGURINES
          </p>
          <p
            className="hidden sm:block text-xs sm:text-sm mb-4 sm:mb-5"
            style={{
              opacity: 0.85,
              lineHeight: 1.6,
            }}
          >
            Sculpted with museum-grade precision, each physical piece embodies the
            convergence of futuristic street culture and flawless 3D craftsmanship.
            Limited third-generation releases built for visionary collectors.
          </p>

          <div className="flex items-center gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => navigate('prev')}
              aria-label="Previous character"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-transparent border-2 border-white text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              style={{
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              type="button"
              onClick={() => navigate('next')}
              aria-label="Next character"
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-transparent border-2 border-white text-white cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              style={{
                transition: 'transform 150ms, background-color 150ms',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.08)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* 6. Bottom-right: Active figurine Model & Brief Description */}
        <div
          className="absolute bottom-6 right-4 sm:bottom-20 sm:right-10 lg:right-16 text-right text-white select-none"
          style={{
            zIndex: 60,
            maxWidth: isMobile ? '220px' : '360px',
          }}
        >
          <div
            key={IMAGES[activeIndex].id}
            className="animate-figurine-info flex flex-col items-end"
          >
            {/* Model Designation */}
            <span
              className="text-[11px] sm:text-xs font-semibold tracking-[0.2em] uppercase text-white/75 mb-1"
              style={{ fontFamily: "'Circuit Forem', sans-serif" }}
            >
              {IMAGES[activeIndex].model}
            </span>

            {/* Figurine Name */}
            <h2
              className="font-black uppercase tracking-wide text-lg sm:text-2xl lg:text-3xl text-white mb-0 sm:mb-2"
              style={{
                letterSpacing: '0.02em',
                lineHeight: 1.1,
              }}
            >
              {IMAGES[activeIndex].name}
            </h2>

            {/* Brief Description - Hidden on mobile */}
            <p
              className="hidden sm:block text-xs lg:text-sm text-white/85 leading-relaxed"
              style={{
                lineHeight: 1.6,
              }}
            >
              {IMAGES[activeIndex].description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
