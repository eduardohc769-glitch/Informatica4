import React, { useEffect, useState } from 'react';
import { X, Printer, Download, QrCode, Check, Wifi, Shield } from 'lucide-react';
import { RouterConfig } from '../types';
import { generateWifiQRCodeDataUrl } from '../utils/wifiQR';

interface WiFiCardModalProps {
  router: RouterConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const WiFiCardModal: React.FC<WiFiCardModalProps> = ({ router, isOpen, onClose }) => {
  const [qrUrl24, setQrUrl24] = useState<string>('');
  const [qrUrl5, setQrUrl5] = useState<string>('');
  const [activeBand, setActiveBand] = useState<'2.4' | '5'>('2.4');

  useEffect(() => {
    if (!isOpen) return;
    generateWifiQRCodeDataUrl(router.wifi24.ssid, router.wifi24.password, router.wifi24.hideSsid).then((url) => {
      setQrUrl24(url);
    });
    generateWifiQRCodeDataUrl(router.wifi5.ssid, router.wifi5.password, router.wifi5.hideSsid).then((url) => {
      setQrUrl5(url);
    });
  }, [isOpen, router]);

  if (!isOpen) return null;

  const currentSsid = activeBand === '2.4' ? router.wifi24.ssid : router.wifi5.ssid;
  const currentPass = activeBand === '2.4' ? router.wifi24.password : router.wifi5.password;
  const currentQr = activeBand === '2.4' ? qrUrl24 : qrUrl5;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 max-w-md w-full rounded-2xl shadow-2xl overflow-hidden text-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-semibold text-white">Ficha Wi-Fi para Casa o Huéspedes</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Band selector tab */}
          <div className="flex bg-neutral-950 p-1 rounded-xl mb-4 border border-neutral-800">
            <button
              onClick={() => setActiveBand('2.4')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeBand === '2.4' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Banda 2.4 GHz
            </button>
            <button
              onClick={() => setActiveBand('5')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                activeBand === '5' ? 'bg-indigo-600 text-white shadow-sm' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Banda 5 GHz (Rápida)
            </button>
          </div>

          {/* Printable Card */}
          <div className="bg-white text-neutral-900 p-6 rounded-2xl border-2 border-neutral-300 text-center shadow-lg">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Wifi className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">Conéctate a nuestro Wi-Fi</span>
            </div>
            <p className="text-xs text-neutral-500 mb-4">
              Apunta la cámara de tu teléfono al código QR para conectarte automáticamente
            </p>

            {/* QR Code Container */}
            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200 inline-block mb-4">
              {currentQr ? (
                <img
                  src={currentQr}
                  alt={`Código QR para Wi-Fi ${currentSsid}`}
                  className="w-48 h-48 mx-auto"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-neutral-400 text-xs">
                  Generando código QR...
                </div>
              )}
            </div>

            {/* Network credentials summary */}
            <div className="bg-neutral-100 p-3 rounded-xl text-left text-xs space-y-1.5 font-mono">
              <div className="flex justify-between items-center border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-sans">Nombre de Red (SSID):</span>
                <span className="font-bold text-neutral-900 truncate max-w-[180px]">{currentSsid}</span>
              </div>
              <div className="flex justify-between items-center border-b border-neutral-200 pb-1">
                <span className="text-neutral-500 font-sans">Contraseña:</span>
                <span className="font-bold text-indigo-700 tracking-wider select-all">{currentPass}</span>
              </div>
              <div className="flex justify-between items-center pt-0.5">
                <span className="text-neutral-500 font-sans">Seguridad:</span>
                <span className="text-neutral-700 font-sans font-semibold">WPA2-PSK (AES)</span>
              </div>
            </div>

            <div className="mt-3 text-[10px] text-neutral-400">
              Router: {router.brand} · {router.model}
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400">Compatible con Android y iPhone</span>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Imprimir Tarjeta
          </button>
        </div>
      </div>
    </div>
  );
};
