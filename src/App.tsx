import React, { useState, useEffect } from 'react';
import { RouterId, RouterConfig } from './types';
import { INITIAL_ROUTERS } from './data/routerDefaults';
import { InitialScreen } from './components/InitialScreen';
import { BrowserAddressBar } from './components/BrowserAddressBar';
import { RouterLoginView } from './components/RouterLoginView';
import { BrowserErrorView } from './components/BrowserErrorView';
import { HuaweiClaroInterface } from './components/HuaweiClaroInterface';
import { TPLinkInterface } from './components/TPLinkInterface';
import { MovistarHGUInterface } from './components/MovistarHGUInterface';
import { RouterStickerModal } from './components/RouterStickerModal';
import { StepByStepGuide } from './components/StepByStepGuide';
import { SimulatedPhone } from './components/SimulatedPhone';
import { WiFiCardModal } from './components/WiFiCardModal';
import { 
  Globe, 
  HelpCircle, 
  Tag, 
  Smartphone, 
  BookOpen, 
  ArrowLeft,
  Search,
  Lock,
  Wifi,
  Sparkles,
  RotateCcw
} from 'lucide-react';

const STORAGE_KEY = 'wifi_router_configs_v2';

type BrowserViewState = 'awaiting_ip' | 'error' | 'login' | 'dashboard';

