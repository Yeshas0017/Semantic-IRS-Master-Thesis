'use client';

import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[#1E2B48] py-8 text-xs text-[#98A4BC]">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
        <div>
          <p className="font-semibold text-white">
            Master Thesis Monograph: Semantic ISR for Web Rendering
          </p>
          <p className="text-[11px] text-[#5E6B85] mt-0.5">
            Yeshas Narasimha Murthy · Supervised by Prof. Dr. Kamellia Reshadi · SRH University Heidelberg
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-[#6C8CFF]">Google Cloud Run: europe-west3</span>
          <span>·</span>
          <span className="text-[#00E5A0]">Verified Scale-to-Zero (€0.00)</span>
        </div>
      </div>
    </footer>
  );
}