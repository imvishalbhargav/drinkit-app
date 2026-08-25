import { Link } from 'react-router-dom';
import { BRAND, LEGAL_DRINKING_AGE } from '../../lib/config';
import { Logo } from '../common/Logo';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-hair/70 bg-panel/40">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <Logo />
            <p className="max-w-xs text-sm text-fog">{BRAND.tagline}. Duniya bhar ki drinks, minton mein aapke darwaze par.</p>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-chalk">Shop</h4>
            <ul className="space-y-2 text-sm text-fog">
              <li><Link to="/search?q=whisky" className="hover:text-lime">Whisky & Spirits</Link></li>
              <li><Link to="/search?q=wine" className="hover:text-lime">Wine</Link></li>
              <li><Link to="/search?q=beer" className="hover:text-lime">Beer</Link></li>
              <li><Link to="/search?q=coffee" className="hover:text-lime">Coffee & Tea</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-chalk">Company</h4>
            <ul className="space-y-2 text-sm text-fog">
              <li><Link to="/orders" className="hover:text-lime">My Orders</Link></li>
              <li><Link to="/account" className="hover:text-lime">Account</Link></li>
              <li><span className="cursor-default">About</span></li>
              <li><span className="cursor-default">Support</span></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 text-sm font-semibold text-chalk">Drink responsibly</h4>
            <p className="text-sm text-fog">
              Alcohol is sold only to individuals aged {LEGAL_DRINKING_AGE} and above. Please don't
              drink and drive.
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-hair/60 pt-6 text-xs text-fog sm:flex-row">
          <p>© {BRAND.name} — demo project by Vishal Bhargav. Not affiliated with any brand shown.</p>
          <p>Made with 🍸 in India</p>
        </div>
      </div>
    </footer>
  );
}