export default function App() {
  const [routers, setRouters] = useState<Record<RouterId, RouterConfig>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Error reading from localStorage', e);
    }
    return INITIAL_ROUTERS as Record<RouterId, RouterConfig>;
  });

  // Screen view: 'initial' (only 3 icons) or 'browser' (simulated web browser)
  const [screenMode, setScreenMode] = useState<'initial' | 'browser'>('initial');

  // Currently selected router
  const [currentRouterId, setCurrentRouterId] = useState<RouterId>('huawei-claro');

  // Browser navigation state
  const [browserAddress, setBrowserAddress] = useState<string>('');
  const [browserViewState, setBrowserViewState] = useState<BrowserViewState>('awaiting_ip');
  const [attemptedIp, setAttemptedIp] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Modals
  const [showStickerModal, setShowStickerModal] = useState(false);
  const [stickerRouterId, setStickerRouterId] = useState<RouterId>('huawei-claro');
  const [showPhoneSim, setShowPhoneSim] = useState(false);
  const [showWiFiCard, setShowWiFiCard] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(routers));
    } catch (e) {
      console.warn('Error saving to localStorage', e);
    }
  }, [routers]);

  const currentRouter = routers[currentRouterId];
  const stickerRouter = routers[stickerRouterId];

  // When student clicks one of the 3 icons in the initial window
  const handleSelectRouterFromInitial = (id: RouterId) => {
    setCurrentRouterId(id);
    setStickerRouterId(id);
    setScreenMode('browser');
    setBrowserAddress('');
    setAttemptedIp('');
    setBrowserViewState('awaiting_ip');
    setIsLoggedIn(false);
  };

  // Check if IP entered in browser address bar is correct
  const handleNavigateAddress = (input: string) => {
    setAttemptedIp(input);
    setIsRefreshing(true);

    setTimeout(() => {
      setIsRefreshing(false);
      // Clean input: remove http://, https://, trailing slashes, spaces
      const clean = input
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/.*$/, '')
        .trim();

      const expectedIp = currentRouter.gatewayIp;

      // Accepted matching rules per router
      let isMatch = false;
      if (currentRouterId === 'huawei-claro') {
        isMatch = clean === '192.168.100.1' || clean === '192.168.1.1';
      } else if (currentRouterId === 'tp-link') {
        isMatch = clean === '192.168.0.1' || clean === 'tplinkwifi.net' || clean === '192.168.1.1';
      } else if (currentRouterId === 'movistar-hgu') {
        isMatch = clean === '192.168.1.1';
      }

      if (isMatch) {
        setBrowserAddress(input.startsWith('http') ? input : `http://${clean}/`);
        // If not logged in yet, go to login view; if already logged in, show dashboard
        setBrowserViewState(isLoggedIn ? 'dashboard' : 'login');
      } else {
        setBrowserViewState('error');
      }
    }, 400);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setBrowserViewState('dashboard');
  };

  const handleUpdateRouter = (updated: RouterConfig) => {
    setRouters((prev) => ({
      ...prev,
      [updated.id]: updated,
    }));
  };

  const handleResetDefaults = () => {
    setRouters((prev) => ({
      ...prev,
      [currentRouterId]: INITIAL_ROUTERS[currentRouterId],
    }));
  };

  const handleOpenStickerForRouter = (id: RouterId) => {
    setStickerRouterId(id);
    setShowStickerModal(true);
  };

  // If initial screen mode: ONLY show the 3 router icons as requested by user!
  if (screenMode === 'initial') {
    return (
      <>
        <InitialScreen
          routers={routers}
          onSelectRouter={handleSelectRouterFromInitial}
          onOpenSticker={handleOpenStickerForRouter}
          onOpenPhoneSim={() => setShowPhoneSim(true)}
        />

        <RouterStickerModal
          router={stickerRouter}
          isOpen={showStickerModal}
          onClose={() => setShowStickerModal(false)}
        />

        <SimulatedPhone
          router={currentRouter}
          isOpen={showPhoneSim}
          onClose={() => setShowPhoneSim(false)}
        />
      </>
    );
  }

  // BROWSER MODE: The student is now inside the simulated browser
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white">
      {/* Top Context Navigation Bar */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setScreenMode('initial')}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border border-neutral-800 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver a los 3 Iconos</span>
          </button>

          <div className="hidden sm:flex items-center gap-2 border-l border-neutral-800 pl-3">
            <span className="text-xs text-neutral-400">Router seleccionado:</span>
            <span className="text-xs font-bold text-white bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
              {currentRouter.brand} ({currentRouter.model}) - {currentRouter.isp}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              showGuide
                ? 'bg-indigo-600 border-indigo-500 text-white'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guía Paso a Paso</span>
          </button>

          <button
            onClick={() => setShowPhoneSim(true)}
            className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">Probar en</span> Móvil
          </button>
        </div>
      </header>

      {/* Main Browser Canvas */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Optional Guide Drawer */}
        {showGuide && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-200">
            <StepByStepGuide
              currentRouter={currentRouter}
              onOpenSticker={() => setShowStickerModal(true)}
              onOpenPhoneSim={() => setShowPhoneSim(true)}
            />
          </div>
        )}

        {/* Browser Window Frame */}
        <div className="bg-neutral-900 border border-neutral-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col flex-1">
          {/* OS Window Chrome Controls */}
          <div className="bg-neutral-950 px-4 py-2.5 flex items-center justify-between border-b border-neutral-800 select-none">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setScreenMode('initial')}
                  className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block shadow-xs hover:opacity-80"
                  title="Cerrar navegador y volver"
                ></button>
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e] inline-block shadow-xs"></span>
                <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block shadow-xs"></span>
              </div>
              <span className="ml-3 text-xs text-neutral-400 font-medium">
                Navegador Web Virtual — {currentRouter.name}
              </span>
            </div>

            <div className="text-[10px] text-neutral-500 font-mono">
              ESTADO:{' '}
              {browserViewState === 'awaiting_ip' && 'ESPERANDO IP'}
              {browserViewState === 'error' && 'ERROR DE CONEXIÓN'}
              {browserViewState === 'login' && 'INICIO DE SESIÓN'}
              {browserViewState === 'dashboard' && 'PANEL DE CONTROL'}
            </div>
          </div>

          {/* Interactive Address Bar */}
          <BrowserAddressBar
            router={currentRouter}
            currentAddress={browserAddress}
            onNavigate={handleNavigateAddress}
            onRefresh={() => handleNavigateAddress(browserAddress || currentRouter.gatewayIp)}
            isRefreshing={isRefreshing}
            onGoHome={() => setScreenMode('initial')}
            onOpenSticker={() => setShowStickerModal(true)}
            isLoggedIn={isLoggedIn}
          />

          {/* Browser Viewport */}
          <div className="flex-1 bg-white text-neutral-900 min-h-[620px] relative overflow-hidden flex flex-col">
            {isRefreshing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-xs z-30 flex items-center justify-center text-neutral-800 font-medium text-xs">
                Cargando página...
              </div>
            )}

            {/* 1. STATE: AWAITING IP ENTRY */}
            {browserViewState === 'awaiting_ip' && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4 shadow-xs">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900 mb-2">
                  Ingresa la IP de tu {currentRouter.brand}
                </h3>
                <p className="text-xs text-neutral-600 mb-6 leading-relaxed">
                  Para acceder a la consola de administración de este router, debes escribir su{' '}
                  <strong className="text-neutral-900 font-semibold">dirección IP de puerta de enlace</strong> en la barra de direcciones superior y pulsar <strong className="text-neutral-900">Ir</strong> (o presionar Enter).
                </p>

                <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 w-full text-left text-xs mb-6 space-y-2">
                  <span className="font-bold text-neutral-800 block">¿Cómo saber la dirección IP?</span>
                  <p className="text-neutral-600 text-[11px]">
                    En la vida real, los routers tienen una etiqueta adhesiva debajo donde indican la IP de gestión. En este router {currentRouter.brand} suele ser:
                  </p>
                  <div className="flex items-center justify-between bg-white p-2 rounded border border-neutral-200 font-mono text-xs">
                    <span className="text-neutral-500 font-sans">IP típica de {currentRouter.brand}:</span>
                    <button
                      type="button"
                      onClick={() => handleNavigateAddress(currentRouter.gatewayIp)}
                      className="font-bold text-indigo-600 hover:underline"
                    >
                      {currentRouter.gatewayIp}
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleNavigateAddress(currentRouter.gatewayIp)}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                  >
                    <span>Escribir IP automáticamente</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowStickerModal(true)}
                    className="px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-xs font-semibold transition-colors border border-neutral-300"
                  >
                    <Tag className="w-3.5 h-3.5 inline mr-1 text-amber-500" />
                    Consultar pegatina
                  </button>
                </div>
              </div>
            )}

            {/* 2. STATE: INCORRECT IP ERROR SCREEN */}
            {browserViewState === 'error' && (
              <BrowserErrorView
                router={currentRouter}
                attemptedUrl={attemptedIp}
                onAutoFillCorrectIp={() => handleNavigateAddress(currentRouter.gatewayIp)}
                onOpenSticker={() => setShowStickerModal(true)}
              />
            )}

            {/* 3. STATE: ROUTER LOGIN VIEW */}
            {browserViewState === 'login' && (
              <RouterLoginView
                router={currentRouter}
                onLoginSuccess={handleLoginSuccess}
                onOpenSticker={() => setShowStickerModal(true)}
              />
            )}

            {/* 4. STATE: FULL ROUTER CONFIGURATION DASHBOARD */}
            {browserViewState === 'dashboard' && (
              <div className="flex-1 flex flex-col">
                {currentRouterId === 'huawei-claro' && (
                  <HuaweiClaroInterface
                    router={currentRouter}
                    onUpdateRouter={handleUpdateRouter}
                    onResetDefaults={handleResetDefaults}
                    onOpenSticker={() => setShowStickerModal(true)}
                  />
                )}

                {currentRouterId === 'tp-link' && (
                  <TPLinkInterface
                    router={currentRouter}
                    onUpdateRouter={handleUpdateRouter}
                    onResetDefaults={handleResetDefaults}
                    onOpenSticker={() => setShowStickerModal(true)}
                  />
                )}

                {currentRouterId === 'movistar-hgu' && (
                  <MovistarHGUInterface
                    router={currentRouter}
                    onUpdateRouter={handleUpdateRouter}
                    onResetDefaults={handleResetDefaults}
                    onOpenSticker={() => setShowStickerModal(true)}
                    onOpenWiFiCard={() => setShowWiFiCard(true)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Shared Modals */}
      <RouterStickerModal
        router={stickerRouter}
        isOpen={showStickerModal}
        onClose={() => setShowStickerModal(false)}
      />

      <SimulatedPhone
        router={currentRouter}
        isOpen={showPhoneSim}
        onClose={() => setShowPhoneSim(false)}
      />

      <WiFiCardModal
        router={currentRouter}
        isOpen={showWiFiCard}
        onClose={() => setShowWiFiCard(false)}
      />
    </div>
  );
}
