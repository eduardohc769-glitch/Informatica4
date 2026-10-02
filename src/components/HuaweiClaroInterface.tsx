import React, { useState } from 'react';
import { 
  Wifi, 
  Shield, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Key, 
  CheckCircle, 
  AlertTriangle, 
  Sliders, 
  Cpu, 
  Network, 
  HardDrive, 
  Sparkles,
  HelpCircle,
  RefreshCw,
  Layers,
  Filter,
  Trash2,
  Plus,
  Smartphone
} from 'lucide-react';
import { RouterConfig, MacFilterRule } from '../types';
import { evaluatePasswordStrength, generateRandomStrongPassword } from '../utils/wifiQR';

interface HuaweiClaroProps {
  router: RouterConfig;
  onUpdateRouter: (updated: RouterConfig) => void;
  onResetDefaults: () => void;
  onOpenSticker: () => void;
}

export const HuaweiClaroInterface: React.FC<HuaweiClaroProps> = ({
  router,
  onUpdateRouter,
  onResetDefaults,
  onOpenSticker,
}) => {
  // Navigation tabs in Huawei ONT
  const [activeMenu, setActiveMenu] = useState<'wlan' | 'macfilter' | 'status' | 'security' | 'system'>('wlan');
  const [activeBandTab, setActiveBandTab] = useState<'2.4G' | '5G'>('2.4G');

  // Form states initialized from props
  const [ssid24, setSsid24] = useState(router.wifi24.ssid);
  const [password24, setPassword24] = useState(router.wifi24.password);
  const [hideSsid24, setHideSsid24] = useState(router.wifi24.hideSsid);
  const [channel24, setChannel24] = useState(router.wifi24.channel);
  const [secMode24, setSecMode24] = useState(router.wifi24.securityMode);

  const [ssid5, setSsid5] = useState(router.wifi5.ssid);
  const [password5, setPassword5] = useState(router.wifi5.password);
  const [hideSsid5, setHideSsid5] = useState(router.wifi5.hideSsid);
  const [channel5, setChannel5] = useState(router.wifi5.channel);
  const [secMode5, setSecMode5] = useState(router.wifi5.securityMode);

  // MAC Filter states
  const [macEnabled, setMacEnabled] = useState(router.macFilter?.enabled ?? false);
  const [macMode, setMacMode] = useState<'whitelist' | 'blacklist'>(router.macFilter?.mode ?? 'whitelist');
  const [macRules, setMacRules] = useState<MacFilterRule[]>(router.macFilter?.rules ?? []);
  const [newMacAddress, setNewMacAddress] = useState('');
  const [newMacDesc, setNewMacDesc] = useState('');
  const [macError, setMacError] = useState<string | null>(null);

  // Visibility toggles
  const [showPass24, setShowPass24] = useState(false);
  const [showPass5, setShowPass5] = useState(false);

  // Applying state
  const [isApplying, setIsApplying] = useState(false);
  const [applyProgress, setApplyProgress] = useState(0);
  const [applySuccess, setApplySuccess] = useState(false);

  // Strength evaluations
  const strength24 = evaluatePasswordStrength(password24);
  const strength5 = evaluatePasswordStrength(password5);

  const handleApply = () => {
    setIsApplying(true);
    setApplyProgress(15);
    setApplySuccess(false);

    const step1 = setTimeout(() => setApplyProgress(55), 500);
    const step2 = setTimeout(() => setApplyProgress(85), 900);
    const step3 = setTimeout(() => {
      setApplyProgress(100);
      setIsApplying(false);
      setApplySuccess(true);

      // Commit to parent state
      const updated: RouterConfig = {
        ...router,
        wifi24: {
          ...router.wifi24,
          ssid: ssid24.trim() || router.wifi24.ssid,
          password: password24 || router.wifi24.password,
          hideSsid: hideSsid24,
          channel: channel24,
          securityMode: secMode24,
        },
        wifi5: {
          ...router.wifi5,
          ssid: ssid5.trim() || router.wifi5.ssid,
          password: password5 || router.wifi5.password,
          hideSsid: hideSsid5,
          channel: channel5,
          securityMode: secMode5,
        },
        macFilter: {
          enabled: macEnabled,
          mode: macMode,
          rules: macRules,
        },
      };
      onUpdateRouter(updated);

      setTimeout(() => setApplySuccess(false), 4000);
    }, 1400);

    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
    };
  };

  const handleAddMacRule = (macToAdd?: string, descToAdd?: string) => {
    const targetMac = (macToAdd || newMacAddress).trim().toUpperCase();
    const targetDesc = (descToAdd || newMacDesc).trim() || 'Dispositivo Wi-Fi';

    // Validate MAC format XX:XX:XX:XX:XX:XX or XX-XX-XX-XX-XX-XX
    const macRegex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i;
    if (!macRegex.test(targetMac)) {
      setMacError('Formato MAC inválido. Usa el formato XX:XX:XX:XX:XX:XX (ej. BC:D1:19:44:88:12)');
      return;
    }

    if (macRules.some((r) => r.mac.toUpperCase() === targetMac)) {
      setMacError('Esta dirección MAC ya está registrada en la lista.');
      return;
    }

    const newRule: MacFilterRule = {
      id: `mac-${Date.now()}`,
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

  const handleGenerateStrong = (band: '2.4' | '5') => {
    const newPass = generateRandomStrongPassword();
    if (band === '2.4') {
      setPassword24(newPass);
      setShowPass24(true);
    } else {
      setPassword5(newPass);
      setShowPass5(true);
    }
  };

  const copySamePassword = () => {
    setPassword5(password24);
    setShowPass5(showPass24);
  };

  return (
    <div className="bg-neutral-100 text-neutral-800 font-sans min-h-[640px] flex flex-col select-text">
      {/* Huawei / Claro Top Red Header */}
      <header className="bg-[#DA291C] text-white px-5 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white text-[#DA291C] px-2.5 py-1 rounded font-black text-sm tracking-tighter uppercase shadow-xs">
            Claro
          </div>
          <div className="border-l border-red-300/40 pl-3">
            <h1 className="text-sm font-bold tracking-tight">HUAWEI EchoLife {router.model}</h1>
            <p className="text-[10px] text-red-100">Portal de Gestión de Fibra Óptica GPON</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <div className="hidden md:flex items-center gap-2 bg-red-800/50 px-2.5 py-1 rounded text-[11px]">
            <span className="text-red-200">Usuario:</span>
            <span className="font-bold">{router.defaultUsername}</span>
          </div>
          <button
            onClick={onResetDefaults}
            className="text-xs text-red-100 hover:text-white underline underline-offset-2 flex items-center gap-1"
            title="Restablecer valores de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Valores de Fábrica</span>
          </button>
        </div>
      </header>

      {/* Main Layout: Left Sidebar + Right Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-56 bg-[#2B2F33] text-neutral-200 p-2 shrink-0 border-r border-neutral-700/50">
          <div className="text-[10px] font-bold text-neutral-400 px-3 py-1.5 uppercase tracking-wider">
            Menú Principal
          </div>
          <nav className="space-y-0.5 text-xs">
            <button
              onClick={() => setActiveMenu('status')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md font-medium text-left transition-colors ${
                activeMenu === 'status' ? 'bg-[#DA291C] text-white font-bold' : 'hover:bg-neutral-700/60 text-neutral-300'
              }`}
            >
              <Cpu className="w-4 h-4 shrink-0" />
              <span>Estado del Dispositivo</span>
            </button>
            <button
              onClick={() => setActiveMenu('wlan')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-left transition-colors ${
                activeMenu === 'wlan' ? 'bg-[#DA291C] text-white font-bold' : 'hover:bg-neutral-700/60 text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 shrink-0" />
                <span>WLAN (Wi-Fi)</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.2 bg-white/20 rounded font-mono font-bold">2.4G/5G</span>
            </button>
            <button
              onClick={() => setActiveMenu('macfilter')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-md font-medium text-left transition-colors ${
                activeMenu === 'macfilter' ? 'bg-[#DA291C] text-white font-bold' : 'hover:bg-neutral-700/60 text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 shrink-0" />
                <span>Filtrado MAC WLAN</span>
              </div>
              {macEnabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              )}
            </button>
            <button
              onClick={() => setActiveMenu('security')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md font-medium text-left transition-colors ${
                activeMenu === 'security' ? 'bg-[#DA291C] text-white font-bold' : 'hover:bg-neutral-700/60 text-neutral-300'
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Seguridad & Firewall</span>
            </button>
            <button
              onClick={() => setActiveMenu('system')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-md font-medium text-left transition-colors ${
                activeMenu === 'system' ? 'bg-[#DA291C] text-white font-bold' : 'hover:bg-neutral-700/60 text-neutral-300'
              }`}
            >
              <HardDrive className="w-4 h-4 shrink-0" />
              <span>Herramientas de Sistema</span>
            </button>
          </nav>

          {/* Quick Helper sticker link */}
          <div className="mt-6 p-3 bg-neutral-800/80 rounded-lg border border-neutral-700 text-xs">
            <span className="text-[11px] font-bold text-neutral-200 block mb-1">Clave de fábrica Claro</span>
            <p className="text-[10px] text-neutral-400 mb-2 leading-relaxed">
              Consulta la contraseña original impresa en la etiqueta física de tu módem.
            </p>
            <button
              onClick={onOpenSticker}
              className="w-full py-1 px-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded text-[10px] font-bold transition-colors"
            >
              Ver etiqueta del equipo
            </button>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 bg-white p-5 md:p-6 overflow-y-auto">
          {/* Notifications */}
          {isApplying && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-xs font-bold text-red-900 mb-1.5">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#DA291C]" />
                  Guardando parámetros en la memoria Flash y reiniciando WLAN...
                </span>
                <span>{applyProgress}%</span>
              </div>
              <div className="w-full bg-red-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#DA291C] h-full transition-all duration-300"
                  style={{ width: `${applyProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {applySuccess && (
            <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-lg p-3 text-xs text-emerald-900 flex items-center gap-2 font-medium animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                ¡Configuración guardada exitosamente! El router Huawei Claro ha emitido los nuevos cambios.
              </span>
            </div>
          )}

          {/* TAB 1: WLAN BASIC SETTINGS */}
          {activeMenu === 'wlan' && (
            <div>
              {/* Breadcrumb & Title */}
              <div className="border-b border-neutral-200 pb-3 mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-[#DA291C]" />
                    Configuración de Red Inalámbrica (WLAN)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Personaliza el nombre de tu red Wi-Fi (SSID) y la contraseña de seguridad WPA2.
                  </p>
                </div>
              </div>

              {/* Band Tabs (2.4G vs 5G) */}
              <div className="flex border-b border-neutral-300 mb-5">
                <button
                  onClick={() => setActiveBandTab('2.4G')}
                  className={`px-5 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                    activeBandTab === '2.4G'
                      ? 'border-[#DA291C] text-[#DA291C] bg-red-50/50'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Configuración Básica 2.4 GHz (Mayor Cobertura)
                </button>
                <button
                  onClick={() => setActiveBandTab('5G')}
                  className={`px-5 py-2.5 text-xs font-bold transition-all border-b-2 -mb-[2px] flex items-center gap-2 ${
                    activeBandTab === '5G'
                      ? 'border-[#DA291C] text-[#DA291C] bg-red-50/50'
                      : 'border-transparent text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  Configuración Básica 5 GHz (Ultra Alta Velocidad)
                </button>
              </div>

              {/* 2.4 GHz Tab Form */}
              {activeBandTab === '2.4G' && (
                <div className="space-y-4 max-w-2xl text-xs">
                  {/* Enable WLAN */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center py-2 border-b border-neutral-100">
                    <span className="font-semibold text-neutral-700">Habilitar WLAN 2.4G:</span>
                    <div className="sm:col-span-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={router.wifi24.enabled}
                          className="rounded text-[#DA291C] focus:ring-[#DA291C]"
                        />
                        <span className="text-neutral-800 font-medium">Activado</span>
                      </label>
                    </div>
                  </div>

                  {/* SSID Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start py-2 border-b border-neutral-100">
                    <div className="mt-2">
                      <span className="font-semibold text-neutral-800 block">Nombre de SSID:</span>
                      <span className="text-[11px] text-neutral-400">Nombre visible del Wi-Fi</span>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <input
                        type="text"
                        value={ssid24}
                        onChange={(e) => setSsid24(e.target.value)}
                        maxLength={32}
                        placeholder="Ej. Claro_MiCasa_2.4G"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-[#DA291C] focus:ring-1 focus:ring-[#DA291C] font-mono text-sm bg-neutral-50 font-bold"
                      />
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <span>Caracteres: {ssid24.length}/32</span>
                        <span className="text-neutral-600 font-medium">Recomendado: Sin espacios raros ni tildes</span>
                      </div>
                    </div>
                  </div>

                  {/* Hide SSID */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center py-2 border-b border-neutral-100">
                    <span className="font-semibold text-neutral-700">Ocultar Transmisión (Hide SSID):</span>
                    <div className="sm:col-span-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hideSsid24}
                          onChange={(e) => setHideSsid24(e.target.checked)}
                          className="rounded text-[#DA291C] focus:ring-[#DA291C]"
                        />
                        <span className="text-neutral-800">Ocultar la red para que no aparezca en búsquedas públicas</span>
                      </label>
                    </div>
                  </div>

                  {/* Authentication Mode */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center py-2 border-b border-neutral-100">
                    <span className="font-semibold text-neutral-700">Modo de Autenticación:</span>
                    <div className="sm:col-span-2">
                      <select
                        value={secMode24}
                        onChange={(e) => setSecMode24(e.target.value as any)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md bg-white text-xs font-medium focus:outline-none focus:border-[#DA291C]"
                      >
                        <option value="WPA2-PSK">WPA2 Pre-SharedKey (Recomendado estándar)</option>
                        <option value="WPA2/WPA3-Personal">WPA2/WPA3-Personal (Máxima compatibilidad y seguridad)</option>
                        <option value="Open">Abierta (Sin clave - No recomendado)</option>
                      </select>
                    </div>
                  </div>

                  {/* WPA PreSharedKey (Password) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start py-2 border-b border-neutral-100">
                    <div className="mt-2">
                      <span className="font-semibold text-neutral-800 block">Clave Precompartida WPA:</span>
                      <span className="text-[11px] text-neutral-400">Contraseña de conexión</span>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <div className="relative">
                        <input
                          type={showPass24 ? 'text' : 'password'}
                          value={password24}
                          onChange={(e) => setPassword24(e.target.value)}
                          placeholder="Mínimo 8 caracteres..."
                          className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md focus:outline-none focus:border-[#DA291C] focus:ring-1 focus:ring-[#DA291C] font-mono text-sm bg-neutral-50 tracking-wider font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass24(!showPass24)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 p-1"
                        >
                          {showPass24 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Password strength bar */}
                      <div className="bg-neutral-100 p-2.5 rounded-lg border border-neutral-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[11px] font-semibold text-neutral-600">
                            Seguridad de la clave: <span className="font-bold text-neutral-900">{strength24.label}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGenerateStrong('2.4')}
                            className="text-[11px] text-[#DA291C] font-semibold hover:underline flex items-center gap-1"
                          >
                            <Sparkles className="w-3 h-3" />
                            Generar contraseña segura
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 h-1.5">
                          {[0, 1, 2, 3].map((idx) => (
                            <div
                              key={idx}
                              className={`rounded-full transition-all ${
                                idx <= strength24.score ? strength24.color : 'bg-neutral-300'
                              }`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 5 GHz Tab Form */}
              {activeBandTab === '5G' && (
                <div className="space-y-4 max-w-2xl text-xs">
                  {/* Enable WLAN 5G */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center py-2 border-b border-neutral-100">
                    <span className="font-semibold text-neutral-700">Habilitar WLAN 5G:</span>
                    <div className="sm:col-span-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          defaultChecked={router.wifi5.enabled}
                          className="rounded text-[#DA291C] focus:ring-[#DA291C]"
                        />
                        <span className="text-neutral-800 font-medium">Activado (802.11a/n/ac)</span>
                      </label>
                    </div>
                  </div>

                  {/* SSID Name 5G */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start py-2 border-b border-neutral-100">
                    <div className="mt-2">
                      <span className="font-semibold text-neutral-800 block">Nombre de SSID 5G:</span>
                      <span className="text-[11px] text-neutral-400">Normalmente termina en _5G o _PLUS</span>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <input
                        type="text"
                        value={ssid5}
                        onChange={(e) => setSsid5(e.target.value)}
                        maxLength={32}
                        placeholder="Ej. Claro_MiCasa_5G"
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:border-[#DA291C] font-mono text-sm bg-neutral-50 font-bold"
                      />
                    </div>
                  </div>

                  {/* WPA PreSharedKey 5G */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start py-2 border-b border-neutral-100">
                    <div className="mt-2">
                      <span className="font-semibold text-neutral-800 block">Clave Precompartida WPA 5G:</span>
                      <span className="text-[11px] text-neutral-400">Contraseña banda 5 GHz</span>
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <div className="relative">
                        <input
                          type={showPass5 ? 'text' : 'password'}
                          value={password5}
                          onChange={(e) => setPassword5(e.target.value)}
                          placeholder="Mínimo 8 caracteres..."
                          className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-md focus:outline-none focus:border-[#DA291C] font-mono text-sm bg-neutral-50 tracking-wider font-bold"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass5(!showPass5)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-800 p-1"
                        >
                          {showPass5 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={copySamePassword}
                          className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 rounded text-[11px] font-medium text-neutral-700"
                        >
                          Usar la misma clave que en 2.4G
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateStrong('5')}
                          className="px-2.5 py-1 text-[#DA291C] hover:bg-red-50 rounded text-[11px] font-semibold flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Generar clave segura
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 pt-4 border-t border-neutral-200 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isApplying || !password24 || password24.length < 8}
                  className="px-6 py-2 bg-[#DA291C] hover:bg-red-700 disabled:opacity-50 text-white rounded font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isApplying ? 'Guardando en Flash...' : 'Aplicar Cambios'}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: FILTRADO MAC WLAN */}
          {activeMenu === 'macfilter' && (
            <div className="space-y-5 max-w-3xl">
              <div className="border-b border-neutral-200 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#DA291C]" />
                    Configuración de Filtrado MAC WLAN (Claro Huawei)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Controla qué dispositivos específicos pueden o no conectarse a la red inalámbrica mediante su dirección física MAC.
                  </p>
                </div>
              </div>

              {/* Main Switch & Mode Card */}
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
                  <div>
                    <span className="font-bold text-neutral-800 text-sm block">Habilitar Filtrado MAC WLAN:</span>
                    <span className="text-[11px] text-neutral-500">
                      Activa o desactiva la restricción de direcciones MAC para todas las bandas Wi-Fi.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={macEnabled}
                      onChange={(e) => setMacEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DA291C]"></div>
                  </label>
                </div>

                {/* Filter Mode Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <span className="font-bold text-neutral-700">Modo de Filtrado:</span>
                  <div className="sm:col-span-2 space-y-2">
                    <div className="flex items-center gap-4">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="claroMacMode"
                          value="whitelist"
                          checked={macMode === 'whitelist'}
                          onChange={() => setMacMode('whitelist')}
                          className="text-[#DA291C] focus:ring-[#DA291C]"
                        />
                        <span className="font-semibold text-neutral-800">
                          Lista Blanca (Permitir)
                        </span>
                      </label>
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="claroMacMode"
                          value="blacklist"
                          checked={macMode === 'blacklist'}
                          onChange={() => setMacMode('blacklist')}
                          className="text-[#DA291C] focus:ring-[#DA291C]"
                        />
                        <span className="font-semibold text-neutral-800">
                          Lista Negra (Bloquear)
                        </span>
                      </label>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      {macMode === 'whitelist'
                        ? '• Lista Blanca: ÚNICAMENTE los dispositivos listados abajo tendrán acceso al Wi-Fi. Todos los demás serán rechazados.'
                        : '• Lista Negra: Los dispositivos en la lista tendrán PROHIBIDO el acceso al Wi-Fi. Cualquier otro podrá conectarse con la clave.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Add New Rule Box */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3 text-xs">
                <span className="font-bold text-neutral-800 text-sm block">Agregar Nueva Dirección MAC:</span>
                
                {macError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2 text-[11px]">
                    <AlertTriangle className="w-4 h-4 text-[#DA291C] shrink-0" />
                    <span>{macError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    value={newMacAddress}
                    onChange={(e) => setNewMacAddress(e.target.value)}
                    placeholder="XX:XX:XX:XX:XX:XX"
                    className="px-3 py-2 border border-neutral-300 rounded-md font-mono text-xs uppercase font-bold focus:outline-none focus:border-[#DA291C]"
                  />
                  <input
                    type="text"
                    value={newMacDesc}
                    onChange={(e) => setNewMacDesc(e.target.value)}
                    placeholder="Nombre del equipo (ej. Tablet Sala)"
                    className="px-3 py-2 border border-neutral-300 rounded-md text-xs focus:outline-none focus:border-[#DA291C]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddMacRule()}
                    className="py-2 px-4 bg-neutral-800 hover:bg-neutral-900 text-white rounded-md font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Agregar a la Lista</span>
                  </button>
                </div>

                {/* Quick Add Simulated Phone MAC button */}
                <div className="pt-1 flex items-center justify-between border-t border-neutral-100 text-[11px]">
                  <span className="text-neutral-500">¿Quieres probar con el móvil del simulador?</span>
                  <button
                    type="button"
                    onClick={() => handleAddMacRule('FE:10:92:4A:BC:33', 'iPhone 15 Pro de Juan (Móvil Simulado)')}
                    className="text-[#DA291C] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>+ Agregar Móvil Simulado (FE:10:92:4A:BC:33)</span>
                  </button>
                </div>
              </div>

              {/* Rules Table */}
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden text-xs">
                <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between">
                  <span className="font-bold text-neutral-800">
                    Direcciones MAC Registradas ({macRules.length})
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Modo actual: <strong className="text-neutral-900 uppercase font-mono">{macMode}</strong>
                  </span>
                </div>

                {macRules.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400 text-xs">
                    No hay direcciones MAC añadidas todavía.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500 text-[11px]">
                        <th className="py-2.5 px-4 font-semibold">Estado</th>
                        <th className="py-2.5 px-4 font-semibold">Dirección MAC</th>
                        <th className="py-2.5 px-4 font-semibold">Descripción</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {macRules.map((rule) => (
                        <tr key={rule.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="py-2.5 px-4">
                            <input
                              type="checkbox"
                              checked={rule.enabled}
                              onChange={() => handleToggleMacRule(rule.id)}
                              className="rounded text-[#DA291C] focus:ring-[#DA291C]"
                            />
                          </td>
                          <td className="py-2.5 px-4 font-mono font-bold text-neutral-900 tabular-nums">
                            {rule.mac}
                          </td>
                          <td className="py-2.5 px-4 text-neutral-700">
                            {rule.description}
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteMacRule(rule.id)}
                              className="text-neutral-400 hover:text-[#DA291C] p-1 transition-colors"
                              title="Eliminar regla"
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

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleApply}
                  disabled={isApplying}
                  className="px-6 py-2.5 bg-[#DA291C] hover:bg-red-700 disabled:opacity-50 text-white rounded font-bold text-xs flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isApplying ? 'Guardando en Flash...' : 'Aplicar Filtrado MAC'}
                </button>
              </div>
            </div>
          )}

          {activeMenu === 'status' && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                Información del Módem ONT Claro
              </h2>
              <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-4 rounded-lg border border-neutral-200 font-mono">
                <div>
                  <span className="text-neutral-500 block text-[11px]">Modelo de Terminal:</span>
                  <span className="font-bold text-neutral-800">{router.model}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Versión de Firmware:</span>
                  <span className="font-bold text-neutral-800">{router.firmwareVersion}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Filtrado MAC:</span>
                  <span className={`font-bold ${macEnabled ? 'text-emerald-600' : 'text-neutral-600'}`}>
                    {macEnabled ? `Habilitado (${macMode.toUpperCase()})` : 'Desactivado'}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[11px]">Puerta de Enlace (LAN IP):</span>
                  <span className="font-bold text-neutral-800">{router.gatewayIp}</span>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'security' && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                Nivel de Seguridad de Firewall
              </h2>
              <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800">Filtrado MAC Wi-Fi:</span>
                  <span className="font-mono font-bold text-neutral-700">
                    {macEnabled ? `Activo en modo ${macMode}` : 'Desactivado'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-neutral-800">Protección Anti-Ataques DoS:</span>
                  <span className="text-emerald-700 font-bold">Habilitado</span>
                </div>
              </div>
            </div>
          )}

          {activeMenu === 'system' && (
            <div className="space-y-4 max-w-2xl text-xs">
              <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-200 pb-2">
                Herramientas del Sistema Huawei
              </h2>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
                <p className="text-neutral-600">
                  Si deseas volver a los valores originales impresos en la etiqueta:
                </p>
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded font-bold text-xs flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Configuración Predeterminada de Fábrica
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Huawei Claro footer status */}
      <footer className="bg-neutral-200 border-t border-neutral-300 px-5 py-2 text-[11px] text-neutral-600 flex justify-between items-center">
        <span>Derechos Reservados © Huawei Technologies Co., Ltd. Proveedor de Servicio: Claro</span>
        <span className="font-mono">IP: {router.gatewayIp} | V5R019C00S105</span>
      </footer>
    </div>
  );
};

