'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Menu, 
  X,
  GraduationCap,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Início', href: '/', icon: Home },
  { name: 'Disciplinas', href: '/disciplinas', icon: BookOpen },
  { name: 'Progresso', href: '/progresso', icon: TrendingUp },
];

export default function Navigation({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load and apply theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || 'dark';
    
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground font-sans selection:bg-neutral-200 dark:selection:bg-neutral-800 transition-colors duration-250">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card h-screen sticky top-0 px-6 py-8 justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 px-2">
            <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
              D.
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Discy</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 group border border-transparent",
                    isActive 
                      ? "bg-accent text-accent-foreground border-border/40 shadow-xs" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  <Icon className={cn(
                    "w-4 h-4 transition-transform duration-200 group-hover:scale-105",
                    isActive ? "text-accent-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Theme Toggle & User Info at bottom */}
        <div className="space-y-4 pt-6 border-t border-border">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border/30 hover:border-border/80 transition-all duration-200 cursor-pointer"
            title="Alternar tema"
          >
            <span className="flex items-center gap-2">
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
            </span>
            <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest font-bold font-mono">
              {theme}
            </span>
          </button>

          {/* Academic Info */}
          <div className="px-2 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border/50">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-foreground">Espaço Acadêmico</div>
              <div className="text-[10px] text-muted-foreground font-semibold">Graduação</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-6 py-4 border-b border-border bg-card sticky top-0 z-50 transition-colors duration-250">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-xs">
            D.
          </div>
          <span className="text-base font-bold tracking-tight text-foreground">Discy</span>
        </Link>
        <div className="flex items-center gap-2">
          {/* Simple Mobile Theme Toggle Icon */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Alternar tema"
          >
            {theme === 'light' ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-neutral-950/20 dark:bg-black/60 backdrop-blur-xs transition-opacity" 
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Drawer Menu */}
          <div className="relative flex flex-col w-4/5 max-w-sm bg-card h-full p-6 shadow-2xl transition-transform duration-300 ease-out border-r border-border animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-8 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                  D.
                </div>
                <span className="text-lg font-semibold tracking-tight text-foreground">Discy</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 border border-transparent",
                      isActive 
                        ? "bg-accent text-accent-foreground border-border/40 shadow-xs" 
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <Icon className={cn("w-4.5 h-4.5", isActive ? "text-accent-foreground" : "text-muted-foreground")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-border pt-6 space-y-4">
              {/* Theme Toggle Button for Drawer */}
              <button
                onClick={toggleTheme}
                className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted border border-border/30 transition-all duration-200 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  <span>{theme === 'light' ? 'Modo Escuro' : 'Modo Claro'}</span>
                </span>
                <span className="text-[9px] text-muted-foreground/60 uppercase tracking-widest font-mono font-bold">
                  {theme}
                </span>
              </button>

              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground border border-border/50">
                  <GraduationCap className="w-5.5 h-5.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Espaço Acadêmico</div>
                  <div className="text-[10px] text-muted-foreground font-semibold">Graduação</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Page Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <div className="flex-1 px-4 py-6 md:p-12 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </div>
      </main>
    </div>
  );
}
