import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ArrowRight, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot';

export const LoginView: React.FC = () => {
  const { loginWithGoogle, loginWithEmail, signupWithEmail, resetPassword, loading, authError, clearAuthError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const error = localError || (authError && !authError.startsWith('✅') ? authError : null);
  const successMsg = authError?.startsWith('✅') ? authError : null;

  const handleGoogleLogin = async () => {
    clearAuthError();
    setLocalError(null);
    await loginWithGoogle();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAuthError();
    setLocalError(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) { setLocalError('Les mots de passe ne correspondent pas.'); return; }
      if (password.length < 6) { setLocalError('Le mot de passe doit comporter au moins 6 caractères.'); return; }
      if (!displayName.trim()) { setLocalError('Saisis ton prénom ou pseudo de Chasseur.'); return; }
      await signupWithEmail(email, password, displayName.trim());
    } else if (mode === 'login') {
      await loginWithEmail(email, password);
    } else if (mode === 'forgot') {
      await resetPassword(email);
    }
  };

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    clearAuthError();
    setLocalError(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#0D0A18] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#6600CC]/20 via-[#A87FE8]/15 to-[#C9A070]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-[#6600CC]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-48 h-48 bg-[#C9A070]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#6600CC] via-[#A87FE8] to-[#C9A070] p-[2px] shadow-2xl shadow-[#6600CC]/50 mb-4">
            <div className="w-full h-full rounded-[22px] bg-[#0D0A18] flex items-center justify-center p-3.5">
              <img
                src="/assets/class-s-icon.png"
                alt="Class S"
                className="w-full h-full object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
              />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-jost">LE SYSTÈME</h1>
          <p className="text-sm text-white/60 mt-1">
            {mode === 'login' && 'Connexion à ton espace Chasseur'}
            {mode === 'signup' && 'Crée ton espace Chasseur'}
            {mode === 'forgot' && 'Réinitialisation du mot de passe'}
          </p>
        </div>

        {/* Main Card */}
        <div className="p-7 sm:p-8 rounded-3xl bg-[#140F26]/90 border border-[#A87FE8]/30 shadow-[0_20px_60px_rgba(13,10,24,0.8)] backdrop-blur-2xl space-y-5">

          {/* Error / Success Alerts */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg.replace('✅ ', '')}</span>
            </div>
          )}

          {/* Google OAuth Button */}
          {mode !== 'forgot' && (
            <>
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full py-3 px-5 rounded-2xl bg-white text-gray-800 text-sm font-bold shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-3 group disabled:opacity-60"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Continuer avec Google</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-auto" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-white/40 font-medium uppercase tracking-wider">ou</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            </>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Prénom ou pseudo de Chasseur"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A87FE8] transition-colors"
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              <input
                type="email"
                placeholder="Adresse email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A87FE8] transition-colors"
              />
            </div>

            {mode !== 'forgot' && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Mot de passe"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A87FE8] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            )}

            {mode === 'signup' && (
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirmer le mot de passe"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#A87FE8] transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-cta w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-[#6600CC] to-[#A87FE8] text-white text-sm font-bold shadow-lg shadow-[#6600CC]/30 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span>Chargement...</span>
              ) : mode === 'login' ? (
                'Se connecter par email'
              ) : mode === 'signup' ? (
                'Créer mon compte'
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </button>
          </form>

          {/* Mode switcher links */}
          <div className="space-y-2 pt-1 text-center text-xs text-white/50">
            {mode === 'login' && (
              <>
                <button
                  onClick={() => switchMode('forgot')}
                  className="block w-full hover:text-[#C9A070] transition-colors"
                >
                  Mot de passe oublié ?
                </button>
                <button
                  onClick={() => switchMode('signup')}
                  className="block w-full hover:text-white transition-colors"
                >
                  Pas encore de compte ?{' '}
                  <span className="text-[#A87FE8] font-semibold">Créer un compte</span>
                </button>
              </>
            )}
            {mode === 'signup' && (
              <button
                onClick={() => switchMode('login')}
                className="flex items-center justify-center gap-1 w-full hover:text-white transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Déjà un compte ? Se connecter
              </button>
            )}
            {mode === 'forgot' && (
              <button
                onClick={() => switchMode('login')}
                className="flex items-center justify-center gap-1 w-full hover:text-white transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Retour à la connexion
              </button>
            )}
          </div>
        </div>

        <p className="text-center text-[11px] text-white/30 mt-4">
          Le Système — Plateforme Class S • Chaque compte est strictement isolé
        </p>
      </div>
    </div>
  );
};
