"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

type User = {
    email: string;
    name: string;
    role: string;
} | null;

type AuthContextType = {
    user: User;
    loading: boolean;
    login: (email: string, password: string, role: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in on mount
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const { data } = await axios.get(`${process.env.BACKEND_URL}/auth/me`, {
                withCredentials: true
            });
            setUser(data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string, role: string) => {
        const { data } = await axios.post(`${process.env.BACKEND_URL}/auth/login`, {
            email,
            password,
            role
        }, {
            withCredentials: true
        });
        setUser(data.user);
    };

    const register = async (name: string, email: string, password: string, role: string) => {
        const { data } = await axios.post(`${process.env.BACKEND_URL}/auth/register`, {
            name,
            email,
            password,
            role
        }, {
            withCredentials: true
        });
        setUser(data.user);
    };

    const logout = async () => {
        try {
            await axios.post(`${process.env.BACKEND_URL}/auth/logout`, {}, {
                withCredentials: true
            });
            setUser(null);
            router.push('/');  // Redirect to home after successful logout
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 