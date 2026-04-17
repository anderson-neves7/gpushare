import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Cpu, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Marketplace', path: '/marketplace' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Compute', path: '/compute' },
  { label: 'Provider', path: '/provider' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center shadow-sm shadow-black/30">
              <Cpu className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-[15px] font-semibold tracking-tight">GPU<span className="text-primary">Share</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => <Link key={link.path} to={link.path} className={`px-3.5 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path) ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}>{link.label}</Link>)}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link to="/signin"><Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button></Link>
            <Link to="/register"><Button size="sm">Get started</Button></Link>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-muted" onClick={() => setMobileOpen(!mobileOpen)}>{mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
        </div>
      </div>
      {mobileOpen && <div className="md:hidden border-t border-border/60 bg-background/95 backdrop-blur-md"><div className="px-4 py-4 space-y-1">{navLinks.map((link) => <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`block px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(link.path) ? 'bg-primary/12 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'}`}>{link.label}</Link>)}<div className="pt-3 border-t border-border/60 flex gap-2"><Link to="/signin" className="flex-1" onClick={() => setMobileOpen(false)}><Button variant="outline" size="sm" className="w-full border-border/80">Log in</Button></Link><Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}><Button size="sm" className="w-full">Get started</Button></Link></div></div></div>}
    </nav>
  );
}
