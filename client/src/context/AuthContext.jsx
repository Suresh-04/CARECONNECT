
import {
    createContext,
    useContext,
    useEffect,
    useState
} from 'react';

import { supabase } from '../config/supabaseClient';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = async (userId) => {
        if (!supabase || !userId) {
            setProfile(null);
            return null;
        }

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            console.error('Profile loading error:', error.message);
            setProfile(null);
            return null;
        }

        setProfile(data);
        return data;
    };

    const syncSession = async (currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
            await loadProfile(currentSession.user.id);
        } else {
            setProfile(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        let active = true;

        const initializeAuth = async () => {
            const { data, error } = await supabase.auth.getSession();

            if (error) {
                console.error('Session error:', error.message);
            }

            if (active) {
                await syncSession(data?.session ?? null);
            }
        };

        initializeAuth();

        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange(
            (_event, currentSession) => {
                if (active) {
                    setSession(currentSession);
                    setUser(currentSession?.user ?? null);

                    if (!currentSession?.user) {
                        setProfile(null);
                        setLoading(false);
                    } else {
                        setLoading(true);

                        // Defer the profile request until the auth callback completes.
                        setTimeout(() => {
                            if (active) {
                                loadProfile(currentSession.user.id)
                                    .finally(() => {
                                        if (active) setLoading(false);
                                    });
                            }
                        }, 0);
                    }
                }
            }
        );

        return () => {
            active = false;
            subscription.unsubscribe();
        };
    }, []);

    const signUp = async ({
        email,
        password,
        fullName,
        role = 'patient'
    }) => {
        if (!supabase) {
            return {
                data: null,
                error: new Error('Supabase is not configured.')
            };
        }

        const allowedRoles = ['patient', 'doctor', 'blood_donor'];

        if (!allowedRoles.includes(role)) {
            return {
                data: null,
                error: new Error('This role cannot register publicly.')
            };
        }

        return await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    role
                }
            }
        });
    };

    const signIn = async ({ email, password }) => {
        if (!supabase) {
            return {
                data: null,
                error: new Error('Supabase is not configured.')
            };
        }

        return await supabase.auth.signInWithPassword({
            email,
            password
        });
    };

    const signOut = async () => {
        if (!supabase) {
            return { error: new Error('Supabase is not configured.') };
        }

        return await supabase.auth.signOut();
    };

    const refreshProfile = async (userId = null) => {
        if (!supabase) return null;

        let targetUserId = userId || user?.id || session?.user?.id;

        if (!targetUserId) {
            const { data, error } = await supabase.auth.getUser();

            if (error) {
                console.error('Unable to identify current user:', error.message);
                return null;
            }

            targetUserId = data?.user?.id;
        }

        if (!targetUserId) return null;

        return await loadProfile(targetUserId);
    };

    return (
        <AuthContext.Provider
            value={{
                session,
                user,
                profile,
                loading,
                signUp,
                signIn,
                signOut,
                refreshProfile
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            'useAuth must be used inside an AuthProvider'
        );
    }

    return context;
}


