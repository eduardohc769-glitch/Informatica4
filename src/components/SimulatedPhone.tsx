import React, { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  Lock, 
  Check, 
  X, 
  RefreshCw, 
  Smartphone, 
  Eye, 
  EyeOff, 
  Signal, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { RouterConfig } from '../types';

interface SimulatedPhoneProps {
  router: RouterConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const SimulatedPhone: React.FC<SimulatedPhoneProps> = ({ router, isOpen, onClose }) => {
  const [selectedNetwork, setSelectedNetwork] = useState<string | null>(null);
  const [typedPassword, setTypedPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNetwork, setConnectedNetwork] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  if (!isOpen) return null;

  // Build list of discoverable Wi-Fi networks
  const networks = [
    {
      ssid: router.wifi24.ssid,
      band: '2.4 GHz',
      hidden: router.wifi24.hideSsid,
      security: router.wifi24.securityMode,
      correctPassword: router.wifi24.password,
      signal: 95,
      isTarget: true,
    },
    {
      ssid: router.wifi5.ssid,
      band: '5 GHz',
      hidden: router.wifi5.hideSsid,
      security: router.wifi5.securityMode,
      correctPassword: router.wifi5.password,
      signal: 88,
      isTarget: true,
    },
    // Realistic neighborhood networks
    {
      ssid: 'Vecino_Familia_Perez',
      band: '2.4 GHz',
      hidden: false,
      security: 'WPA2-PSK',
      correctPassword: 'unknown',
      signal: 45,
      isTarget: false,
    },
    {
      ssid: 'Fibra_Optica_Invitados_5G',
      band: '5 GHz',
      hidden: false,
      security: 'WPA2-PSK',
      correctPassword: 'unknown',
      signal: 32,
      isTarget: false,
    },
  ].filter((net) => !net.hidden);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 700);
  };

  const handleConnect = () => {
    if (!selectedNetwork) return;
    setConnectError(null);
    setIsConnecting(true);

    const targetNet = networks.find((n) => n.ssid === selectedNetwork);

    setTimeout(() => {
      setIsConnecting(false);
      if (!targetNet || !targetNet.isTarget) {
        setConnectError('Error de autenticación. Clave incorrecta para esta red vecina.');
        return;
      }

      if (typedPassword === targetNet.correctPassword) {
        // Check MAC Filtering if enabled on target router
        if (router.macFilter && router.macFilter.enabled) {
          const phoneMac = 'FE:10:92:4A:BC:33';
          const isRulePresent = router.macFilter.rules.some(
            (r) => r.mac.toUpperCase() === phoneMac && r.enabled
          );

          if (router.macFilter.mode === 'whitelist') {
            if (!isRulePresent) {
              setConnectError(
                'Acceso denegado: El Filtrado MAC está activo en Modo Lista Blanca y la dirección MAC de este móvil (FE:10:92:4A:BC:33) no está registrada como autorizada en el router.'
              );
              return;
            }
          } else if (router.macFilter.mode === 'blacklist') {
            if (isRulePresent) {
              setConnectError(
                'Conexión bloqueada: El Filtrado MAC está activo en Modo Lista Negra y la dirección MAC de este móvil (FE:10:92:4A:BC:33) ha sido bloqueada en el router.'
              );
              return;
            }
          }
        }

        setConnectedNetwork(targetNet.ssid);
        setSelectedNetwork(null);
        setTypedPassword('');
      } else {
        setConnectError(`Contraseña incorrecta para "${targetNet.ssid}". Verifica la clave configurada en el router.`);
      }
    }, 1200);
  };

  const handleDisconnect = () => {
    setConnectedNetwork(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-700 max-w-sm w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[650px] relative text-neutral-100">
        {/* Phone Notch / Status bar */}
        <div className="bg-neutral-950 px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-mono text-neutral-400 border-b border-neutral-800">
          <span>09:41</span>
          <div className="w-20 h-4 bg-neutral-800 rounded-full mx-auto -mt-1"></div>
          <div className="flex items-center gap-1.5">
            {connectedNetwork ? (
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-neutral-500" />
            )}
            <Signal className="w-3.5 h-3.5" />
            <span>100%</span>
          </div>
        </div>

        {/* Header with Close */}
        <div className="px-4 py-3 bg-neutral-900/90 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white">Prueba en Teléfono Móvil</h4>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hardware MAC and Filter Status Banner */}
        <div className="px-4 py-2 bg-neutral-950 border-b border-neutral-800/80 text-[10px] flex items-center justify-between font-mono">
          <div className="text-neutral-400">
            <span>MAC: </span>
            <span className="font-bold text-neutral-200">FE:10:92:4A:BC:33</span>
          </div>
          <div>
            {router.macFilter?.enabled ? (
              <span className="px-1.5 py-0.2 bg-amber-950/70 border border-amber-800 text-amber-300 rounded font-semibold">
                Filtro MAC: {router.macFilter.mode === 'whitelist' ? 'Lista Blanca' : 'Lista Negra'}
              </span>
            ) : (
              <span className="text-neutral-500">Filtro MAC: Inactivo</span>
            )}
          </div>
        </div>

        {/* Content View */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Active Connection Card */}
          {connectedNetwork ? (
            <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 text-center">
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h5 className="font-bold text-white text-base truncate">{connectedNetwork}</h5>
              <p className="text-xs text-emerald-400 mb-3">Conectado y con acceso a Internet</p>
              
              <div className="bg-neutral-950/60 rounded-xl p-2.5 text-[11px] text-neutral-300 font-mono space-y-1 mb-3 text-left">
                <div className="flex justify-between">
                  <span className="text-neutral-500">IP asignada (DHCP):</span>
                  <span>192.168.1.108</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Puerta de enlace:</span>
                  <span>{router.gatewayIp}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Velocidad de enlace:</span>
                  <span className="text-emerald-400 font-bold">866 Mbps (Óptima)</span>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="w-full py-1.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200 rounded-lg transition-colors"
              >
                Olvidar esta red / Desconectar
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-neutral-950 p-3 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-neutral-200">Wi-Fi activado</span>
              </div>
              <button
                onClick={handleScan}
                disabled={isScanning}
                className="p-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-300 text-xs flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-indigo-400' : ''}`} />
                <span>Escanear</span>
              </button>
            </div>
          )}

          {/* List of Networks */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                Redes Wi-Fi Disponibles ({networks.length})
              </span>
            </div>

            <div className="space-y-2">
              {networks.map((net) => {
                const isSelected = selectedNetwork === net.ssid;
                const isCurrentConnected = connectedNetwork === net.ssid;

                return (
                  <div
                    key={net.ssid}
                    className={`rounded-xl border transition-all ${
                      isCurrentConnected
                        ? 'bg-emerald-950/20 border-emerald-700/60'
                        : isSelected
                        ? 'bg-neutral-800 border-indigo-500 ring-1 ring-indigo-500'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <button
                      onClick={() => {
                        if (isCurrentConnected) return;
                        setSelectedNetwork(isSelected ? null : net.ssid);
                        setConnectError(null);
                        setTypedPassword('');
                      }}
                      className="w-full p-3 flex items-center justify-between text-left"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Wifi className={`w-4 h-4 shrink-0 ${net.isTarget ? 'text-indigo-400' : 'text-neutral-500'}`} />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white truncate block">
                              {net.ssid}
                            </span>
                            {net.isTarget && (
                              <span className="text-[9px] px-1 py-0.2 bg-indigo-900/60 text-indigo-300 rounded font-semibold shrink-0">
                                Tu Router
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-neutral-400">
                            {net.band} · {net.security}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Lock className="w-3.5 h-3.5 text-neutral-500" />
                        {isCurrentConnected && (
                          <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-700/50">
                            Conectado
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Expand Password Form if selected */}
                    {isSelected && !isCurrentConnected && (
                      <div className="p-3 pt-0 border-t border-neutral-800/80 mt-1 space-y-2">
                        <label className="text-[11px] text-neutral-300 font-medium block">
                          Ingresa la contraseña para conectarte:
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={typedPassword}
                            onChange={(e) => setTypedPassword(e.target.value)}
                            placeholder="Contraseña Wi-Fi..."
                            className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-1.5 pr-8 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-indigo-500 font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        {connectError && (
                          <div className="flex items-start gap-1.5 text-[10px] text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900/60">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>{connectError}</span>
                          </div>
                        )}

                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setSelectedNetwork(null)}
                            className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-xs text-neutral-300 rounded-lg font-medium transition-colors"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={handleConnect}
                            disabled={!typedPassword || isConnecting}
                            className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-xs text-white rounded-lg font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            {isConnecting ? (
                              <>
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                                <span>Verificando...</span>
                              </>
                            ) : (
                              'Conectar'
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 bg-neutral-950 border-t border-neutral-800 text-[11px] text-neutral-400 text-center">
          Cambia el SSID o la clave en el panel del router para probar cómo se actualiza aquí en tiempo real.
        </div>
      </div>
    </div>
  );
};
