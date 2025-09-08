"use client";

import { useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useEffect } from "react";

type Role = 'ADMIN' | 'EMPLOYEE' | 'OWNER';

interface RoleContextType {
    role: string;
}


const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function useRole() {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within a RoleProvider');
    }
    return context;
}

export function RoleProvider({ children }: { children: React.ReactNode }) {
    // TODO: Replace this with actual role fetching logic
    const queryClient = useQueryClient()
    let role: string = 'PHARMACY_ADMIN';
    let account = queryClient.getQueryData(['me']) as any
    role = account?.role?.name || 'PHARMACY_MANAGER'

    return (
        <RoleContext.Provider value={{ role }}>
            {children}
        </RoleContext.Provider>
    );
}
