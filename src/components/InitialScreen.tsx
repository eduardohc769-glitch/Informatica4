import React from 'react';
import { RouterId, RouterConfig } from '../types';
import { Server, Radio, Wifi, Tag, ArrowRight, BookOpen, Smartphone, ShieldCheck, HelpCircle } from 'lucide-react';

interface InitialScreenProps {
  routers: Record<RouterId, RouterConfig>;
  onSelectRouter: (id: RouterId) => void;
  onOpenSticker: (id: RouterId) => void;
  onOpenPhoneSim: () => void;
}

export const InitialScreen: React.FC<InitialScreenProps> = ({
  routers,
  onSelectRouter,
  onOpenSticker,
  onOpenPhoneSim,
}) => {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Top Simple Bar */}
      <header className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-neutral-950 rounded-[10px] flex items-center justify-center text-white">
              <Wifi className="w-4 h-4 text-indigo-400" />
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">
              Simulador de Configuración de Routers Wi-Fi
            </h1>
            <p className="text-xs text-neutral-400">
              Laboratorio interactivo para estudiantes y técnicos de redes
            </p>
          </div>
        </div>

        <button
          onClick={onOpenPhoneSim}
          className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
          <span>Móvil de Prueba Wi-Fi</span>
        </button>
      </header>

      {/* Main Focus: The 3 Router Icons */}
      <main className="max-w-5xl mx-auto px-6 py-10 w-full flex-1 flex flex-col justify-center">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase mb-2 block">
            Paso 1: Selecciona el router a configurar
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ¿Qué interfaz de router deseas configurar hoy?
          </h2>
          <p className="text-sm text-neutral-400 mt-2">
            Haz clic en uno de los 3 iconos para abrir el navegador web virtual. Recuerda que deberás ingresar la <strong className="text-neutral-200">dirección IP correcta</strong> en la barra de direcciones para acceder a su pantalla de inicio de sesión.
          </p>
        </div>

        {/* 3 Main Router Icons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* ICONO 1: HUAWEI PROVEEDOR CLARO */}
          <div className="group relative bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 hover:border-[#DA291C] rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(218,41,28,0.2)] flex flex-col justify-between">
            <div>
              {/* Badge Icon 1 */}
              <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 group-hover:border-[#DA291C]/60 flex items-center justify-center text-[#DA291C] mb-5 transition-transform group-hover:scale-110 shadow-md">
                <Server className="w-8 h-8" />
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-red-950/80 text-red-300 border border-red-900/50">
                  Icono 1
                </span>
                <span className="text-xs text-neutral-400 font-medium">Proveedor Claro Hogar</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#DA291C] transition-colors">
                Huawei (Claro)
              </h3>
              <p className="text-xs text-neutral-400 mt-1 mb-4 leading-relaxed">
                Módem ONT de fibra óptica <span className="text-neutral-200 font-medium">Huawei EchoLife EG8145V5</span> con doble banda 2.4G y 5G.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={() => onSelectRouter('huawei-claro')}
                className="w-full py-2.5 px-4 bg-[#DA291C] hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <span>Abrir Navegador Web</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onOpenSticker('huawei-claro')}
                className="w-full py-1.5 px-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver pegatina (IP y Clave de fábrica)</span>
              </button>
            </div>
          </div>

          {/* ICONO 2: TP-LINK */}
          <div className="group relative bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 hover:border-[#008e9b] rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(0,142,155,0.2)] flex flex-col justify-between">
            <div>
              {/* Badge Icon 2 */}
              <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 group-hover:border-[#008e9b]/60 flex items-center justify-center text-[#008e9b] mb-5 transition-transform group-hover:scale-110 shadow-md">
                <Radio className="w-8 h-8" />
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-950/80 text-teal-300 border border-teal-900/50">
                  Icono 2
                </span>
                <span className="text-xs text-neutral-400 font-medium">Router Neutro SOHO</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#008e9b] transition-colors">
                TP-Link
              </h3>
              <p className="text-xs text-neutral-400 mt-1 mb-4 leading-relaxed">
                Router Gigabit inalámbrico <span className="text-neutral-200 font-medium">TP-Link Archer C6</span> con Smart Connect y gestión avanzada.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={() => onSelectRouter('tp-link')}
                className="w-full py-2.5 px-4 bg-[#008e9b] hover:bg-teal-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <span>Abrir Navegador Web</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onOpenSticker('tp-link')}
                className="w-full py-1.5 px-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver pegatina (IP y Clave de fábrica)</span>
              </button>
            </div>
          </div>

          {/* ICONO 3: HGU DE MOVISTAR */}
          <div className="group relative bg-neutral-900/90 hover:bg-neutral-900 border border-neutral-800 hover:border-[#019DF4] rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-[0_0_30px_rgba(1,157,244,0.2)] flex flex-col justify-between">
            <div>
              {/* Badge Icon 3 */}
              <div className="w-16 h-16 rounded-2xl bg-neutral-950 border border-neutral-800 group-hover:border-[#019DF4]/60 flex items-center justify-center text-[#019DF4] mb-5 transition-transform group-hover:scale-110 shadow-md">
                <Wifi className="w-8 h-8" />
              </div>

              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 border border-blue-900/50">
                  Icono 3
                </span>
                <span className="text-xs text-neutral-400 font-medium">Movistar Fibra Óptica</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-[#019DF4] transition-colors">
                HGU de Movistar
              </h3>
              <p className="text-xs text-neutral-400 mt-1 mb-4 leading-relaxed">
                Home Gateway Unit <span className="text-neutral-200 font-medium">Smart WiFi (MitraStar/Askey)</span> con redes WiFi y WiFi Plus 5G.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-neutral-800/80">
              <button
                type="button"
                onClick={() => onSelectRouter('movistar-hgu')}
                className="w-full py-2.5 px-4 bg-[#019DF4] hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer"
              >
                <span>Abrir Navegador Web</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                type="button"
                onClick={() => onOpenSticker('movistar-hgu')}
                className="w-full py-1.5 px-3 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-neutral-400 hover:text-neutral-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Ver pegatina (IP y Clave de fábrica)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Instructive Bottom Tip */}
        <div className="mt-10 p-4 rounded-xl bg-neutral-900/70 border border-neutral-800 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Objetivo del ejercicio:</strong> Entrar a cada router, descubrir su IP y credenciales, cambiar el nombre de red (SSID) y establecer una contraseña segura.
            </span>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="px-6 py-3 border-t border-neutral-800 text-center text-xs text-neutral-500 font-mono">
        Entorno educativo de prácticas de redes e interfaces de usuario
      </footer>
    </div>
  );
};
