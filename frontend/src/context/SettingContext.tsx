"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";

interface SettingContextType {
  settings: Record<string, any>;
  getSetting: (key: string, defaultValue?: any) => any;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
}

const SettingContext = createContext<SettingContextType>({
  settings: {},
  getSetting: () => null,
  isLoading: true,
  refreshSettings: async () => {},
});

export const SettingProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = async () => {
    try {
      setIsLoading(true);
      const { data } = await axiosInstance.get("/settings");
      
      const flatSettings: Record<string, any> = {};
      if (data && typeof data === 'object') {
        Object.keys(data).forEach((group) => {
          if (Array.isArray(data[group])) {
             data[group].forEach((setting: any) => {
                flatSettings[setting.key] = setting.value;
             });
          }
        });
      }
      setSettings(flatSettings);
    } catch (error) {
      console.warn("Failed to fetch settings APIs - using default fallbacks.", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const getSetting = (key: string, defaultValue: any = null) => {
    return settings[key] !== undefined ? settings[key] : defaultValue;
  };

  return (
    <SettingContext.Provider value={{ settings, getSetting, isLoading, refreshSettings: fetchSettings }}>
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => useContext(SettingContext);
