import React from 'react';
import { 
  Wifi, 
  Smartphone, 
  BookOpen, 
  Tag, 
  QrCode, 
  HelpCircle,
  Radio,
  Server
} from 'lucide-react';
import { RouterId, RouterConfig } from '../types';

interface HeaderBarProps {
  currentRouterId: RouterId;
  onSelectRouter: (id: RouterId) => void;
  routers: Record<RouterId, RouterConfig>;
  showGuide: boolean;
  onToggleGuide: () => void;
  onOpenPhoneSim: () => void;
  onOpenSticker: () => void;
  onOpenWiFiCard: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentRouterId,
  onSelectRouter,
  routers,
  showGuide,
  onToggleGuide,
  onOpenPhoneSim,
  onOpenSticker,
  onOpenWiFiCard,
}) => {
  return (
    <header className="bg-neutral-950 border-b border-neutral-800 text-neutral-100 select-none">
      {/* Top Banner with App Title and Utility Controls */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center text-white">
              <Wifi className="w-5 h-5 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm md:text-base font-bold text-white tracking-tight flex items-center gap-2">
              Configurador y Simulador de Routers Wi-Fi
              <span className="text-[10px] font-mono font-medium px-2 py-0.5 bg-neutral-800 text-neutral-300 rounded border border-neutral-700">
                Paso a Paso
              </span>
            </h1>
            <p className="text-xs text-neutral-400 hidden sm:block">
              Aprende a personalizar el nombre (SSID) y contraseña de tu red en los 3 routers más comunes.
            </p>
          </div>
        </div>

        {/* Global Toolbar buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleGuide}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showGuide
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm'
                : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guía Paso a Paso</span>
          </button>

          <button
            onClick={onOpenPhoneSim}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Escanear redes y probar conexión en un smartphone simulado"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Probar en</span> Móvil
          </button>

          <button
            onClick={onOpenSticker}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Ver la pegatina trasera del router con la IP y clave de fábrica"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Pegatina</span>
          </button>

          <button
            onClick={onOpenWiFiCard}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Generar código QR real de tu red"
          >
            <QrCode className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Tarjeta</span> QR
          </button>
        </div>
      </div>

      {/* 3 Interactive Router Switcher Icons in the Window (Mandatory User Requirement) */}
      <div className="px-4 py-3 bg-neutral-900/60">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Selecciona un tipo de router para entrar a su interfaz:</span>
          <span className="text-[10px] text-neutral-500 font-mono">3 interfaces interactivas disponibles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* ICON 1: Huawei Proveedor Claro */}
          <button
            type="button"
            onClick={() => onSelectRouter('huawei-claro')}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
              currentRouterId === 'huawei-claro'
                ? 'bg-neutral-900 border-[#DA291C] ring-2 ring-[#DA291C]/50 shadow-lg'
                : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Distinctive Icon 1 Badge */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                  currentRouterId === 'huawei-claro'
                    ? 'bg-[#DA291C]'
                    : 'bg-neutral-800 text-neutral-300 group-hover:bg-[#DA291C] group-hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Server className="w-5 h-5 mb-0.5" />
                  <span className="text-[8px] font-mono leading-none">1</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    1. Huawei (Proveedor Claro)
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">
                  EchoLife EG8145V5 · ONT Fibra
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.2 bg-red-950/80 text-red-300 rounded border border-red-900/60 font-semibold">
                    192.168.100.1
                  </span>
                  <span className="text-neutral-500">Claro Hogar</span>
                </div>
              </div>
            </div>

            {currentRouterId === 'huawei-claro' && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-[#DA291C] bg-red-950/90 px-2 py-0.5 rounded-full border border-red-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#DA291C] animate-ping"></span>
                <span>Activo</span>
              </div>
            )}
          </button>

          {/* ICON 2: TP-Link */}
          <button
            type="button"
            onClick={() => onSelectRouter('tp-link')}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
              currentRouterId === 'tp-link'
                ? 'bg-neutral-900 border-[#008e9b] ring-2 ring-[#008e9b]/50 shadow-lg'
                : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Distinctive Icon 2 Badge */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                  currentRouterId === 'tp-link'
                    ? 'bg-[#008e9b]'
                    : 'bg-neutral-800 text-neutral-300 group-hover:bg-[#008e9b] group-hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Radio className="w-5 h-5 mb-0.5" />
                  <span className="text-[8px] font-mono leading-none">2</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    2. TP-Link (Archer / SOHO)
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">
                  Archer C6 / AX · Neutro Gigabit
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.2 bg-teal-950/80 text-teal-300 rounded border border-teal-900/60 font-semibold">
                    192.168.0.1
                  </span>
                  <span className="text-neutral-500">Fibra / WAN</span>
                </div>
              </div>
            </div>

            {currentRouterId === 'tp-link' && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-[#008e9b] bg-teal-950/90 px-2 py-0.5 rounded-full border border-teal-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#008e9b] animate-ping"></span>
                <span>Activo</span>
              </div>
            )}
          </button>

          {/* ICON 3: HGU de Movistar */}
          <button
            type="button"
            onClick={() => onSelectRouter('movistar-hgu')}
            className={`p-3 rounded-xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
              currentRouterId === 'movistar-hgu'
                ? 'bg-neutral-900 border-[#019DF4] ring-2 ring-[#019DF4]/50 shadow-lg'
                : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/80'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Distinctive Icon 3 Badge */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white shrink-0 shadow-sm transition-transform group-hover:scale-105 ${
                  currentRouterId === 'movistar-hgu'
                    ? 'bg-[#019DF4]'
                    : 'bg-neutral-800 text-neutral-300 group-hover:bg-[#019DF4] group-hover:text-white'
                }`}
              >
                <div className="flex flex-col items-center">
                  <Wifi className="w-5 h-5 mb-0.5" />
                  <span className="text-[8px] font-mono leading-none">3</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    3. HGU de Movistar
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 truncate">
                  Smart WiFi · GPT-2541GNAC
                </p>
                <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono">
                  <span className="px-1.5 py-0.2 bg-blue-950/80 text-blue-300 rounded border border-blue-900/60 font-semibold">
                    192.168.1.1
                  </span>
                  <span className="text-neutral-500">Movistar Fibra</span>
                </div>
              </div>
            </div>

            {currentRouterId === 'movistar-hgu' && (
              <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold text-[#019DF4] bg-blue-950/90 px-2 py-0.5 rounded-full border border-blue-800">
                <span className="w-1.5 h-1.5 rounded-full bg-[#019DF4] animate-ping"></span>
                <span>Activo</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
