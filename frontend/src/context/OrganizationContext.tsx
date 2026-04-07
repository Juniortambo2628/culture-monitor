"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axiosInstance from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

interface Organization {
  id: number;
  name: string;
  slug: string;
}

interface OrganizationContextType {
  organizations: Organization[];
  activeOrganization: Organization | null;
  setActiveOrganization: (org: Organization) => void;
  activePoll: any;
  setActivePoll: (poll: any) => void;
  isLoading: boolean;
  refreshOrganizations: () => Promise<void>;
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined);

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [activePoll, setActivePoll] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const fetchOrganizations = useCallback(async () => {
    if (!isAuthenticated) {
        setOrganizations([]);
        setActiveOrganization(null);
        setActivePoll(null);
        return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get("/organizations");
      const data = response.data;
      const uniqueData = Array.from(new Map(data.map((o: any) => [o.id, o])).values());
      setOrganizations(uniqueData as Organization[]);

      const savedOrgId = localStorage.getItem("active_organization_id");
      let initialOrg = data.length > 0 ? data[0] : null;

      if (savedOrgId && data.length > 0) {
        const found = data.find((org: Organization) => org.id === parseInt(savedOrgId));
        if (found) initialOrg = found;
      }
      
      setActiveOrganization(initialOrg);

      if (initialOrg) {
         try {
            const pollRes = await axiosInstance.get(`/polls?organization_id=${initialOrg.id}`);
            if (pollRes.data && pollRes.data.length > 0) {
               const savedPollId = localStorage.getItem("active_poll_id");
               const foundPoll = pollRes.data.find((p: any) => p.id.toString() === savedPollId);
               setActivePoll(foundPoll || pollRes.data[0]);
            }
         } catch (e: any) {
             if (e.response?.status === 403) {
                 console.warn("Poll access restricted for this organization.");
                 setActivePoll(null);
             } else if (e.response?.status === 401) {
                 // Already handled by AuthContext, just cleanup
                 setActivePoll(null);
             } else {
                 throw e;
             }
         }
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
          setOrganizations([]);
          setActiveOrganization(null);
          setActivePoll(null);
      } else {
          console.error("Failed to fetch organizations:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchOrganizations();
  }, [fetchOrganizations]);

  const handleSetActiveOrganization = async (org: Organization) => {
    setActiveOrganization(org);
    localStorage.setItem("active_organization_id", org.id.toString());
    
    // Reset poll to latest for this org
    try {
        const pollRes = await axiosInstance.get(`/polls?organization_id=${org.id}`);
        if (pollRes.data && pollRes.data.length > 0) {
           setActivePoll(pollRes.data[0]);
           localStorage.setItem("active_poll_id", pollRes.data[0].id.toString());
        } else {
           setActivePoll(null);
        }
    } catch (e) {
        console.error("Failed to sync poll context", e);
    }
  };

  const handleSetActivePoll = (poll: any) => {
    setActivePoll(poll);
    if (poll) localStorage.setItem("active_poll_id", poll.id.toString());
  };

  return (
    <OrganizationContext.Provider 
      value={{ 
        organizations, 
        activeOrganization, 
        setActiveOrganization: handleSetActiveOrganization,
        activePoll,
        setActivePoll: handleSetActivePoll,
        isLoading,
        refreshOrganizations: fetchOrganizations
      }}
    >
      {children}
    </OrganizationContext.Provider>
  );
}

export function useOrganization() {
  const context = useContext(OrganizationContext);
  if (context === undefined) {
    throw new Error("useOrganization must be used within an OrganizationProvider");
  }
  return context;
}
