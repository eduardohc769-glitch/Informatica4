import React from 'react';
import { AlertTriangle, RotateCw, Tag, HelpCircle, ArrowRight } from 'lucide-react';
import { RouterConfig } from '../types';

interface BrowserErrorViewProps {
  router: RouterConfig;
  attemptedUrl: string;
  onAutoFillCorrectIp: () => void;
  onOpenSticker: () => void;
}

export const BrowserErrorView: React.FC<BrowserErrorViewProps> = ({
  router,
  attemptedUrl,
  onAutoFillCorrectIp,
  onOpenSticker,
}) => {
  return (
    <div className="min-h-[580px] bg-white text-neutral-800 font-sans p-8 flex flex-col justify-center items-center text-center">
      <div className="max-w-md w-full">
        {/* Browser dead tab / error icon */}
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-300 flex items-center justify-center text-neutral-500 mx-auto mb-5 shadow-xs">
          <AlertTriangle className="w-8 h-8 text-amber-500" />
        </div>

        <h2 className="text-xl font-bold text-neutral-900 mb-2">
          No se puede acceder a este sitio
        </h2>
        <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
          No se ha podido establecer conexión con <code className="bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-900 font-mono font-bold">{attemptedUrl || 'la IP ingresada'}</code>. Comprueba si la dirección IP escrita corresponde a la puerta de enlace de tu equipo {router.brand}.
        </p>

        <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 text-left text-xs mb-6 space-y-2">
          <span className="font-bold text-neutral-800 block">Sugerencias para el estudiante:</span>
          <ul className="list-disc pl-4 space-y-1 text-neutral-600 text-[11px]">
            <li>Verifica si has escrito bien los puntos y números de la dirección IP.</li>
            <li>
              Para <strong className="text-neutral-900">{router.brand} ({router.isp})</strong>, la IP estándar es{' '}
              <strong className="text-indigo-600 font-mono">{router.gatewayIp}</strong>.
            </li>
            <li>Asegúrate de no incluir espacios ni caracteres adicionales.</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
          <button
            type="button"
            onClick={onAutoFillCorrectIp}
            className="w-full sm:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Cargar IP Correcta ({router.gatewayIp})</span>
          </button>

          <button
            type="button"
            onClick={onOpenSticker}
            className="w-full sm:w-auto px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-neutral-300"
          >
            <Tag className="w-3.5 h-3.5 text-amber-500" />
            <span>Consultar pegatina</span>
          </button>
        </div>

        <div className="mt-8 text-[11px] font-mono text-neutral-400">
          ERR_CONNECTION_REFUSED / IP_NOT_ROUTABLE
        </div>
      </div>
    </div>
  );
};
