/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { TransitStatus } from '../types/saturn';
import { Orbit, Compass, Eye, ShieldAlert, CheckCircle } from 'lucide-react';

interface SaturnVisualizerProps {
  status: TransitStatus;
}

export const SaturnVisualizer: React.FC<SaturnVisualizerProps> = ({ status }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [animationAngle, setAnimationAngle] = useState(0);
  const [isRotating, setIsRotating] = useState(true);

  // Animation loop for subtle planet and ring rotation
  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      if (isRotating) {
        setAnimationAngle((prev) => (prev + 0.3) % 360);
      }
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isRotating]);

  // Canvas drawing for Saturn with rings, atmospheric bands, and orbital radar
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.clearRect(0, 0, width, height);

    // Deep space background gradient matching deep navy #0B132B
    const bgGrad = ctx.createRadialGradient(centerX, centerY, 10, centerX, centerY, width / 2);
    bgGrad.addColorStop(0, 'rgba(23, 35, 62, 0.85)');
    bgGrad.addColorStop(0.65, 'rgba(16, 26, 48, 0.95)');
    bgGrad.addColorStop(1, 'rgba(11, 19, 43, 1)');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Orbital Radar Guides
    ctx.strokeStyle = 'rgba(197, 147, 42, 0.14)';
    ctx.lineWidth = 1;
    [70, 110, 150, 190].forEach((radius) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Crosshairs
    ctx.strokeStyle = 'rgba(197, 147, 42, 0.09)';
    ctx.beginPath();
    ctx.moveTo(centerX - 200, centerY);
    ctx.lineTo(centerX + 200, centerY);
    ctx.moveTo(centerX, centerY - 200);
    ctx.lineTo(centerX + 200, centerY);
    ctx.stroke();

    // Ring Tilt angle based on status
    const tiltRadians = (Math.max(1.5, status.ringTiltDeg * 2.5) * Math.PI) / 180;
    const planetRadius = 46;
    const ringInnerRadius = 64;
    const ringOuterRadius = 118;
    const ringYScale = Math.sin(tiltRadians);

    // Draw BACK of the rings (behind the planet)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(((-15 + Math.sin(animationAngle * 0.02) * 2) * Math.PI) / 180);

    // Outer Ring A
    ctx.beginPath();
    ctx.ellipse(0, 0, ringOuterRadius, ringOuterRadius * ringYScale, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(197, 147, 42, 0.38)';
    ctx.lineWidth = 14;
    ctx.stroke();

    // Cassini Division
    ctx.beginPath();
    ctx.ellipse(0, 0, 100, 100 * ringYScale, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(11, 19, 43, 0.95)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Main Ring B (Brightest)
    ctx.beginPath();
    ctx.ellipse(0, 0, 88, 88 * ringYScale, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(212, 164, 61, 0.75)';
    ctx.lineWidth = 18;
    ctx.stroke();

    // Inner Ring C (Crepe ring)
    ctx.beginPath();
    ctx.ellipse(0, 0, ringInnerRadius, ringInnerRadius * ringYScale, 0, Math.PI, Math.PI * 2);
    ctx.strokeStyle = 'rgba(170, 140, 80, 0.22)';
    ctx.lineWidth = 10;
    ctx.stroke();
    ctx.restore();

    // Draw SATURN GLOBE (Sphere with gradient and atmospheric bands)
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, planetRadius, 0, Math.PI * 2);
    ctx.clip();

    // Planet body gradient
    const planetGrad = ctx.createRadialGradient(
      centerX - 18,
      centerY - 18,
      4,
      centerX,
      centerY,
      planetRadius
    );
    planetGrad.addColorStop(0, '#f7e7ba');
    planetGrad.addColorStop(0.35, '#deb870');
    planetGrad.addColorStop(0.7, '#a98038');
    planetGrad.addColorStop(0.95, '#5c431b');
    planetGrad.addColorStop(1, '#251b0a');

    ctx.fillStyle = planetGrad;
    ctx.fillRect(centerX - planetRadius, centerY - planetRadius, planetRadius * 2, planetRadius * 2);

    // Atmospheric bands
    const bandColors = [
      'rgba(180, 140, 80, 0.25)',
      'rgba(240, 220, 160, 0.3)',
      'rgba(140, 100, 50, 0.35)',
      'rgba(210, 180, 120, 0.25)',
      'rgba(110, 80, 40, 0.4)',
    ];
    bandColors.forEach((color, i) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        centerX - planetRadius,
        centerY - planetRadius + 14 + i * 13,
        planetRadius * 2,
        6
      );
    });

    // Shadow cast by rings onto planet globe
    ctx.fillStyle = 'rgba(11, 19, 43, 0.65)';
    ctx.fillRect(centerX - planetRadius, centerY - 6, planetRadius * 2, 8);
    ctx.restore();

    // Draw FRONT of the rings (passing in front of planet)
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(((-15 + Math.sin(animationAngle * 0.02) * 2) * Math.PI) / 180);

    // Inner Ring C front
    ctx.beginPath();
    ctx.ellipse(0, 0, ringInnerRadius, ringInnerRadius * ringYScale, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(170, 140, 80, 0.25)';
    ctx.lineWidth = 10;
    ctx.stroke();

    // Main Ring B front
    ctx.beginPath();
    ctx.ellipse(0, 0, 88, 88 * ringYScale, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(212, 164, 61, 0.85)';
    ctx.lineWidth = 18;
    ctx.stroke();

    // Cassini Division front
    ctx.beginPath();
    ctx.ellipse(0, 0, 100, 100 * ringYScale, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(11, 19, 43, 0.95)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Outer Ring A front
    ctx.beginPath();
    ctx.ellipse(0, 0, ringOuterRadius, ringOuterRadius * ringYScale, 0, 0, Math.PI);
    ctx.strokeStyle = 'rgba(197, 147, 42, 0.45)';
    ctx.lineWidth = 14;
    ctx.stroke();
    ctx.restore();

    // Retrograde indicator loop trail on radar
    if (status.phase === 'RETRÓGRADO') {
      ctx.save();
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.55)';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(centerX + 120, centerY - 40);
      ctx.bezierCurveTo(
        centerX + 70,
        centerY - 80,
        centerX - 80,
        centerY - 40,
        centerX - 130,
        centerY + 10
      );
      ctx.stroke();

      const beaconX = centerX - 30;
      const beaconY = centerY - 55;
      ctx.beginPath();
      ctx.arc(beaconX, beaconY, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();

      const pulse = (Math.sin(animationAngle * 0.1) + 1) * 4 + 6;
      ctx.beginPath();
      ctx.arc(beaconX, beaconY, pulse, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([]);
      ctx.stroke();

      ctx.restore();
    }
  }, [status, animationAngle]);

  return (
    <div className="relative rounded-[16px] bg-[#121C35] border border-white/[0.08] p-6 hig-card-shadow overflow-hidden">
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
        <div className="flex items-center gap-3">
          <Orbit className="w-5 h-5 text-[#C5932A] animate-spin" style={{ animationDuration: '30s' }} />
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-[#F9FAFB] uppercase font-mono-chrono">
              Saturno // Seu momento
            </h2>
            <p className="text-xs text-[#9CA3AF]">
              Uma imagem para acompanhar seus ciclos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsRotating(!isRotating)}
            className="px-3 py-1.5 text-xs font-mono-chrono rounded-[12px] bg-[#17233E] hover:bg-[#1C2B4B] text-[#F9FAFB] hover:text-[#D4A43D] border border-white/10 transition-all shadow-sm"
            title="Alternar rotação do visualizador"
          >
            {isRotating ? 'Pausar animação' : 'Animar Saturno'}
          </button>

          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-mono-chrono font-bold uppercase tracking-wide border ${
              status.phase === 'RETRÓGRADO'
                ? 'bg-rose-950/50 text-rose-300 border-rose-500/30'
                : 'bg-emerald-950/50 text-emerald-300 border-emerald-500/30'
            }`}
          >
            {status.phase === 'RETRÓGRADO' ? (
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            )}
            {status.phase}
          </span>
        </div>
      </div>

      {/* Canvas container */}
      <div className="relative flex items-center justify-center my-2">
        <canvas
          ref={canvasRef}
          width={480}
          height={320}
          className="w-full max-w-[480px] h-auto rounded-[14px] shadow-lg"
        />

        {/* Floating coordinate tags (Apple HIG frosted glass) */}
        <div className="absolute top-3 left-3 bg-[#0E172E]/90 border border-white/10 backdrop-blur-md rounded-[12px] p-3 text-xs font-mono-chrono shadow-lg space-y-1">
          <div className="text-[#9CA3AF] flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-[#C5932A]" />
            <span>COORDENADA ATUAL:</span>
          </div>
          <div className="text-[#D4A43D] font-bold text-sm">
            {status.currentDegree} {status.currentSign}
          </div>
          <div className="text-[11px] text-[#9CA3AF]">
            Longitude: <span className="text-[#F9FAFB]">{status.eclipticLongitude.toFixed(2)}°</span>
          </div>
        </div>

        <div className="absolute bottom-3 right-3 bg-[#0E172E]/90 border border-white/10 backdrop-blur-md rounded-[12px] p-3 text-xs font-mono-chrono shadow-lg text-right space-y-1">
          <div className="text-[#9CA3AF] flex items-center justify-end gap-1.5">
            <Eye className="w-3.5 h-3.5 text-sky-400" />
            <span>INCLINAÇÃO DOS ANÉIS:</span>
          </div>
          <div className="text-sky-300 font-bold text-sm">
            {status.ringTiltDeg.toFixed(1)}° (Edge-On)
          </div>
          <div className="text-[11px] text-[#9CA3AF]">
            Ciclo dos Anéis: <span className="text-[#D4A43D]">2025-2026 Cruzamento</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/[0.08] text-xs font-mono-chrono">
        <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
          <span className="text-[#9CA3AF] block text-[10px] uppercase font-semibold">DISTÂNCIA MÉDIA</span>
          <span className="text-[#F9FAFB] font-bold text-sm mt-0.5 block">~9.52 UA</span>
        </div>
        <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
          <span className="text-[#9CA3AF] block text-[10px] uppercase font-semibold">PERÍODO ORBITAL</span>
          <span className="text-[#F9FAFB] font-bold text-sm mt-0.5 block">29,457 Anos</span>
        </div>
        <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
          <span className="text-[#9CA3AF] block text-[10px] uppercase font-semibold">VELOCIDADE MÉDIA</span>
          <span className="text-[#F9FAFB] font-bold text-sm mt-0.5 block">9,68 km/s</span>
        </div>
        <div className="bg-[#17233E] p-3 rounded-[12px] border border-white/5">
          <span className="text-[#9CA3AF] block text-[10px] uppercase font-semibold">ALINHAMENTO NATAL</span>
          <span className="text-[#D4A43D] font-bold text-sm mt-0.5 block">~13°45' Áries</span>
        </div>
      </div>
    </div>
  );
};
