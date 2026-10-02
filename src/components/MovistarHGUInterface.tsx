import React, { useState } from 'react';
import { 
  Wifi, 
  Shield, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Sparkles, 
  CheckCircle, 
  RefreshCw, 
  QrCode, 
  Lock, 
  Zap, 
  Radio, 
  Settings2,
  ChevronRight,
  HelpCircle,
  Filter,
  Plus,
  Trash2,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { RouterConfig, MacFilterRule } from '../types';
import { evaluatePasswordStrength, generateRandomStrongPassword } from '../utils/wifiQR';

interface MovistarHGUProps {
  router: RouterConfig;
  onUpdateRouter: (updated: RouterConfig) => void;
  onResetDefaults: () => void;
  onOpenSticker: () => void;
  onOpenWiFiCard: () => void;
}

export const MovistarHGUInterface: React.FC<MovistarHGUProps> = ({
  router,
  onUpdateRouter,
  onResetDefaults,
  onOpenSticker,
  onOpenWiFiCard,
}) => {
  const [viewMode, setViewMode] = useState<'basic' | 'advanced'>('basic');
  const [basicSubTab, setBasicSubTab] = useState<'wifi' | 'macfilter'>('wifi');

  // Form states
  const [ssid24, setSsid24] = useState(router.wifi24.ssid);
  const [pass24, setPass24] = useState(router.wifi24.password);
  const [enable24, setEnable24] = useState(router.wifi24.enabled);

  const [ssid5, setSsid5] = useState(router.wifi5.ssid);
  const [pass5, setPass5] = useState(router.wifi5.password);
  const [enable5, setEnable5] = useState(router.wifi5.enabled);

  // MAC Filter states
  const [macEnabled, setMacEnabled] = useState(router.macFilter?.enabled ?? false);
  const [macMode, setMacMode] = useState<'whitelist' | 'blacklist'>(router.macFilter?.mode ?? 'whitelist');
  const [macRules, setMacRules] = useState<MacFilterRule[]>(router.macFilter?.rules ?? []);
  const [newMacAddress, setNewMacAddress] = useState('');
  const [newMacDesc, setNewMacDesc] = useState('');
  const [macError, setMacError] = useState<string | null>(null);

  const [samePassword, setSamePassword] = useState(true);

  const [showPass24, setShowPass24] = useState(false);
  const [showPass5, setShowPass5] = useState(false);

  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  const strength24 = evaluatePasswordStrength(pass24);
  const strength5 = evaluatePasswordStrength(pass5);

  const handleApply = () => {
    setIsApplying(true);
    setApplySuccess(false);

    setTimeout(() => {
      setIsApplying(false);
      setApplySuccess(true);

      const finalPass5 = samePassword ? pass24 : (pass5 || router.wifi5.password);

      const updated: RouterConfig = {
        ...router,
        wifi24: {
          ...router.wifi24,
          ssid: ssid24.trim() || router.wifi24.ssid,
          password: pass24 || router.wifi24.password,
          enabled: enable24,
        },
        wifi5: {
          ...router.wifi5,
          ssid: ssid5.trim() || router.wifi5.ssid,
          password: finalPass5,
          enabled: enable5,
        },
        macFilter: {
          enabled: macEnabled,
          mode: macMode,
          rules: macRules,
        },
      };
      onUpdateRouter(updated);

      setTimeout(() => setApplySuccess(false), 4000);
    }, 1300);
  };

  const handleAddMacRule = (macToAdd?: string, descToAdd?: string) => {
    const targetMac = (macToAdd || newMacAddress).trim().toUpperCase();
    const targetDesc = (descToAdd || newMacDesc).trim() || 'Dispositivo Movistar';

    const macRegex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i;
    if (!macRegex.test(targetMac)) {
      setMacError('Formato MAC inválido. Usa el estándar XX:XX:XX:XX:XX:XX');
      return;
    }

    if (macRules.some((r) => r.mac.toUpperCase() === targetMac)) {
      setMacError('Esta dirección MAC ya está en la lista de Movistar.');
      return;
    }

    const newRule: MacFilterRule = {
      id: `mov-mac-${Date.now()}`,
      mac: targetMac,
      description: targetDesc,
      enabled: true,
    };

    setMacRules([...macRules, newRule]);
    setNewMacAddress('');
    setNewMacDesc('');
    setMacError(null);
  };

  const handleDeleteMacRule = (id: string) => {
    setMacRules(macRules.filter((r) => r.id !== id));
  };

  const handleToggleMacRule = (id: string) => {
    setMacRules(
      macRules.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleGeneratePass = (band: '2.4' | '5') => {
    const p = generateRandomStrongPassword();
    if (band === '2.4' || samePassword) {
      setPass24(p);
      setShowPass24(true);
      if (samePassword) {
        setPass5(p);
        setShowPass5(true);
      }
    } else {
      setPass5(p);
      setShowPass5(true);
    }
  };

  return (
    <div className="bg-[#f4f7f9] text-neutral-800 font-sans min-h-[640px] flex flex-col select-text">
      {/* Movistar Blue Brand Bar */}
      <header className="bg-[#0b2746] text-white border-b-4 border-[#019DF4] px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* Movistar 'M' Icon */}
            <div className="w-8 h-8 rounded-full bg-[#019DF4] flex items-center justify-center font-black text-xl text-white shadow-xs">
              M
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                Movistar Smart WiFi
                <span className="text-[10px] font-normal text-blue-200">| GPT-2541GNAC (HGU)</span>
              </h1>
              <p className="text-[11px] text-blue-300">Gestor Simplificado de Fibra Óptica</p>
            </div>
          </div>
        </div>

        {/* View Mode Toggle & Reset */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex bg-neutral-900/60 p-0.5 rounded-lg border border-blue-900/50">
            <button
              onClick={() => setViewMode('basic')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'basic' ? 'bg-[#019DF4] text-white shadow-xs' : 'text-blue-200 hover:text-white'
              }`}
            >
              Configuración Básica
            </button>
            <button
              onClick={() => setViewMode('advanced')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                viewMode === 'advanced' ? 'bg-[#019DF4] text-white shadow-xs' : 'text-blue-200 hover:text-white'
              }`}
            >
              Modo Avanzado
            </button>
          </div>

          <button
            onClick={onResetDefaults}
            className="text-xs text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
            title="Restablecer de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Valores originales</span>
          </button>
        </div>
      </header>

      {/* Simulated HGU Physical Front LEDs */}
      <div className="bg-[#121c29] text-neutral-300 px-6 py-2 border-b border-neutral-800 flex items-center justify-between text-[11px]">
        <span className="text-neutral-400 font-medium">Luces LED frontales del Router HGU:</span>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5" title="Conexión a Internet OK">
            <span className="w-2.5 h-2.5 rounded-full bg-[#019DF4] shadow-[0_0_8px_#019DF4]"></span>
            <span className="text-neutral-200 font-mono">Internet</span>
          </div>
          <div className="flex items-center gap-1.5" title="Telefonía fija activa">
            <span className="w-2.5 h-2.5 rounded-full bg-[#019DF4] shadow-[0_0_8px_#019DF4]"></span>
            <span className="text-neutral-200 font-mono">Voz IP</span>
          </div>
          <div className="flex items-center gap-1.5" title="Red 2.4 GHz emitiendo">
            <span className="w-2.5 h-2.5 rounded-full bg-[#019DF4] shadow-[0_0_8px_#019DF4]"></span>
            <span className="text-neutral-200 font-mono">WiFi</span>
          </div>
          <div className="flex items-center gap-1.5" title="Red 5 GHz emitiendo">
            <span className="w-2.5 h-2.5 rounded-full bg-[#019DF4] shadow-[0_0_8px_#019DF4]"></span>
            <span className="text-neutral-200 font-mono">WiFi+ (5GHz)</span>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <main className="flex-1 p-5 md:p-8 max-w-5xl mx-auto w-full">
        {/* Alerts / Feedback */}
        {isApplying && (
          <div className="mb-5 bg-blue-50 border border-blue-300 rounded-xl p-4 flex items-center gap-3 text-xs text-blue-900 font-medium shadow-xs">
            <RefreshCw className="w-5 h-5 animate-spin text-[#019DF4] shrink-0" />
            <div>
              <strong className="block">Aplicando nueva configuración en el Router Smart WiFi...</strong>
              <span>Los módulos de radio 2.4G y 5G se están reiniciando. No desconectes el router de la corriente.</span>
            </div>
          </div>
        )}

        {applySuccess && (
          <div className="mb-5 bg-emerald-50 border border-emerald-300 rounded-xl p-4 flex items-center gap-3 text-xs text-emerald-900 font-medium shadow-xs animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <strong className="block">¡Cambios guardados con éxito en tu HGU Movistar!</strong>
              <span>Recuerda conectar tus teléfonos, tablets y ordenadores con la nueva clave.</span>
            </div>
          </div>
        )}

        {viewMode === 'basic' ? (
          <div className="space-y-6">
            {/* Top helper banner */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 tracking-tight">
                  Personalización de tus Redes Wi-Fi Movistar
                </h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Cambia el nombre y la clave de acceso para proteger tu conexión de fibra óptica.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={onOpenWiFiCard}
                  className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-[#019DF4] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-blue-200"
                >
                  <QrCode className="w-4 h-4" />
                  Ver Tarjeta y QR
                </button>
                <button
                  type="button"
                  onClick={onOpenSticker}
                  className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-neutral-300"
                >
                  Pegatina del Router
                </button>
              </div>
            </div>

            {/* Subtab Navigation (Redes Wi-Fi vs Filtrado MAC) */}
            <div className="flex bg-neutral-200/80 p-1 rounded-xl max-w-md shadow-inner">
              <button
                type="button"
                onClick={() => setBasicSubTab('wifi')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  basicSubTab === 'wifi' ? 'bg-white text-[#019DF4] shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Wifi className="w-4 h-4" />
                <span>Redes Wi-Fi (SSID y Claves)</span>
              </button>
              <button
                type="button"
                onClick={() => setBasicSubTab('macfilter')}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  basicSubTab === 'macfilter' ? 'bg-white text-[#019DF4] shadow-xs' : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                <Filter className="w-4 h-4" />
                <span>Filtrado MAC Wi-Fi</span>
                {macEnabled && <span className="w-2 h-2 rounded-full bg-emerald-500"></span>}
              </button>
            </div>

            {/* TAB CONTENT: WI-FI NETWORKS */}
            {basicSubTab === 'wifi' && (
              <div className="space-y-6">
                {/* Same password toggle */}
                <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#019DF4]" />
                    <span className="font-semibold text-neutral-800">
                      ¿Quieres usar la misma contraseña para ambas redes (WiFi normal y WiFi Plus)?
                    </span>
                  </div>
                  <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-[#019DF4]">
                    <input
                      type="checkbox"
                      checked={samePassword}
                      onChange={(e) => {
                        setSamePassword(e.target.checked);
                        if (e.target.checked) setPass5(pass24);
                      }}
                      className="rounded text-[#019DF4] focus:ring-[#019DF4] w-4 h-4"
                    />
                    <span>Misma contraseña (Recomendado)</span>
                  </label>
                </div>

                {/* Dual Cards Grid: 2.4GHz & 5GHz */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Card 1: Wi-Fi 2.4 GHz */}
                  <div className="bg-white rounded-2xl border-2 border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#019DF4] flex items-center justify-center font-bold">
                            <Wifi className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-neutral-900">Red Wi-Fi (2.4 GHz)</h3>
                            <span className="text-[11px] text-neutral-400">Mayor cobertura en toda la casa</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enable24}
                            onChange={(e) => setEnable24(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#019DF4]"></div>
                        </label>
                      </div>

                      {/* SSID Name */}
                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-neutral-700 block">Nombre de tu Red (SSID):</label>
                        <input
                          type="text"
                          value={ssid24}
                          onChange={(e) => setSsid24(e.target.value)}
                          maxLength={32}
                          placeholder="MOVISTAR_XXXX"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#019DF4] focus:ring-2 focus:ring-[#019DF4]/20"
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-neutral-700 block">Contraseña de la Red Wi-Fi:</label>
                        <div className="relative">
                          <input
                            type={showPass24 ? 'text' : 'password'}
                            value={pass24}
                            onChange={(e) => {
                              setPass24(e.target.value);
                              if (samePassword) setPass5(e.target.value);
                            }}
                            className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-xl text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-[#019DF4] focus:ring-2 focus:ring-[#019DF4]/20"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass24(!showPass24)}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                          >
                            {showPass24 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>

                        {/* Password Strength */}
                        <div className="pt-1">
                          <div className="flex items-center justify-between text-[11px] mb-1">
                            <span className="text-neutral-500">Nivel de seguridad: <strong className="text-neutral-800">{strength24.label}</strong></span>
                            <button
                              type="button"
                              onClick={() => handleGeneratePass('2.4')}
                              className="text-[#019DF4] font-semibold hover:underline flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3" />
                              Generar aleatoria
                            </button>
                          </div>
                          <div className="grid grid-cols-4 gap-1 h-1.5">
                            {[0, 1, 2, 3].map((i) => (
                              <div
                                key={i}
                                className={`rounded-full ${i <= strength24.score ? strength24.color : 'bg-neutral-200'}`}
                              ></div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
                      <span>Seguridad: WPA2-PSK (AES)</span>
                      <span className="text-[#019DF4] font-semibold">Canal: Auto</span>
                    </div>
                  </div>

                  {/* Card 2: Wi-Fi Plus 5 GHz */}
                  <div className="bg-white rounded-2xl border-2 border-neutral-200 p-5 shadow-xs flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                            <Zap className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-neutral-900">Red Wi-Fi Plus (5 GHz)</h3>
                            <span className="text-[11px] text-neutral-400">Velocidad máxima (hasta 866 Mbps)</span>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={enable5}
                            onChange={(e) => setEnable5(e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#019DF4]"></div>
                        </label>
                      </div>

                      {/* SSID Name 5G */}
                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-neutral-700 block">Nombre de Red Plus (SSID):</label>
                        <input
                          type="text"
                          value={ssid5}
                          onChange={(e) => setSsid5(e.target.value)}
                          maxLength={32}
                          placeholder="MOVISTAR_PLUS_XXXX"
                          className="w-full px-3 py-2 border border-neutral-300 rounded-xl text-xs font-mono font-bold focus:outline-none focus:border-[#019DF4] focus:ring-2 focus:ring-[#019DF4]/20"
                        />
                      </div>

                      {/* Password 5G */}
                      <div className="space-y-1 text-xs">
                        <label className="font-bold text-neutral-700 block">Contraseña Wi-Fi Plus:</label>
                        <div className="relative">
                          <input
                            type={showPass5 ? 'text' : 'password'}
                            value={samePassword ? pass24 : pass5}
                            disabled={samePassword}
                            onChange={(e) => setPass5(e.target.value)}
                            className={`w-full px-3 py-2 pr-10 border border-neutral-300 rounded-xl text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-[#019DF4] ${
                              samePassword ? 'bg-neutral-100 text-neutral-600 cursor-not-allowed' : ''
                            }`}
                          />
                          {!samePassword && (
                            <button
                              type="button"
                              onClick={() => setShowPass5(!showPass5)}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                            >
                              {showPass5 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                        </div>

                        {samePassword ? (
                          <p className="text-[11px] text-blue-600 pt-1 font-medium">
                            * Sincronizada automáticamente con la clave de 2.4 GHz
                          </p>
                        ) : (
                          <div className="pt-1">
                            <div className="flex items-center justify-between text-[11px] mb-1">
                              <span className="text-neutral-500">Nivel de seguridad: <strong className="text-neutral-800">{strength5.label}</strong></span>
                              <button
                                type="button"
                                onClick={() => handleGeneratePass('5')}
                                className="text-[#019DF4] font-semibold hover:underline flex items-center gap-1"
                              >
                                <Sparkles className="w-3 h-3" />
                                Generar
                              </button>
                            </div>
                            <div className="grid grid-cols-4 gap-1 h-1.5">
                              {[0, 1, 2, 3].map((i) => (
                                <div
                                  key={i}
                                  className={`rounded-full ${i <= strength5.score ? strength5.color : 'bg-neutral-200'}`}
                                ></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-neutral-100 text-[11px] text-neutral-400 flex items-center justify-between">
                      <span>802.11ac 5 GHz</span>
                      <span className="text-indigo-600 font-semibold">Canal: Auto (48)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: MAC FILTER */}
            {basicSubTab === 'macfilter' && (
              <div className="space-y-5 text-xs">
                {/* Main Switch Card */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <div>
                      <span className="font-bold text-neutral-800 text-sm block">
                        Filtrado de Direcciones MAC en Smart WiFi:
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        Permite restringir qué teléfonos, Smart TVs u ordenadores pueden conectarse al router Movistar.
                      </span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={macEnabled}
                        onChange={(e) => setMacEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#019DF4]"></div>
                    </label>
                  </div>

                  {/* Mode Selector */}
                  <div>
                    <span className="font-bold text-neutral-800 block mb-2">Comportamiento del Filtro:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMacMode('whitelist')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          macMode === 'whitelist'
                            ? 'bg-blue-50/80 border-[#019DF4] ring-1 ring-[#019DF4]'
                            : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-neutral-900 font-bold">Modo Permitir (Lista Blanca)</strong>
                          {macMode === 'whitelist' && (
                            <span className="w-2 h-2 rounded-full bg-[#019DF4]"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Solo los dispositivos agregados podrán conectarse. Máxima protección anti-intrusos.
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMacMode('blacklist')}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          macMode === 'blacklist'
                            ? 'bg-blue-50/80 border-[#019DF4] ring-1 ring-[#019DF4]'
                            : 'bg-neutral-50 border-neutral-200 hover:bg-neutral-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <strong className="text-neutral-900 font-bold">Modo Bloquear (Lista Negra)</strong>
                          {macMode === 'blacklist' && (
                            <span className="w-2 h-2 rounded-full bg-[#019DF4]"></span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500">
                          Bloquea a los dispositivos registrados en la lista, permitiendo el resto.
                        </p>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Add Rule Card */}
                <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
                  <span className="font-bold text-neutral-800 text-sm block">Añadir Dispositivo a Movistar HGU:</span>

                  {macError && (
                    <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2 text-[11px]">
                      <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{macError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      value={newMacAddress}
                      onChange={(e) => setNewMacAddress(e.target.value)}
                      placeholder="XX:XX:XX:XX:XX:XX"
                      className="px-3 py-2 border border-neutral-300 rounded-xl font-mono text-xs uppercase font-bold focus:outline-none focus:border-[#019DF4]"
                    />
                    <input
                      type="text"
                      value={newMacDesc}
                      onChange={(e) => setNewMacDesc(e.target.value)}
                      placeholder="Nombre del equipo (ej. Móvil Mamá)"
                      className="px-3 py-2 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-[#019DF4]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddMacRule()}
                      className="py-2 px-4 bg-[#019DF4] hover:bg-[#0081ca] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Registrar MAC</span>
                    </button>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-neutral-100 text-[11px]">
                    <span className="text-neutral-500">¿Quieres añadir el móvil simulado?</span>
                    <button
                      type="button"
                      onClick={() => handleAddMacRule('FE:10:92:4A:BC:33', 'Móvil de Prueba del Simulador')}
                      className="text-[#019DF4] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>+ Agregar Móvil Simulado (FE:10:92:4A:BC:33)</span>
                    </button>
                  </div>
                </div>

                {/* Rules Table */}
                <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
                  <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-200 flex items-center justify-between font-bold text-neutral-800">
                    <span>Equipos Registrados ({macRules.length})</span>
                    <span className="text-[11px] text-[#019DF4]">
                      {macEnabled ? `FILTRADO ACTIVO (${macMode.toUpperCase()})` : 'DESACTIVADO'}
                    </span>
                  </div>

                  {macRules.length === 0 ? (
                    <div className="p-6 text-center text-neutral-400">
                      No hay direcciones MAC añadidas.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-200 text-neutral-500 text-[11px]">
                          <th className="py-2.5 px-5 font-semibold">Regla Activa</th>
                          <th className="py-2.5 px-5 font-semibold">Dirección MAC</th>
                          <th className="py-2.5 px-5 font-semibold">Descripción</th>
                          <th className="py-2.5 px-5 font-semibold text-right">Borrar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {macRules.map((rule) => (
                          <tr key={rule.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="py-2.5 px-5">
                              <input
                                type="checkbox"
                                checked={rule.enabled}
                                onChange={() => handleToggleMacRule(rule.id)}
                                className="rounded text-[#019DF4] focus:ring-[#019DF4]"
                              />
                            </td>
                            <td className="py-2.5 px-5 font-mono font-bold text-neutral-900 tabular-nums">
                              {rule.mac}
                            </td>
                            <td className="py-2.5 px-5 text-neutral-700">
                              {rule.description}
                            </td>
                            <td className="py-2.5 px-5 text-right">
                              <button
                                type="button"
                                onClick={() => handleDeleteMacRule(rule.id)}
                                className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                                title="Eliminar"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* Bottom Actions Bar */}
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs flex items-center justify-between">
              <div className="text-xs text-neutral-500">
                Al aplicar los cambios, el router HGU guardará la configuración y se emitirá la nueva señal.
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSsid24(router.wifi24.ssid);
                    setPass24(router.wifi24.password);
                    setSsid5(router.wifi5.ssid);
                    setPass5(router.wifi5.password);
                  }}
                  className="px-4 py-2.5 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-xl text-xs font-semibold transition-colors"
                >
                  Restaurar campos
                </button>
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isApplying || pass24.length < 8}
                  className="px-6 py-2.5 bg-[#019DF4] hover:bg-[#0081ca] disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isApplying ? 'Guardando en Movistar...' : 'Aplicar Cambios'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Advanced Configuration View for MitraStar/Askey */
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs text-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
              <div>
                <h3 className="font-bold text-sm text-neutral-900">Configuración Avanzada del HGU Movistar</h3>
                <p className="text-neutral-500 text-[11px]">Consola técnica de bajo nivel para parámetros avanzados de red</p>
              </div>
              <button
                onClick={() => setViewMode('basic')}
                className="px-3 py-1.5 bg-[#019DF4] text-white rounded-lg font-bold text-xs"
              >
                Volver al modo sencillo
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 font-mono">
                <span className="text-neutral-400 text-[10px] block font-sans">Dirección IP LAN:</span>
                <span className="font-bold text-neutral-800">{router.gatewayIp}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 font-mono">
                <span className="text-neutral-400 text-[10px] block font-sans">Mascara de Subred:</span>
                <span className="font-bold text-neutral-800">{router.subnetMask}</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 font-mono">
                <span className="text-neutral-400 text-[10px] block font-sans">Servidor DHCP:</span>
                <span className="font-bold text-emerald-600">Activo (Rango: .33 a .199)</span>
              </div>
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 space-y-1 font-mono">
                <span className="text-neutral-400 text-[10px] block font-sans">Firmware HGU:</span>
                <span className="font-bold text-neutral-800">{router.firmwareVersion}</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900">
              <span className="font-bold block mb-1">Aviso técnico Movistar:</span>
              <p>
                Los cambios en el modo avanzado requieren conocimientos de redes GPON y VLAN (VLAN 20 para telefonía, VLAN 24 para TV y VLAN 6 para Internet en fibra Movistar).
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Movistar Footer */}
      <footer className="bg-white border-t border-neutral-200 px-6 py-2.5 text-[11px] text-neutral-500 flex justify-between items-center">
        <span>Telefónica de España S.A.U. / Movistar Fibra Óptica</span>
        <span className="font-mono">Puerta de enlace: {router.gatewayIp}</span>
      </footer>
    </div>
  );
};
