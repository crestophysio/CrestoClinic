"use client";

import React, { useState } from "react";
import { Plus } from "lucide-react";

/* Real brand / glyph icons (lucide ships no brand logos) */
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.36.101 11.945c0 2.096.549 4.142 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.448h.006c6.585 0 11.946-5.36 11.949-11.945a11.821 11.821 0 00-3.495-8.404" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function ChatbotIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z" />
    </svg>
  );
}

interface FloatingActionsProps {
  settings: any;
}

export default function FloatingActions({ settings }: FloatingActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const whatsappNum = settings?.whatsapp?.replace(/\s+/g, "") || "+919876543210";
  const phoneNum = settings?.phone?.replace(/\s+/g, "") || "+919876543210";
  const defaultMsg = encodeURIComponent("Hi, I want to book an appointment at Cresto Physiotherapy Clinic.");

  const waUrl = `https://wa.me/${whatsappNum}?text=${defaultMsg}`;
  const callUrl = `tel:${phoneNum}`;

  return (
    <>
      {/* Mobile Radial Menu Container */}
      <div className="fixed bottom-6 right-6 z-50 sm:hidden">
        {/* Background Overlay when open */}
        {isOpen && (
          <div 
            className="fixed inset-0 bg-brand-ink/10 backdrop-blur-[2px] transition-opacity"
            style={{ zIndex: -1 }}
            onClick={() => setIsOpen(false)}
          />
        )}
        
        {/* The Action Buttons */}
        <div className="absolute bottom-0 right-0 w-14 h-14 flex items-center justify-center">
          {/* Chatbot Action (Top) */}
          <button
            onClick={() => {
              setIsOpen(false);
              window.dispatchEvent(new CustomEvent("toggle-chatbot"));
            }}
            className={`absolute w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
              isOpen ? "-translate-y-[85px] opacity-100 scale-100" : "translate-y-0 opacity-0 scale-50 pointer-events-none"
            }`}
            aria-label="Open Chatbot"
          >
            <ChatbotIcon className="w-5 h-5" />
          </button>

          {/* Call Action (Diagonal) */}
          <a
            href={callUrl}
            onClick={() => setIsOpen(false)}
            className={`absolute w-12 h-12 bg-pink text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 delay-75 ${
              isOpen ? "-translate-y-[60px] -translate-x-[60px] opacity-100 scale-100" : "translate-y-0 translate-x-0 opacity-0 scale-50 pointer-events-none"
            }`}
            aria-label="Call Emergency"
          >
            <PhoneIcon className="w-5 h-5 animate-pulse" />
          </a>

          {/* WhatsApp Action (Left) */}
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className={`absolute w-12 h-12 bg-teal text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 delay-150 ${
              isOpen ? "-translate-x-[85px] opacity-100 scale-100" : "translate-x-0 opacity-0 scale-50 pointer-events-none"
            }`}
            aria-label="WhatsApp Chat"
          >
            <WhatsAppIcon className="w-5 h-5" />
          </a>
        </div>

        {/* Main Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative z-10 w-14 h-14 bg-teal hover:bg-teal-dark text-white rounded-full flex items-center justify-center shadow-2xl transition-transform duration-300 ${
            isOpen ? "rotate-[135deg]" : "rotate-0"
          }`}
          aria-label="Toggle Menu"
        >
          <Plus className="w-6 h-6" />
          {/* Ping indicator if closed */}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-pink rounded-full border-2 border-white flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            </span>
          )}
        </button>
      </div>

      {/* Desktop/Tablet Docked Vertical Sidebar on the Right Edge */}
      <div className="hidden sm:flex flex-col items-center gap-4 fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-white/30 backdrop-blur-lg border-l border-y border-white/20 shadow-2xl rounded-l-2xl py-5 px-3 w-16">
        
        {/* Vertical Text Label */}
        <div className="[writing-mode:vertical-rl] rotate-180 font-heading font-black tracking-widest text-[9px] text-brand-muted uppercase select-none mb-3 whitespace-nowrap">
          Cresto Connect
        </div>

        {/* Action Button 1: Emergency Call (Pink) */}
        <a
          href={callUrl}
          className="w-10 h-10 rounded-xl bg-pink hover:bg-pink-hover text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          title="Call Clinic Emergency"
        >
          <PhoneIcon className="w-4.5 h-4.5 animate-pulse" />
        </a>

        {/* Action Button 2: Chatbot Assistant (Green) */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("toggle-chatbot"))}
          className="w-10 h-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          title="Chat with Assistant"
        >
          <ChatbotIcon className="w-4.5 h-4.5" />
        </button>

        {/* Action Button 3: WhatsApp Support (Teal) */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-xl bg-teal hover:bg-teal-dark text-white flex items-center justify-center shadow-md transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          title="WhatsApp Chat"
        >
          <WhatsAppIcon className="w-4.5 h-4.5" />
        </a>

      </div>
    </>
  );
}
