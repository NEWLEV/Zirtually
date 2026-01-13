import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type FontSize = 'small' | 'medium' | 'large' | 'extra-large';

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  mobile: boolean;
  weeklyDigest: boolean;
  trainingReminders: boolean;
  timeOffUpdates: boolean;
  teamUpdates: boolean;
  systemAlerts: boolean;
}

export interface PrivacySettings {
  showInDirectory: boolean;
  shareContactInfo: boolean;
  showWorkAnniversary: boolean;
  showBirthday: boolean;
  allowManagerView: boolean;
}

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  fontSize: FontSize;
  screenReader: boolean;
}

interface SettingsContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: string;
  setLanguage: (lang: string) => void;
  timezone: string;
  setTimezone: (tz: string) => void;
  dateFormat: string;
  setDateFormat: (format: string) => void;
  notifications: NotificationSettings;
  updateNotifications: (settings: Partial<NotificationSettings>) => void;
  privacy: PrivacySettings;
  updatePrivacy: (settings: Partial<PrivacySettings>) => void;
  accessibility: AccessibilitySettings;
  updateAccessibility: (settings: Partial<AccessibilitySettings>) => void;
}

const defaultNotifications: NotificationSettings = {
  email: true,
  browser: true,
  mobile: false,
  weeklyDigest: true,
  trainingReminders: true,
  timeOffUpdates: true,
  teamUpdates: true,
  systemAlerts: true,
};

const defaultPrivacy: PrivacySettings = {
  showInDirectory: true,
  shareContactInfo: true,
  showWorkAnniversary: true,
  showBirthday: false,
  allowManagerView: true,
};

const defaultAccessibility: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  fontSize: 'medium',
  screenReader: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state from localStorage or defaults
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('zirtually_theme') as Theme) || 'system'
  );

  const [language, setLanguage] = useState(
    () => localStorage.getItem('zirtually_language') || 'en'
  );

  const [timezone, setTimezone] = useState(
    () => localStorage.getItem('zirtually_timezone') || 'America/New_York'
  );

  const [dateFormat, setDateFormat] = useState(
    () => localStorage.getItem('zirtually_dateFormat') || 'MM/DD/YYYY'
  );

  const [notifications, setNotifications] = useState<NotificationSettings>(() => {
    const saved = localStorage.getItem('zirtually_notifications');
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>(() => {
    const saved = localStorage.getItem('zirtually_privacy');
    return saved ? JSON.parse(saved) : defaultPrivacy;
  });

  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('zirtually_accessibility');
    return saved ? JSON.parse(saved) : defaultAccessibility;
  });

  // Persist changes to localStorage
  useEffect(() => {
    localStorage.setItem('zirtually_theme', theme);
    const root = window.document.documentElement;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    const activeTheme = theme === 'system' ? systemTheme : theme;

    root.classList.remove('light', 'dark');
    root.classList.add(activeTheme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('zirtually_language', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('zirtually_timezone', timezone);
  }, [timezone]);

  useEffect(() => {
    localStorage.setItem('zirtually_dateFormat', dateFormat);
  }, [dateFormat]);

  useEffect(() => {
    localStorage.setItem('zirtually_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('zirtually_privacy', JSON.stringify(privacy));
  }, [privacy]);

  useEffect(() => {
    localStorage.setItem('zirtually_accessibility', JSON.stringify(accessibility));

    // Apply accessibility classes/styles
    const root = window.document.documentElement;
    if (accessibility.reduceMotion) {
      root.classList.add('motion-reduce');
    } else {
      root.classList.remove('motion-reduce');
    }

    // Font size scaling could be handled here or via CSS variables
    const sizeMap = {
      small: '87.5%', // 14px
      medium: '100%', // 16px default
      large: '112.5%', // 18px
      'extra-large': '125%', // 20px
    };
    root.style.fontSize = sizeMap[accessibility.fontSize];
  }, [accessibility]);

  // Setters wrappers
  const updateNotifications = (settings: Partial<NotificationSettings>) => {
    setNotifications(prev => ({ ...prev, ...settings }));
  };

  const updatePrivacy = (settings: Partial<PrivacySettings>) => {
    setPrivacy(prev => ({ ...prev, ...settings }));
  };

  const updateAccessibility = (settings: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({ ...prev, ...settings }));
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <SettingsContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        timezone,
        setTimezone,
        dateFormat,
        setDateFormat,
        notifications,
        updateNotifications,
        privacy,
        updatePrivacy,
        accessibility,
        updateAccessibility,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
