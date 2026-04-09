import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, User, LogOut, Bus, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLeadModal } from '@/contexts/LeadModalContext';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from 'next-themes';

const navLinks = [
  { label: 'Home', href: 'home' },
  { label: 'How It Works', href: 'how-it-works' },
  { label: 'For Owners', href: 'for-owners' },
  { label: 'Safety', href: 'safety' },
  { label: 'FAQ', href: 'faq' },
  { label: 'Contact', href: 'contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { openModal } = useLeadModal();
  const { user, signOut } = useAuth();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    if (isHomePage) {
      const element = document.getElementById(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-card/90 backdrop-blur-xl shadow-soft border-b border-border/50' : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 lg:h-18">
        <Link to="/" className={`font-heading font-extrabold text-xl tracking-tight ${scrolled ? 'text-foreground' : 'text-white'}`}>
          Nap<span className="text-accent">On</span>Wheels
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6">
          {navLinks.map(l => (
            isHomePage ? (
              <a
                key={l.href}
                href={`#${l.href}`}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(l.href);
                }}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`}
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.href}
                to={`/#${l.href}`}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'}`}
              >
                {l.label}
              </Link>
            )
          ))}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-muted text-foreground' : 'hover:bg-white/10 text-white'}`}
            aria-label="Toggle dark mode"
          >
            {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            {!mounted && <div className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center hover:bg-primary/90 transition-colors"
              >
                {userInitial}
              </button>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-elevated p-3 z-50"
                >
                  <div className="px-2 py-2 border-b border-border mb-2">
                    <p className="text-sm font-semibold text-foreground truncate">{user.email}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Signed in</p>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4" />
                    Dashboard
                  </Link>
                  <Link
                    to="/search"
                    onClick={() => setProfileOpen(false)}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <Bus className="w-4 h-4" />
                    Find Buses
                  </Link>
                  <button
                    onClick={() => { signOut(); setProfileOpen(false); }}
                    className="w-full flex items-center gap-2 px-2 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className={`group relative px-5 py-2 text-sm font-semibold rounded-full transition-all duration-300 overflow-hidden ${
                  scrolled
                    ? 'text-foreground hover:text-primary border border-border/80 hover:border-primary/40 hover:shadow-[0_0_20px_hsl(var(--primary)/0.15)]'
                    : 'text-white hover:text-white border border-white/30 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]'
                }`}
              >
                <span className="relative z-10">Sign In</span>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                  scrolled ? 'bg-primary/5' : 'bg-white/10'
                }`} />
              </Link>
              <Link
                to="/auth"
                className="group relative px-5 py-2 text-sm font-bold text-primary-foreground rounded-full bg-gradient-to-r from-primary to-accent overflow-hidden transition-all duration-300 hover:shadow-[0_4px_24px_hsl(var(--primary)/0.4)] hover:scale-[1.03] active:scale-[0.97]"
              >
                <span className="relative z-10 flex items-center gap-1.5">
                  Sign Up
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-2 rounded-lg transition-colors ${scrolled ? 'hover:bg-muted text-foreground' : 'hover:bg-white/10 text-white'}`}
            aria-label="Toggle dark mode"
          >
            {mounted && (theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
            {!mounted && <div className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className={`p-2 ${scrolled ? '' : 'text-white'}`} aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="lg:hidden bg-card/95 backdrop-blur-xl border-b border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(l => (
              isHomePage ? (
                <a
                  key={l.href}
                  href={`#${l.href}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick(l.href);
                  }}
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {l.label}
                </a>
              ) : (
                <Link
                  key={l.href}
                  to={`/#${l.href}`}
                  onClick={() => setMobileOpen(false)}
                  className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                >
                  {l.label}
                </Link>
              )
            ))}

            {user ? (
              <div className="border-t border-border pt-3 mt-2">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center">
                    {userInitial}
                  </div>
                  <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                </div>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-2">
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-sm font-semibold text-muted-foreground border border-border rounded-xl hover:bg-muted transition-all text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/auth"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 py-3 text-sm font-bold text-primary-foreground bg-gradient-to-r from-primary to-accent rounded-xl transition-all text-center flex items-center justify-center gap-1.5"
                >
                  Sign Up
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
