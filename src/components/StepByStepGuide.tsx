import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Laptop, 
  Wifi, 
  Key, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  ArrowLeft,
  Info
} from 'lucide-react';
import { RouterConfig } from '../types';

interface StepByStepGuideProps {
  currentRouter: RouterConfig;
  onOpenSticker: () => void;
  onOpenPhoneSim: () => void;
}

export const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  currentRouter,
  onOpenSticker,
  onOpenPhoneSim,
}) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Paso 1: Conexión física o Wi-Fi inicial',
      icon: Laptop,
      summary: 'Conectar tu PC, móvil o tablet a la red del router',
      content: (
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            Para poder entrar al panel de administración del router, tu dispositivo debe estar conectado directamente a él:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
            <li>
              <strong className="text-white">Opción recomendada (Cable Ethernet):</strong> Conecta un cable de red RJ45 desde el puerto LAN (amarillo) del router al puerto de red de tu ordenador. Esta conexión nunca se cortará al cambiar la clave.
            </li>
            <li>
              <strong className="text-white">Opción por Wi-Fi de fábrica:</strong> Si usas un móvil o portátil sin puerto de red, conéctate a la red Wi-Fi original que viene impresa en la pegatina del router.
            </li>
          </ul>
          <div className="bg-neutral-800/80 p-3 rounded-lg border border-neutral-700 text-xs flex items-center justify-between">
            <span className="text-neutral-300">
              ¿No conoces el nombre o la clave original de tu {currentRouter.brand}?
            </span>
            <button
              onClick={onOpenSticker}
              className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded font-medium text-xs transition-colors shrink-0 ml-3"
            >
              Ver pegatina del equipo
            </button>
          </div>
        </div>
      ),
    },
    {
      title: 'Paso 2: Acceder a la dirección IP en el navegador',
      icon: Wifi,
      summary: 'Abrir Google Chrome, Edge o Firefox y escribir la IP',
      content: (
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            Abre cualquier navegador web y en la <strong className="text-white">barra de direcciones superior</strong> (no en el buscador de Google), escribe la puerta de enlace predeterminada:
          </p>
          <div className="flex items-center gap-3 bg-neutral-950 p-3 rounded-lg border border-neutral-800">
            <span className="text-xs text-neutral-400 font-mono">Dirección IP de este {currentRouter.brand}:</span>
            <code className="text-base font-mono font-bold text-amber-400 px-2 py-0.5 bg-amber-950/40 rounded border border-amber-800/60">
              http://{currentRouter.gatewayIp}
            </code>
          </div>
          <p className="text-xs text-neutral-400">
            * Nota: En los routers de Claro suele ser <span className="text-neutral-200">192.168.100.1</span> o <span className="text-neutral-200">192.168.1.1</span>. En TP-Link suele ser <span className="text-neutral-200">192.168.0.1</span> o <span className="text-neutral-200">tplinkwifi.net</span>. En Movistar HGU es <span className="text-neutral-200">192.168.1.1</span>.
          </p>
        </div>
      ),
    },
    {
      title: 'Paso 3: Iniciar sesión con usuario y contraseña',
      icon: Key,
      summary: 'Ingresar las credenciales de administración del equipo',
      content: (
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            El sistema solicitará credenciales para autorizar cambios. Dependiendo del fabricante:
          </p>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-neutral-400 block mb-1 font-semibold">Usuario típico:</span>
              <span className="text-white font-mono font-bold">{currentRouter.defaultUsername}</span>
            </div>
            <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
              <span className="text-neutral-400 block mb-1 font-semibold">Contraseña habitual:</span>
              <span className="text-emerald-400 font-mono font-bold">{currentRouter.defaultPasswordHint}</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400">
            En routers de operadora como Movistar y Claro, la clave de acceso a la web viene escrita como <em>"Clave de acceso al router"</em> en la pegatina inferior.
          </p>
        </div>
      ),
    },
    {
      title: 'Paso 4: Personalizar Nombre de Red (SSID) y Contraseña',
      icon: ShieldCheck,
      summary: 'Elegir un SSID reconocible y una clave WPA2/WPA3 segura',
      content: (
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            Ve a la sección <strong className="text-white">WLAN</strong>, <strong className="text-white">Inalámbrico</strong> o <strong className="text-white">Wi-Fi</strong>. Los routers modernos tienen doble banda:
          </p>
          <div className="space-y-2">
            <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
              <strong className="text-cyan-400 block mb-0.5">Banda 2.4 GHz (Mayor alcance):</strong>
              Ideal para dispositivos inteligentes (bombillas, enchufes, cámaras) y zonas lejanas de la casa.
            </div>
            <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800 text-xs">
              <strong className="text-indigo-400 block mb-0.5">Banda 5 GHz (Máxima velocidad):</strong>
              Ideal para streaming 4K, consolas de videojuegos, teletrabajo y descargas pesadas cerca del router.
            </div>
          </div>
          <div className="bg-amber-950/20 border border-amber-800/40 p-3 rounded-lg text-xs text-amber-200">
            <strong>Recomendación de seguridad:</strong> Elige siempre cifrado <code className="text-white bg-black/40 px-1 py-0.5 rounded">WPA2-PSK (AES)</code> o <code className="text-white bg-black/40 px-1 py-0.5 rounded">WPA3</code>. Usa una contraseña de al menos 10-14 caracteres con mayúsculas, minúsculas, números y símbolos.
          </div>
        </div>
      ),
    },
    {
      title: 'Paso 5: Habilitar Filtrado MAC (Seguridad Extra)',
      icon: ShieldCheck,
      summary: 'Permitir o denegar dispositivos específicos por su dirección física MAC',
      content: (
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            El <strong className="text-white">Filtrado MAC</strong> es una capa adicional de control que verifica la dirección física única de la tarjeta de red de cada dispositivo:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <strong className="text-emerald-400 block mb-1">Modo Lista Blanca (Whitelist):</strong>
              Solo los dispositivos que registres explícitamente podrán conectarse, aunque otra persona sepa la contraseña.
            </div>
            <div className="p-2.5 bg-neutral-950 rounded-lg border border-neutral-800">
              <strong className="text-rose-400 block mb-1">Modo Lista Negra (Blacklist):</strong>
              Bloquea a intrusos o dispositivos no deseados específicos sin cambiar la clave de los demás.
            </div>
          </div>
          <p className="text-xs text-neutral-400">
            * Puedes probarlo en este simulador agregando la MAC de tu móvil simulado (<code className="text-amber-300 font-mono">FE:10:92:4A:BC:33</code>).
          </p>
        </div>
      ),
    },
    {
      title: 'Paso 6: Guardar, aplicar y reconectar dispositivos',
      icon: RefreshCw,
      summary: 'Confirmar cambios y conectar con las nuevas credenciales',
      content: (
        <div className="space-y-3 text-sm text-neutral-300">
          <p>
            Pulsa el botón <strong className="text-white">Guardar</strong> o <strong className="text-white">Apply</strong>. El router reiniciará brevemente su módulo de radio Wi-Fi (unos 15 a 30 segundos).
          </p>
          <ul className="list-disc pl-5 space-y-1 text-neutral-300 text-xs">
            <li>Si estabas conectado por Wi-Fi, tu teléfono o laptop se desconectará al instante.</li>
            <li>Busca en tu lista de redes el nuevo nombre (SSID) que acabas de configurar.</li>
            <li>Ingresa la nueva contraseña que elegiste y verifica si el filtrado MAC te permite el acceso.</li>
          </ul>
          <div className="pt-2">
            <button
              onClick={onOpenPhoneSim}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              Probar conexión en el móvil simulado
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 shadow-lg">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Info className="w-5 h-5 text-indigo-400" />
            Guía Asistida Paso a Paso
          </h2>
          <p className="text-xs text-neutral-400">
            Aprende el procedimiento estándar para cambiar tu Wi-Fi en {currentRouter.name} ({currentRouter.isp})
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-400">
          <span>Paso {activeStep + 1} de {steps.length}</span>
        </div>
      </div>

      {/* Step Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 py-4">
        {steps.map((st, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          return (
            <button
              key={idx}
              onClick={() => setActiveStep(idx)}
              className={`p-2 rounded-lg text-left transition-all border ${
                isCurrent
                  ? 'border-indigo-500 bg-indigo-950/30 text-white'
                  : isDone
                  ? 'border-neutral-800 bg-neutral-950 text-neutral-300 hover:bg-neutral-800'
                  : 'border-neutral-800/50 bg-neutral-950/40 text-neutral-500 hover:bg-neutral-900'
              }`}
            >
              <div className="flex items-center gap-1.5 mb-1">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className={`w-3.5 h-3.5 shrink-0 ${isCurrent ? 'text-indigo-400 fill-indigo-400/20' : 'text-neutral-600'}`} />
                )}
                <span className="text-[11px] font-bold">Paso {idx + 1}</span>
              </div>
              <p className="text-[10px] line-clamp-1 text-neutral-400">{st.title.split(':')[1]?.trim()}</p>
            </button>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="bg-neutral-950/60 border border-neutral-800/80 rounded-xl p-4 min-h-[220px]">
        <h3 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          {React.createElement(steps[activeStep].icon, { className: 'w-4 h-4 text-indigo-400' })}
          {steps[activeStep].title}
        </h3>
        <p className="text-xs text-neutral-400 mb-3">{steps[activeStep].summary}</p>
        
        {steps[activeStep].content}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
          disabled={activeStep === 0}
          className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="text-xs text-neutral-400">
          Usa los controles del simulador inferior para practicar
        </div>

        <button
          onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
          disabled={activeStep === steps.length - 1}
          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-white rounded-lg flex items-center gap-1.5 transition-colors"
        >
          Siguiente
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
