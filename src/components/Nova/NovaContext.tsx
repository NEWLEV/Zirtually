import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export interface NovaTip {
  id: string;
  message: string;
  type: 'suggestion' | 'guide' | 'insight';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NovaContextType {
  currentTip: NovaTip | null;
  dismissTip: () => void;
  showTip: (tip: NovaTip) => void;
  registerInteraction: (type: 'click' | 'hover', elementId?: string) => void;
}

const NovaContext = createContext<NovaContextType | undefined>(undefined);

export const useNova = () => {
  const context = useContext(NovaContext);
  if (!context) {
    throw new Error('useNova must be used within a NovaProvider');
  }
  return context;
};

interface NovaProviderProps {
  children: ReactNode;
  userName?: string; // For personalization
}

export const NovaProvider: React.FC<NovaProviderProps> = ({ children, userName: _userName }) => {
  const [currentTip, setCurrentTip] = useState<NovaTip | null>(null);
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const location = useLocation();
  const navigate = useNavigate();

  // State for tracking behaviors
  const [_clickCount, setClickCount] = useState(0);
  // Use Ref for tracking interaction time to prevent re-renders on mousemove
  const lastInteractionTimeRef = React.useRef(0);

  // Initialize the ref in an effect or use a lazy initializer trick to avoid "impure function" lint
  useEffect(() => {
    lastInteractionTimeRef.current = Date.now();
  }, []);

  const updateLastInteraction = useCallback(() => {
    lastInteractionTimeRef.current = Date.now();
  }, []);

  const dismissTip = useCallback(() => {
    if (currentTip) {
      setDismissedTips(prev => new Set(prev).add(currentTip.id));
      setCurrentTip(null);
    }
  }, [currentTip]);

  const showTip = useCallback(
    (tip: NovaTip) => {
      if (!dismissedTips.has(tip.id)) {
        setCurrentTip(tip);

        // Auto-dismiss after 10 seconds if user doesn't interact?
        // Maybe not, let them dismiss it.
        // But we can have a timeout to clear it if it's very ephemeral.
      }
    },
    [dismissedTips]
  );

  const registerInteraction = useCallback(
    (type: 'click' | 'hover', _elementId?: string) => {
      updateLastInteraction();

      // Example Logic 3: Dashboard clicking
      if (location.pathname === '/dashboard' || location.pathname === '/') {
        if (type === 'click') {
          setClickCount(prev => {
            const newCount = prev + 1;
            if (newCount === 3 && !dismissedTips.has('dashboard-empty')) {
              showTip({
                id: 'dashboard-empty',
                message: 'Your dashboard’s empty — want me to help set up your first widget?',
                type: 'suggestion',
                action: {
                  label: 'Setup Widget',
                  onClick: () => console.log('Setup widget clicked'), // Placeholder
                },
              });
            }
            return newCount;
          });
        }
      }
    },
    [location.pathname, showTip, dismissedTips, updateLastInteraction]
  );

  // IDLE DETECTOR
  useEffect(() => {
    const idleTimer = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastInteractionTimeRef.current;
      const isIdle = timeSinceInteraction > 30000; // 30 seconds idle

      if (isIdle && !currentTip) {
        // Context-aware idle tips

        // 1. Create Project (mapped to Goals for this app)
        if (location.pathname.includes('goals') && !dismissedTips.has('goal-naming')) {
          showTip({
            id: 'goal-naming',
            message:
              "Need a hand? Try naming your goal something specific like 'Q1 Revenue Target' — it helps focus your team.",
            type: 'guide',
          });
        }
        // 2. Invite Teammates
        else if (location.pathname.includes('team') && !dismissedTips.has('invite-team')) {
          showTip({
            id: 'invite-team',
            message:
              "Looks like you're exploring the team section — want to invite your teammates now?",
            type: 'suggestion',
            action: {
              label: 'Invite Teammates',
              onClick: () => {
                navigate('/team'); // Redirects to team page
              },
            },
          });
        }
        // 3. Profile / Onboarding
        else if (location.pathname.includes('profile') && !dismissedTips.has('profile-photo')) {
          showTip({
            id: 'profile-photo',
            message: 'Adding a profile photo helps your team recognize you.',
            type: 'suggestion',
          });
        }
      }
    }, 5000);

    return () => clearInterval(idleTimer);
  }, [location.pathname, currentTip, dismissedTips, showTip, navigate]);

  // Activity Trackers (MouseMove, KeyDown)
  useEffect(() => {
    const handleActivity = () => updateLastInteraction();

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
    };
  }, [updateLastInteraction]);

  // Context-Aware Route Triggers (Immediate)
  useEffect(() => {
    // Reset state on route change
    // Reset state on route change (wrapped to avoid synchronous set-state-in-effect warning)
    Promise.resolve().then(() => {
      setCurrentTip(null);
      setClickCount(0);
      updateLastInteraction();
    });

    // Immediate tips for specific pages
    if (location.pathname === '/goals' && !dismissedTips.has('welcome-goals')) {
      const timer = setTimeout(() => {
        showTip({
          id: 'welcome-goals',
          message:
            'Welcome to Goals! Here you can track your OKRs and personal development targets.',
          type: 'guide',
        });
      }, 1000);
      return () => clearTimeout(timer);
    }

    if (location.pathname === '/performance' && !dismissedTips.has('welcome-reviews')) {
      const timer = setTimeout(() => {
        showTip({
          id: 'welcome-reviews',
          message:
            'Performance review season is coming up. Check your pending self-assessments here.',
          type: 'insight',
        });
      }, 1000);
      return () => clearTimeout(timer);
    }

    return undefined;
  }, [location.pathname, dismissedTips, showTip, updateLastInteraction, navigate]);

  // Global Click Listener
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      // Logic to determine if it's a "useful" click or a "frustrated" click
      // For now, we count all clicks on the dashboard if they aren't on buttons/links
      if (location.pathname === '/' || location.pathname === '/dashboard') {
        const target = e.target as HTMLElement;
        const isInteractive =
          target.closest('button') || target.closest('a') || target.closest('input');

        if (!isInteractive) {
          registerInteraction('click');
        }
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [location.pathname, registerInteraction]);

  return (
    <NovaContext.Provider value={{ currentTip, dismissTip, showTip, registerInteraction }}>
      {children}
    </NovaContext.Provider>
  );
};
