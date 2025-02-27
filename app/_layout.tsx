import { Stack, useRouter, usePathname } from "expo-router";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 60 * 1000, // 5 minutes
      gcTime: 60 * 60 * 1000, // 1 hour
      retry: 1,
    },
  },
});

// Protection hook
function ProtectedRouteLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const publicPaths = ['/login', '/signup'];

  useEffect(() => {
    if (loading) return;

    const isPublicRoute = publicPaths.includes(pathname);

    if (!user && !isPublicRoute && !pathname.includes('+not-found')) {
      router.replace('/login');
    } else if (user && isPublicRoute) {
      router.replace('/');
    }
  }, [user, loading, pathname]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <ProtectedRouteLayout />
      </QueryClientProvider>
    </AuthProvider>
  );
}