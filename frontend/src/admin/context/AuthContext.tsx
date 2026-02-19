
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

// User types
export type UserRole = "SUPER_ADMIN" | "CLERK";

export interface User {
    name?: string;
    email: string;
    role: UserRole;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    console.log("AuthProvider: Mounting");

    useEffect(() => {
        // Check local storage on load
        const storedUser = localStorage.getItem("admin_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);
        try {
            const response = await api.post("/auth/login", { email, password });
            const { token, user } = response.data;

            // Save to state and local storage
            setUser(user);
            localStorage.setItem("authToken", token);
            localStorage.setItem("admin_user", JSON.stringify(user));

            setIsLoading(false);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            setIsLoading(false);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("admin_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
