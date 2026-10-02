import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  ShieldAlert, 
  Search, 
  Globe, 
  CornerDownLeft, 
  Tag,
  Home,
  CheckCircle2,
  X
} from 'lucide-react';
import { RouterConfig } from '../types';

interface BrowserAddressBarProps {
  router: RouterConfig;
  currentAddress: string;
  onNavigate: (ipOrUrl: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
  onGoHome: () => void;
  onOpenSticker: () => void;
  isLoggedIn: boolean;
}

export const BrowserAddressBar: React.FC<BrowserAddressBarProps> = ({
  router,
  currentAddress,
  onNavigate,
  onRefresh,
  isRefreshing = false,
  onGoHome,
  onOpenSticker,
  isLoggedIn,
}) => {
  const [inputValue, setInputValue] = useState(currentAddress);

  useEffect(() => {
    setInputValue(currentAddress);
  }, [currentAddress]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate(inputValue.trim());
  };

  return (
    <div className="bg-neutral-900 border-b border-neutral-700/80 px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs select-none">
      {/* Browser Controls */}
      <div className="flex items-center gap-1.5 text-neutral-400">
        <button
          onClick={onGoHome}
          className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white flex items-center gap-1 transition-colors text-xs font-semibold"
          title="Regresar a la selección de los 3 routers"
        >
          <Home className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden md:inline">Elegir Router</span>
        </button>

        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg hover:bg-neutral-800 text-neutral-300 hover:text-white transition-colors"
          title="Recargar página"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>
      </div>

      {/* Interactive Address Bar Form where Student Types the IP */}
      <form onSubmit={handleSubmit} className="flex-1 min-w-[200px] flex items-center gap-1">
        <div className="flex-1 bg-neutral-950 border border-neutral-800 focus-within:border-indigo-500 rounded-lg px-2.5 py-1.5 flex items-center gap-2 font-mono text-neutral-200 transition-colors">
          <div className="flex items-center gap-1 text-neutral-500 text-[11px] shrink-0">
            <Globe className="w-3.5 h-3.5 text-neutral-400" />
            <span className="hidden sm:inline">http://</span>
          </div>

          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Escribe la IP de ${router.brand} (ej. 192.168.x.x)...`}
            className="flex-1 bg-transparent border-none text-white text-xs font-mono font-bold focus:outline-none placeholder-neutral-600 tracking-wide"
            autoFocus={!currentAddress}
          />

          {inputValue && (
            <button
              type="button"
              onClick={() => setInputValue('')}
              className="text-neutral-500 hover:text-neutral-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <span>Ir</span>
          <CornerDownLeft className="w-3 h-3" />
        </button>
      </form>

      {/* Quick Sticker Hint Helper for Students */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onOpenSticker}
          className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors border border-neutral-700"
          title="¿No recuerdas la IP? Consulta la etiqueta del router"
        >
          <Tag className="w-3 h-3 text-amber-400" />
          <span className="hidden lg:inline">¿Cuál es la IP?</span>
          <span className="lg:hidden">Pegatina</span>
        </button>

        {isLoggedIn && (
          <div className="hidden sm:flex items-center gap-1.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 px-2 py-0.5 rounded text-[10px] font-bold font-mono">
            <CheckCircle2 className="w-3 h-3" />
            <span>SESIÓN INICIADA</span>
          </div>
        )}
      </div>
    </div>
  );
};
