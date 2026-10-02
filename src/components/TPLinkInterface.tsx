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
  Sliders, 
  Radio, 
  Globe, 
  Users, 
  Settings, 
  HelpCircle,
  ToggleLeft,
  ToggleRight,
  Filter,
  Plus,
  Trash2,
  Smartphone,
  AlertTriangle
} from 'lucide-react';
import { RouterConfig, MacFilterRule } from '../types';
import { evaluatePasswordStrength, generateRandomStrongPassword } from '../utils/wifiQR';

interface TPLinkProps {
  router: RouterConfig;
  onUpdateRouter: (updated: RouterConfig) => void;
  onResetDefaults: () => void;
  onOpenSticker: () => void;
}

export const TPLinkInterface: React.FC<TPLinkProps> = ({
  router,
  onUpdateRouter,
  onResetDefaults,
  onOpenSticker,
}) => {
  const [topTab, setTopTab] = useState<'basic' | 'advanced' | 'quick'>('basic');
  const [activeSideMenu, setActiveSideMenu] = useState<'wireless' | 'macfilter' | 'map' | 'guest' | 'system'>('wireless');

  // Form states
  const [smartConnect, setSmartConnect] = useState(router.dualBandCombined);
  const [ssid24, setSsid24] = useState(router.wifi24.ssid);
  const [pass24, setPass24] = useState(router.wifi24.password);
  const [hide24, setHide24] = useState(router.wifi24.hideSsid);
  const [sec24, setSec24] = useState(router.wifi24.securityMode);

  const [ssid5, setSsid5] = useState(router.wifi5.ssid);
  const [pass5, setPass5] = useState(router.wifi5.password);
  const [hide5, setHide5] = useState(router.wifi5.hideSsid);

  // MAC Filter states
  const [macEnabled, setMacEnabled] = useState(router.macFilter?.enabled ?? false);
  const [macMode, setMacMode] = useState<'whitelist' | 'blacklist'>(router.macFilter?.mode ?? 'whitelist');
  const [macRules, setMacRules] = useState<MacFilterRule[]>(router.macFilter?.rules ?? []);
  const [newMacAddress, setNewMacAddress] = useState('');
  const [newMacDesc, setNewMacDesc] = useState('');
  const [macError, setMacError] = useState<string | null>(null);

  const [showPass24, setShowPass24] = useState(false);
  const [showPass5, setShowPass5] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const strength24 = evaluatePasswordStrength(pass24);
  const strength5 = evaluatePasswordStrength(pass5);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      const updated: RouterConfig = {
        ...router,
        dualBandCombined: smartConnect,
        wifi24: {
          ...router.wifi24,
          ssid: ssid24.trim() || router.wifi24.ssid,
          password: pass24 || router.wifi24.password,
          hideSsid: hide24,
          securityMode: sec24,
        },
        wifi5: {
          ...router.wifi5,
          ssid: smartConnect ? (ssid24.trim() || router.wifi24.ssid) : (ssid5.trim() || router.wifi5.ssid),
          password: smartConnect ? pass24 : (pass5 || router.wifi5.password),
          hideSsid: hide5,
        },
        macFilter: {
          enabled: macEnabled,
          mode: macMode,
          rules: macRules,
        },
      };
      onUpdateRouter(updated);

      setTimeout(() => setSaveSuccess(false), 4000);
    }, 1200);
  };

  const handleAddMacRule = (macToAdd?: string, descToAdd?: string) => {
    const targetMac = (macToAdd || newMacAddress).trim().toUpperCase();
    const targetDesc = (descToAdd || newMacDesc).trim() || 'Dispositivo TP-Link';

    const macRegex = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/i;
    if (!macRegex.test(targetMac)) {
      setMacError('Formato MAC inválido. Usa XX:XX:XX:XX:XX:XX');
      return;
    }

    if (macRules.some((r) => r.mac.toUpperCase() === targetMac)) {
      setMacError('Esta dirección MAC ya está en la lista.');
      return;
    }

    const newRule: MacFilterRule = {
      id: `tp-mac-${Date.now()}`,
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

  const handleGenerateStrong = (target: '2.4' | '5') => {
    const p = generateRandomStrongPassword();
    if (target === '2.4') {
      setPass24(p);
      setShowPass24(true);
      if (smartConnect) {
        setPass5(p);
      }
    } else {
      setPass5(p);
      setShowPass5(true);
    }
  };

  return (
    <div className="bg-[#f0f3f6] text-neutral-800 font-sans min-h-[640px] flex flex-col select-text">
      {/* TP-Link Teal Top Bar */}
      <header className="bg-[#008e9b] text-white px-6 py-2.5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-black text-xl tracking-tight">
            <span className="text-white">tp-link</span>
          </div>
          <span className="text-xs text-teal-100 hidden sm:inline border-l border-teal-400/40 pl-3">
            {router.name} ({router.model})
          </span>
        </div>

        {/* Top Mode Tabs */}
        <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setTopTab('quick')}
            className={`px-3 py-1 rounded transition-colors ${
              topTab === 'quick' ? 'bg-white text-[#008e9b] shadow-xs' : 'text-teal-100 hover:text-white'
            }`}
          >
            Configuración Rápida
          </button>
          <button
            onClick={() => setTopTab('basic')}
            className={`px-3 py-1 rounded transition-colors ${
              topTab === 'basic' ? 'bg-white text-[#008e9b] shadow-xs' : 'text-teal-100 hover:text-white'
            }`}
          >
            Básico
          </button>
          <button
            onClick={() => setTopTab('advanced')}
            className={`px-3 py-1 rounded transition-colors ${
              topTab === 'advanced' ? 'bg-white text-[#008e9b] shadow-xs' : 'text-teal-100 hover:text-white'
            }`}
          >
            Avanzado
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={onResetDefaults}
            className="text-teal-100 hover:text-white flex items-center gap-1 transition-colors"
            title="Restablecer de fábrica"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Reiniciar valores</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left TP-Link Sidebar */}
        <aside className="w-full md:w-60 bg-white border-r border-neutral-200 p-3 shrink-0">
          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveSideMenu('map')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                activeSideMenu === 'map'
                  ? 'bg-teal-50 text-[#008e9b] font-bold border-l-4 border-[#008e9b]'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>Mapa de Red</span>
            </button>
            <button
              onClick={() => setActiveSideMenu('wireless')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                activeSideMenu === 'wireless'
                  ? 'bg-teal-50 text-[#008e9b] font-bold border-l-4 border-[#008e9b]'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Wifi className="w-4 h-4 shrink-0" />
                <span>Inalámbrico</span>
              </div>
              <span className="text-[10px] bg-teal-100 text-[#008e9b] px-1.5 py-0.5 rounded font-bold">2.4G/5G</span>
            </button>
            <button
              onClick={() => setActiveSideMenu('macfilter')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                activeSideMenu === 'macfilter'
                  ? 'bg-teal-50 text-[#008e9b] font-bold border-l-4 border-[#008e9b]'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Filter className="w-4 h-4 shrink-0" />
                <span>Filtro MAC Inalámbrico</span>
              </div>
              {macEnabled && (
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              )}
            </button>
            <button
              onClick={() => setActiveSideMenu('guest')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                activeSideMenu === 'guest'
                  ? 'bg-teal-50 text-[#008e9b] font-bold border-l-4 border-[#008e9b]'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span>Red de Invitados</span>
            </button>
            <button
              onClick={() => setActiveSideMenu('system')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-medium text-left transition-colors ${
                activeSideMenu === 'system'
                  ? 'bg-teal-50 text-[#008e9b] font-bold border-l-4 border-[#008e9b]'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0" />
              <span>Herramientas del Sistema</span>
            </button>
          </nav>

          {/* Sticker card trigger */}
          <div className="mt-8 p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs">
            <span className="font-bold text-neutral-800 block mb-1">¿Olvidaste la clave TP-Link?</span>
            <p className="text-[11px] text-neutral-500 mb-2 leading-relaxed">
              En la base del router TP-Link encontrarás el PIN y contraseña inalámbrica de fábrica.
            </p>
            <button
              onClick={onOpenSticker}
              className="w-full py-1.5 px-2 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 font-semibold rounded text-[11px] transition-colors"
            >
              Ver etiqueta TP-Link
            </button>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 p-5 md:p-6 overflow-y-auto">
          {/* Notifications */}
          {isSaving && (
            <div className="mb-4 bg-teal-50 border border-teal-300 rounded-xl p-3 flex items-center gap-3 text-xs text-teal-900 font-medium">
              <RefreshCw className="w-4 h-4 animate-spin text-[#008e9b] shrink-0" />
              <span>Guardando configuración y actualizando la radio Wi-Fi de TP-Link...</span>
            </div>
          )}

          {saveSuccess && (
            <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center gap-2 text-xs text-emerald-900 font-medium animate-in fade-in">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>¡Configuración guardada exitosamente! Tu red TP-Link está lista.</span>
            </div>
          )}

          {activeSideMenu === 'wireless' && (
            <div className="max-w-3xl space-y-5">
              {/* Header Box */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-[#008e9b]" />
                    Ajustes Inalámbricos TP-Link
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Configura el nombre de red (SSID) y la contraseña de seguridad para 2.4 GHz y 5 GHz.
                  </p>
                </div>
              </div>

              {/* Smart Connect Banner */}
              <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div className="pr-4">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-neutral-800">Smart Connect:</span>
                    <span className="text-[10px] px-1.5 py-0.2 bg-teal-100 text-[#008e9b] rounded font-bold">
                      {smartConnect ? 'Activado' : 'Desactivado'}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Combina las bandas de 2.4 GHz y 5 GHz bajo un mismo nombre de red (SSID) y contraseña. El router asigna automáticamente la mejor banda a cada dispositivo.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmartConnect(!smartConnect)}
                  className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors shrink-0 ${
                    smartConnect ? 'bg-[#008e9b]' : 'bg-neutral-300'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      smartConnect ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  ></div>
                </button>
              </div>

              {/* Band 2.4GHz Card */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <h3 className="font-bold text-sm text-neutral-800">
                      {smartConnect ? 'Red Inalámbrica Única (Smart Connect 2.4G & 5G)' : 'Red Inalámbrica 2.4 GHz'}
                    </h3>
                  </div>
                  <span className="text-[11px] text-neutral-500 font-mono">Banda 802.11b/g/n</span>
                </div>

                {/* SSID Input */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <span className="font-semibold text-neutral-700">Nombre de Red (SSID):</span>
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={ssid24}
                      onChange={(e) => setSsid24(e.target.value)}
                      maxLength={32}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-[#008e9b] focus:ring-1 focus:ring-[#008e9b]"
                    />
                    <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-400">
                      <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600">
                        <input
                          type="checkbox"
                          checked={hide24}
                          onChange={(e) => setHide24(e.target.checked)}
                          className="rounded text-[#008e9b] focus:ring-[#008e9b]"
                        />
                        <span>Ocultar SSID</span>
                      </label>
                      <span>{ssid24.length}/32 caracteres</span>
                    </div>
                  </div>
                </div>

                {/* Security Mode */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                  <span className="font-semibold text-neutral-700">Seguridad:</span>
                  <div className="sm:col-span-2">
                    <select
                      value={sec24}
                      onChange={(e) => setSec24(e.target.value as any)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs bg-white focus:outline-none focus:border-[#008e9b]"
                    >
                      <option value="WPA2-PSK">WPA/WPA2-Personal (Recomendado estándar)</option>
                      <option value="WPA2/WPA3-Personal">WPA2/WPA3-Personal (Avanzado)</option>
                      <option value="Open">Sin seguridad (Abierta)</option>
                    </select>
                  </div>
                </div>

                {/* Password Input */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                  <span className="font-semibold text-neutral-700 mt-2">Contraseña Wi-Fi:</span>
                  <div className="sm:col-span-2 space-y-2">
                    <div className="relative">
                      <input
                        type={showPass24 ? 'text' : 'password'}
                        value={pass24}
                        onChange={(e) => {
                          setPass24(e.target.value);
                          if (smartConnect) setPass5(e.target.value);
                        }}
                        className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-[#008e9b] focus:ring-1 focus:ring-[#008e9b]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass24(!showPass24)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                      >
                        {showPass24 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password evaluation */}
                    <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-neutral-600 font-medium">
                          Fortaleza: <strong className="text-neutral-900">{strength24.label}</strong>
                        </span>
                        <button
                          type="button"
                          onClick={() => handleGenerateStrong('2.4')}
                          className="text-[#008e9b] font-bold hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Generar contraseña fuerte
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1 h-1.5">
                        {[0, 1, 2, 3].map((idx) => (
                          <div
                            key={idx}
                            className={`rounded-full ${
                              idx <= strength24.score ? strength24.color : 'bg-neutral-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Band 5GHz Card (Only visible when Smart Connect is OFF) */}
              {!smartConnect && (
                <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                      <h3 className="font-bold text-sm text-neutral-800">Red Inalámbrica 5 GHz (Rápida)</h3>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-mono">Banda 802.11a/n/ac/ax</span>
                  </div>

                  {/* SSID 5G */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center">
                    <span className="font-semibold text-neutral-700">Nombre de Red (SSID 5G):</span>
                    <div className="sm:col-span-2">
                      <input
                        type="text"
                        value={ssid5}
                        onChange={(e) => setSsid5(e.target.value)}
                        maxLength={32}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-[#008e9b]"
                      />
                      <div className="flex items-center justify-between mt-1 text-[11px] text-neutral-400">
                        <label className="flex items-center gap-1.5 cursor-pointer text-neutral-600">
                          <input
                            type="checkbox"
                            checked={hide5}
                            onChange={(e) => setHide5(e.target.checked)}
                            className="rounded text-[#008e9b]"
                          />
                          <span>Ocultar SSID 5GHz</span>
                        </label>
                        <span>{ssid5.length}/32 caracteres</span>
                      </div>
                    </div>
                  </div>

                  {/* Password 5G */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start">
                    <span className="font-semibold text-neutral-700 mt-2">Contraseña 5 GHz:</span>
                    <div className="sm:col-span-2 space-y-2">
                      <div className="relative">
                        <input
                          type={showPass5 ? 'text' : 'password'}
                          value={pass5}
                          onChange={(e) => setPass5(e.target.value)}
                          className="w-full px-3 py-2 pr-10 border border-neutral-300 rounded-lg text-xs font-mono font-bold tracking-wider focus:outline-none focus:border-[#008e9b]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPass5(!showPass5)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                        >
                          {showPass5 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => {
                            setPass5(pass24);
                            setShowPass5(showPass24);
                          }}
                          className="text-[11px] text-neutral-600 hover:text-neutral-900 underline"
                        >
                          Usar la misma contraseña que en 2.4 GHz
                        </button>
                        <button
                          type="button"
                          onClick={() => handleGenerateStrong('5')}
                          className="text-[11px] text-[#008e9b] font-bold hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          Generar clave segura
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving || pass24.length < 8}
                  className="px-6 py-2 bg-[#008e9b] hover:bg-[#007b86] disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando en TP-Link...' : 'Guardar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSsid24(router.wifi24.ssid);
                    setPass24(router.wifi24.password);
                    setSsid5(router.wifi5.ssid);
                    setPass5(router.wifi5.password);
                  }}
                  className="px-4 py-2 border border-neutral-300 hover:bg-neutral-100 text-neutral-700 rounded-lg font-medium text-xs transition-colors"
                >
                  Descartar
                </button>
              </div>
            </div>
          )}

          {activeSideMenu === 'macfilter' && (
            <div className="max-w-3xl space-y-5 text-xs">
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-neutral-900 flex items-center gap-2">
                    <Filter className="w-5 h-5 text-[#008e9b]" />
                    Filtrado MAC Inalámbrico (TP-Link Wireless MAC Filter)
                  </h2>
                  <p className="text-xs text-neutral-500">
                    Restringe el acceso Wi-Fi permitiendo o denegando dispositivos según su dirección física MAC.
                  </p>
                </div>
              </div>

              {/* Main Switch Card */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div>
                    <span className="font-bold text-neutral-800 text-sm block">
                      Estado del Filtro MAC:
                    </span>
                    <span className="text-[11px] text-neutral-500">
                      Habilitar o inhabilitar la regla de filtrado inalámbrico en 2.4 GHz y 5 GHz.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMacEnabled(!macEnabled)}
                    className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      macEnabled ? 'bg-[#008e9b]' : 'bg-neutral-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        macEnabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                </div>

                {/* Filtering Rule Radio Options */}
                <div>
                  <span className="font-bold text-neutral-800 block mb-2">Reglas de Filtrado:</span>
                  <div className="space-y-2 bg-neutral-50 p-3.5 rounded-lg border border-neutral-200">
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input
                        type="radio"
                        name="tplinkMacMode"
                        value="whitelist"
                        checked={macMode === 'whitelist'}
                        onChange={() => setMacMode('whitelist')}
                        className="mt-0.5 text-[#008e9b] focus:ring-[#008e9b]"
                      />
                      <div>
                        <strong className="text-neutral-900 block">
                          Permitir a las estaciones especificadas en la lista acceder (Lista Blanca)
                        </strong>
                        <span className="text-[11px] text-neutral-500">
                          Solo los equipos que agregues podrán conectarse. El resto quedará bloqueado.
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 cursor-pointer pt-2 border-t border-neutral-200">
                      <input
                        type="radio"
                        name="tplinkMacMode"
                        value="blacklist"
                        checked={macMode === 'blacklist'}
                        onChange={() => setMacMode('blacklist')}
                        className="mt-0.5 text-[#008e9b] focus:ring-[#008e9b]"
                      />
                      <div>
                        <strong className="text-neutral-900 block">
                          Denegar a las estaciones especificadas en la lista acceder (Lista Negra)
                        </strong>
                        <span className="text-[11px] text-neutral-500">
                          Los equipos añadidos no podrán entrar a la red aunque tengan la contraseña.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Add New Rule Form */}
              <div className="bg-white p-5 rounded-xl border border-neutral-200 shadow-xs space-y-3">
                <span className="font-bold text-neutral-800 text-sm block">Agregar Nueva Entrada MAC:</span>

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
                    className="px-3 py-2 border border-neutral-300 rounded-lg font-mono text-xs uppercase font-bold focus:outline-none focus:border-[#008e9b]"
                  />
                  <input
                    type="text"
                    value={newMacDesc}
                    onChange={(e) => setNewMacDesc(e.target.value)}
                    placeholder="Descripción (ej. Portátil Juan)"
                    className="px-3 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-[#008e9b]"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddMacRule()}
                    className="py-2 px-4 bg-[#008e9b] hover:bg-[#007b86] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Añadir Regla</span>
                  </button>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-neutral-100 text-[11px]">
                  <span className="text-neutral-500">Dispositivo de prueba:</span>
                  <button
                    type="button"
                    onClick={() => handleAddMacRule('FE:10:92:4A:BC:33', 'Móvil iPhone Simulado')}
                    className="text-[#008e9b] font-semibold hover:underline flex items-center gap-1"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>+ Agregar Móvil del Simulador (FE:10:92:4A:BC:33)</span>
                  </button>
                </div>
              </div>

              {/* Table of Entries */}
              <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
                <div className="bg-neutral-50 px-4 py-2.5 border-b border-neutral-200 flex items-center justify-between font-bold text-neutral-800">
                  <span>Lista de Filtrado MAC ({macRules.length})</span>
                  <span className="text-[11px] text-[#008e9b]">
                    {macEnabled ? `ACTIVO (${macMode.toUpperCase()})` : 'DESACTIVADO'}
                  </span>
                </div>

                {macRules.length === 0 ? (
                  <div className="p-6 text-center text-neutral-400">
                    No hay direcciones MAC configuradas.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-200 text-neutral-500 text-[11px] bg-neutral-50/50">
                        <th className="py-2.5 px-4 font-semibold">Habilitado</th>
                        <th className="py-2.5 px-4 font-semibold">Dirección MAC</th>
                        <th className="py-2.5 px-4 font-semibold">Descripción</th>
                        <th className="py-2.5 px-4 font-semibold text-right">Modificar</th>
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
                              className="rounded text-[#008e9b] focus:ring-[#008e9b]"
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

              {/* Save Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#008e9b] hover:bg-[#007b86] disabled:opacity-50 text-white rounded-lg font-bold text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Guardando en TP-Link...' : 'Guardar Filtrado MAC'}
                </button>
              </div>
            </div>
          )}

          {activeSideMenu === 'map' && (
            <div className="max-w-2xl bg-white p-5 rounded-xl border border-neutral-200 text-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                Mapa de Red TP-Link
              </h2>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200">
                  <Globe className="w-6 h-6 text-[#008e9b] mx-auto mb-2" />
                  <span className="font-bold block text-neutral-900">Internet</span>
                  <span className="text-[10px] text-emerald-600 font-bold">Conectado (WAN IP OK)</span>
                </div>
                <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200">
                  <Radio className="w-6 h-6 text-[#008e9b] mx-auto mb-2" />
                  <span className="font-bold block text-neutral-900">{router.name}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{router.gatewayIp}</span>
                </div>
                <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200">
                  <Users className="w-6 h-6 text-[#008e9b] mx-auto mb-2" />
                  <span className="font-bold block text-neutral-900">Clientes</span>
                  <span className="text-[10px] text-neutral-500">5 conectados</span>
                </div>
              </div>
            </div>
          )}

          {activeSideMenu === 'guest' && (
            <div className="max-w-2xl bg-white p-5 rounded-xl border border-neutral-200 text-xs space-y-3">
              <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                Red Wi-Fi de Invitados
              </h2>
              <p className="text-neutral-600">
                Permite a tus invitados conectarse a Internet sin darles acceso a tus ordenadores, discos de red o impresoras locales.
              </p>
              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between">
                <span>Estado de Red de Invitados:</span>
                <span className="text-neutral-500 font-bold">Desactivado</span>
              </div>
            </div>
          )}

          {activeSideMenu === 'system' && (
            <div className="max-w-2xl bg-white p-5 rounded-xl border border-neutral-200 text-xs space-y-4">
              <h2 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-2">
                Herramientas del Sistema TP-Link
              </h2>
              <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200 space-y-3">
                <span className="font-bold text-neutral-800 block">Restablecimiento de Fábrica</span>
                <p className="text-neutral-600">
                  Restaura todos los ajustes de configuración a sus valores predeterminados de fábrica.
                </p>
                <button
                  type="button"
                  onClick={onResetDefaults}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-900 text-white rounded-lg font-bold text-xs flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Restaurar Ajustes de Fábrica
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* TP-Link Footer */}
      <footer className="bg-white border-t border-neutral-200 px-6 py-2 text-[11px] text-neutral-500 flex justify-between items-center">
        <span>Copyright © {new Date().getFullYear()} TP-Link Corporation Limited. Todos los derechos reservados.</span>
        <span className="font-mono">Firmware: {router.firmwareVersion}</span>
      </footer>
    </div>
  );
};
