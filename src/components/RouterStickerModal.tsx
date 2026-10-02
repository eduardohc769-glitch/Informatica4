import React from 'react';
import { X, QrCode, ShieldAlert, Copy, Check } from 'lucide-react';
import { RouterConfig } from '../types';

interface RouterStickerModalProps {
  router: RouterConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const RouterStickerModal: React.FC<RouterStickerModalProps> = ({ router, isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden text-neutral-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div>
            <h3 className="text-base font-semibold text-white">Etiqueta de Fábrica (Sticker Físico)</h3>
            <p className="text-xs text-neutral-400">
              Ubicada debajo o detrás de tu router {router.brand} ({router.isp})
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sticker Realistic Card */}
        <div className="p-6">
          <div className="bg-[#f8f9fa] text-neutral-900 p-5 rounded-lg border-2 border-neutral-400 font-mono text-xs shadow-inner relative">
            {/* Regulatory logos / Mock barcode */}
            <div className="flex justify-between items-start border-b border-neutral-300 pb-3 mb-3">
              <div>
                <span className="font-bold text-sm tracking-tight block uppercase text-neutral-800">
                  {router.brand} · {router.model}
                </span>
                <span className="text-[10px] text-neutral-500 font-sans">
                  PROVEEDOR: {router.isp} | MADE FOR ISP RESIDENTIAL
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] px-1.5 py-0.5 border border-neutral-400 rounded-sm font-bold">
                  NOM / CE
                </span>
              </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-2 gap-3 text-[11px] mb-4">
              <div className="bg-white p-2 rounded-sm border border-neutral-300">
                <span className="text-neutral-500 text-[10px] block font-sans">IP de Acceso Web:</span>
                <span className="font-bold text-neutral-900">{router.gatewayIp}</span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-neutral-300">
                <span className="text-neutral-500 text-[10px] block font-sans">Usuario / Clave Web:</span>
                <span className="font-bold text-neutral-900">{router.defaultUsername} / {router.defaultPasswordHint.split('/')[0].trim()}</span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-neutral-300">
                <span className="text-neutral-500 text-[10px] block font-sans">SSID 2.4GHz Fábrica:</span>
                <span className="font-bold text-neutral-900 truncate block">{router.wifi24.ssid}</span>
              </div>
              <div className="bg-white p-2 rounded-sm border border-neutral-300">
                <span className="text-neutral-500 text-[10px] block font-sans">SSID 5GHz Fábrica:</span>
                <span className="font-bold text-neutral-900 truncate block">{router.wifi5.ssid}</span>
              </div>
              <div className="col-span-2 bg-amber-50 p-2.5 rounded-sm border border-amber-300 flex items-center justify-between">
                <div>
                  <span className="text-amber-800 text-[10px] block font-sans font-bold">
                    CONTRASEÑA WI-FI DE FÁBRICA (WPA/WPA2 KEY):
                  </span>
                  <span className="font-bold text-sm tracking-wider text-neutral-950">
                    {router.wifi24.password}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(router.wifi24.password)}
                  className="px-2 py-1 bg-white hover:bg-neutral-100 border border-neutral-300 rounded text-[11px] font-sans flex items-center gap-1 transition-colors"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey ? 'Copiada' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Serial and MAC */}
            <div className="border-t border-dashed border-neutral-300 pt-2 flex justify-between items-center text-[10px] text-neutral-600">
              <div>
                <span>S/N: </span>
                <span className="font-bold">{router.serialNumber}</span>
                <span className="ml-2">MAC: </span>
                <span className="font-bold">{router.macAddress}</span>
              </div>
              <div className="w-16 h-4 bg-neutral-800 flex items-center justify-center text-[8px] text-white">
                |||||||||||||||
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2.5 bg-neutral-800/80 p-3 rounded-xl border border-neutral-700/60 text-xs text-neutral-300">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p>
              <strong className="text-white">Consejo técnico:</strong> En los routers de operadora (Claro, Movistar) o neutros (TP-Link), esta información viene impresa en una pegatina plateada o blanca en la base del equipo. Guárdala si alguna vez necesitas restablecer el router con el botón RESET.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
