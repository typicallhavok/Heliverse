"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
    const pathname = usePathname();
    const { user, logout, loading } = useAuth();

    if (loading) {
        return <div className="h-16 bg-card border-b border-border" />;
    }

    return (
        <nav className="bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <Link href="/" className="flex items-center">
                            <span className="text-xl font-bold text-primary">Heliverse</span>
                        </Link>

                        {user && (
                            <div className="hidden md:flex items-center space-x-4 ml-80">
                                <NavLink href="/dashboard" active={pathname === '/dashboard'}>
                                    Dashboard
                                </NavLink>
                                <NavLink href="/pantry" active={pathname === '/pantry'}>
                                    Pantry
                                </NavLink>
                                <NavLink href="/patients" active={pathname === '/patients'}>
                                    Patients
                                </NavLink>
                                <NavLink href="/deliveries" active={pathname === '/deliveries'}>
                                    Deliveries
                                </NavLink>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center space-x-4">
                        {!user ? (
                            <>
                                <Link 
                                    href="/login"
                                    className="text-muted hover:text-foreground transition"
                                >
                                    Sign In
                                </Link>
                                <Link 
                                    href="/register"
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-muted transition"
                                >
                                    Sign Up
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-muted">
                                    {user.name} ({user.role})
                                </span>
                                <button 
                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-muted transition"
                                    onClick={logout}
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

const NavLink = ({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) => {
    return (
        <Link
            href={href}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition
                ${active 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted hover:text-foreground hover:bg-secondary/50'
                }`}
        >
            {children}
        </Link>
    );
};

export default Navbar; 