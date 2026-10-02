import React, { useState } from 'react';
import { RouterConfig } from '../types';
import { Lock, User, Key, ArrowRight, AlertCircle, Eye, EyeOff, Tag, HelpCircle, Shield } from 'lucide-react';

interface RouterLoginViewProps {
  router: RouterConfig;
  onLoginSuccess: () => void;
  onOpenSticker: () => void;
}

export const RouterLoginView: React.FC<RouterLoginViewProps> = ({
  router,
  onLoginSuccess,
  onOpenSticker,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = password.trim();

      if (router.id === 'huawei-claro') {
        // Valid Claro credentials
        const validUsers = ['admin', 'claro', 'adminisp'];
        const validPasswords = ['claro*2022', 'adminisp', 'admin', 'clarowifi2024*a9', router.wifi24.password.toLowerCase()];
        
        if (validUsers.includes(trimmedUser) && (validPasswords.includes(trimmedPass.toLowerCase()) || trimmedPass.length >= 5)) {
          onLoginSuccess();
        } else {
          setErrorMessage('Nombre de usuario o contraseña incorrectos. Revisa las credenciales de la pegatina de Claro.');
        }
      } else if (router.id === 'tp-link') {
        // Valid TP-Link credentials
        const validUsers = ['admin', 'root', 'user'];
        const validPasswords = ['admin', 'admin123', 'tplink_pass7892', router.wifi24.password.toLowerCase()];

        if (validUsers.includes(trimmedUser) && (validPasswords.includes(trimmedPass.toLowerCase()) || trimmedPass.length >= 4)) {
          onLoginSuccess();
        } else {
          setErrorMessage('Error de inicio de sesión en TP-Link. Usuario o contraseña no válidos.');
        }
      } else if (router.id === 'movistar-hgu') {
        // Movistar only requires password
        const validPasswords = ['admin', 'm0v1st@rkey2024!', 'movistar', router.wifi24.password.toLowerCase()];

        if (validPasswords.includes(trimmedPass.toLowerCase()) || trimmedPass.length >= 6) {
          onLoginSuccess();
        } else {
          setErrorMessage('Contraseña incorrecta. Introduce la clave de acceso al router que figura en la etiqueta inferior del HGU.');
        }
      }
    }, 600);
  };

  // 1. HUAWEI CLARO LOGIN THEME
  if (router.id === 'huawei-claro') {
    return (
      <div className="min-h-[580px] bg-neutral-100 flex flex-col justify-between text-neutral-800 font-sans">
        {/* Top Claro Header */}
        <div className="bg-[#DA291C] text-white px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <span className="bg-white text-[#DA291C] px-2 py-0.5 rounded font-black text-sm uppercase">
              Claro
            </span>
            <span className="text-xs font-bold">HUAWEI EchoLife {router.model}</span>
          </div>
          <span className="text-xs text-red-100 font-mono">192.168.100.1</span>
        </div>

        {/* Central Card */}
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#DA291C] flex items-center justify-center mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">Iniciar Sesión en Módem Huawei</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Ingresa las credenciales de administración del equipo Claro Hogar
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-[#DA291C] shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Nombre de Usuario:</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ej. admin o adminisp"
                    className="w-full px-3 py-2.5 pl-9 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-[#DA291C] focus:ring-1 focus:ring-[#DA291C] font-mono bg-neutral-50"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Contraseña de Acceso:</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña de la pegatina..."
                    className="w-full px-3 py-2.5 pl-9 pr-9 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-[#DA291C] focus:ring-1 focus:ring-[#DA291C] font-mono bg-neutral-50"
                  />
                  <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#DA291C] hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Verificando...' : 'Iniciar Sesión'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500">¿No sabes la clave?</span>
              <button
                type="button"
                onClick={onOpenSticker}
                className="text-[#DA291C] hover:underline font-bold flex items-center gap-1"
              >
                <Tag className="w-3.5 h-3.5" />
                Ver pegatina de Claro
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-neutral-200 border-t border-neutral-300 py-2.5 text-center text-[11px] text-neutral-600">
          Huawei Technologies Co., Ltd. - Terminal Óptico GPON Claro
        </div>
      </div>
    );
  }

  // 2. TP-LINK LOGIN THEME
  if (router.id === 'tp-link') {
    return (
      <div className="min-h-[580px] bg-[#f0f3f6] flex flex-col justify-between text-neutral-800 font-sans">
        {/* Top TP-Link Header */}
        <div className="bg-[#008e9b] text-white px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3 font-black text-xl">
            <span>tp-link</span>
            <span className="text-xs font-normal text-teal-100 border-l border-teal-400/40 pl-3">
              Archer C6 (AC1200)
            </span>
          </div>
          <span className="text-xs text-teal-100 font-mono">192.168.0.1</span>
        </div>

        {/* Central Card */}
        <div className="max-w-md w-full mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#008e9b] flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-neutral-900">Iniciar Sesión en TP-Link</h2>
              <p className="text-xs text-neutral-500 mt-1">
                Ingresa a la consola de administración del router inalámbrico
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Usuario:</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin"
                    className="w-full px-3 py-2.5 pl-9 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-[#008e9b] focus:ring-1 focus:ring-[#008e9b] font-mono bg-neutral-50"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">Contraseña:</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña del router..."
                    className="w-full px-3 py-2.5 pl-9 pr-9 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:border-[#008e9b] focus:ring-1 focus:ring-[#008e9b] font-mono bg-neutral-50"
                  />
                  <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-[#008e9b] hover:bg-[#007b86] disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer mt-2"
              >
                <span>{isSubmitting ? 'Iniciando sesión...' : 'Entrar'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px]">
              <span className="text-neutral-500">Credenciales por defecto: admin / admin</span>
              <button
                type="button"
                onClick={onOpenSticker}
                className="text-[#008e9b] hover:underline font-bold flex items-center gap-1"
              >
                <Tag className="w-3.5 h-3.5" />
                Ver pegatina
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-neutral-200 py-2.5 text-center text-[11px] text-neutral-500">
          TP-Link Corporation Limited. Todos los derechos reservados.
        </div>
      </div>
    );
  }

  // 3. MOVISTAR HGU LOGIN THEME
  return (
    <div className="min-h-[580px] bg-[#f4f7f9] flex flex-col justify-between text-neutral-800 font-sans">
      {/* Top Movistar Header */}
      <div className="bg-[#0b2746] text-white border-b-4 border-[#019DF4] px-6 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#019DF4] flex items-center justify-center font-black text-xl text-white">
            M
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Movistar Smart WiFi</h1>
            <p className="text-[11px] text-blue-200">Home Gateway Unit (HGU)</p>
          </div>
        </div>
        <span className="text-xs text-blue-300 font-mono">192.168.1.1</span>
      </div>

      {/* Central Card */}
      <div className="max-w-md w-full mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl border border-neutral-200 p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#019DF4] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-neutral-900">Acceso al Router Smart WiFi</h2>
            <p className="text-xs text-neutral-500 mt-1">
              Introduce la contraseña que se encuentra en la etiqueta bajo tu equipo Movistar
            </p>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-neutral-700 block mb-1">
                Contraseña de acceso al router:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Clave de 8 caracteres de la etiqueta..."
                  className="w-full px-3 py-2.5 pl-9 pr-9 border border-neutral-300 rounded-xl text-xs focus:outline-none focus:border-[#019DF4] focus:ring-2 focus:ring-[#019DF4]/20 font-mono bg-neutral-50"
                />
                <Key className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-[#019DF4] hover:bg-[#0081ca] disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors shadow-md cursor-pointer mt-2"
            >
              <span>{isSubmitting ? 'Validando clave...' : 'Entrar'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px]">
            <span className="text-neutral-500">¿Dónde está la contraseña?</span>
            <button
              type="button"
              onClick={onOpenSticker}
              className="text-[#019DF4] hover:underline font-bold flex items-center gap-1"
            >
              <Tag className="w-3.5 h-3.5" />
              Ver pegatina del HGU
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-neutral-200 py-2.5 text-center text-[11px] text-neutral-500">
        Telefónica de España S.A.U. - Portal de Configuración Router Fibra
      </div>
    </div>
  );
};
