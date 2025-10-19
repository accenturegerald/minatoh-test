import { useState, useEffect } from 'react';
import { Dashboard } from './pages/Dashboard';
import { WalkIn } from './pages/WalkIn';
import { Booking } from './pages/Booking';
import { Queue } from './pages/Queue';
import { Reports } from './pages/Reports';
import { Staff } from './pages/Staff';
import { Admin } from './pages/Admin';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { 
  LayoutDashboard, 
  UserPlus, 
  Calendar, 
  ListOrdered, 
  BarChart3, 
  Users, 
  Settings,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

type Page = 'dashboard' | 'walk-in' | 'booking' | 'queue' | 'reports' | 'staff' | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check system preference or localStorage
    const isDark = localStorage.getItem('theme') === 'dark' || 
                   (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const navigation = [
    { id: 'dashboard' as Page, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'walk-in' as Page, label: 'Walk-in', icon: UserPlus },
    { id: 'booking' as Page, label: 'Booking', icon: Calendar },
    { id: 'queue' as Page, label: 'Queue', icon: ListOrdered },
    { id: 'reports' as Page, label: 'Reports', icon: BarChart3 },
    { id: 'staff' as Page, label: 'Staff', icon: Users },
    { id: 'admin' as Page, label: 'Admin', icon: Settings },
  ];

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'walk-in':
        return <WalkIn />;
      case 'booking':
        return <Booking />;
      case 'queue':
        return <Queue />;
      case 'reports':
        return <Reports />;
      case 'staff':
        return <Staff />;
      case 'admin':
        return <Admin />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <div>
              <h1 className="text-xl">Minatoh</h1>
              <p className="text-xs text-muted-foreground">Resource Manager</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-8 flex-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(item.id)}
                  className="transition-minatoh"
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="transition-minatoh"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden transition-minatoh"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-card">
            <nav className="flex flex-col p-4 gap-1">
              {navigation.map((item, index) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <Button
                    key={item.id}
                    variant={isActive ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => {
                      setCurrentPage(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className="justify-start transition-minatoh animate-stagger"
                    style={{ '--stagger-delay': index } as React.CSSProperties}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {renderPage()}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© 2025 Minatoh Resource Manager. Calm, Fair, Transparent.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
                System Active
              </span>
              <span>•</span>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
