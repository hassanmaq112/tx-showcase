import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { BarChart3, Home, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/cn';

const TABS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/analytics', label: 'Stats', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
] as const;

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const onAddRoute = location.pathname === '/add';

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md">
      <div className="relative border-t border-border/70 bg-canvas/90 backdrop-blur-lg pb-safe">
        <div className="grid grid-cols-5 items-center px-2">
          <TabItem tab={TABS[0]} />
          <TabItem tab={TABS[1]} />

          {/* Center raised Add button */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate('/add')}
              aria-label="Add expense"
              className={cn(
                'no-tap-highlight -mt-7 grid h-14 w-14 place-items-center rounded-full',
                'bg-brand text-brand-ink shadow-lg shadow-brand/30 transition-transform active:scale-95',
                onAddRoute && 'ring-4 ring-brand/25',
              )}
            >
              <Plus size={26} strokeWidth={2.5} />
            </button>
          </div>

          <TabItem tab={TABS[2]} />
          <div aria-hidden />
        </div>
      </div>
    </nav>
  );
}

function TabItem({ tab }: { tab: (typeof TABS)[number] }) {
  const { to, label, icon: Icon } = tab;
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className="no-tap-highlight flex flex-col items-center gap-0.5 py-2.5"
    >
      {({ isActive }) => (
        <>
          <Icon
            size={22}
            className={cn('transition-colors', isActive ? 'text-brand' : 'text-muted')}
            strokeWidth={isActive ? 2.4 : 2}
          />
          <span
            className={cn(
              'text-[11px] font-medium transition-colors',
              isActive ? 'text-brand' : 'text-muted',
            )}
          >
            {label}
          </span>
        </>
      )}
    </NavLink>
  );
}
