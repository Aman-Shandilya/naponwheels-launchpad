import { Instagram, Linkedin, Mail, Phone } from 'lucide-react';

const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
        <div className="col-span-2 md:col-span-1">
          <p className="font-heading font-extrabold text-lg text-foreground mb-3">
            Nap<span className="text-accent">On</span>Wheels
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sleep Anywhere. Comfort on Wheels. Affordable rest for every traveler.
          </p>
        </div>

        <div>
          <h4 className="font-heading font-bold text-foreground text-sm mb-3">Quick Links</h4>
          <div className="space-y-2">
            {['Home', 'How It Works', 'For Owners', 'Safety'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-foreground text-sm mb-3">Support</h4>
          <div className="space-y-2">
            {['FAQ', 'Contact Us', 'Terms of Service', 'Privacy Policy'].map(l => (
              <a key={l} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-heading font-bold text-foreground text-sm mb-3">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              arshad233940@gmail.com
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              amanshandileya@gmail.com
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              +91 6299378775
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <a
              href="https://www.linkedin.com/in/md-arshad-936353368"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="LinkedIn profile"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com/amansingh_062"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Instagram profile"
            >
              <Instagram className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} NapOnWheels. All rights reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          Made with 💙 for travelers who deserve better rest.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
