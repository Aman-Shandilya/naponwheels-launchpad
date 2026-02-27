import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Moon, Sun, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLeadModal } from '@/contexts/LeadModalContext';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Owners', href: '#for-owners' },
  { label: 'Safety', href: '#safety' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Contact', href: '#contact' },
];

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { openModal } = useLeadModal();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-card/90 backdrop-blur-xl shadow-soft border-b border-border/50' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-18">
        <a href="#home" className="font-heading font-extrabold text-xl tracking-tight text-foreground">
          Nap<span className="text-accent">On</span>Wheels
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
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
            <>
              <Link
                to="/auth"
                className="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground border border-border rounded-xl hover:bg-muted transition-all"
              >
                Sign In
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all"
              >
                Sign Up
              </Link>
            </>
          )}

          <button
            onClick={() => openModal()}
            className="px-5 py-2.5 bg-accent text-accent-foreground text-sm font-bold rounded-xl hover:bg-accent/90 transition-all shadow-accent-glow"
          >
            Book Now
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={() => setDark(d => !d)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="px-4 py-4 space-y-3">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block text-base font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {l.label}
              </a>
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
                  className="flex-1 py-3 text-sm font-semibold text-primary-foreground bg-primary rounded-xl hover:bg-primary/90 transition-all text-center"
                >
                  Sign Up
                </Link>
              </div>
            )}

            <button
              onClick={() => { openModal(); setMobileOpen(false); }}
              className="w-full py-3 bg-accent text-accent-foreground font-bold rounded-xl hover:bg-accent/90 transition-all shadow-accent-glow mt-2"
            >
              Book Now
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Header;
