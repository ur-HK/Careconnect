import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import Browse from "./pages/Browse";
import CaretakerDetail from "./pages/CaretakerDetail";
import CustomerDashboard from "./pages/CustomerDashboard";
import CaretakerDashboard from "./pages/CaretakerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'customer' | 'caretaker' }) => {
  const { user, userRole, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/caretaker/:caretakerId" element={<CaretakerDetail />} />
            <Route 
              path="/customer-dashboard" 
              element={
                <ProtectedRoute allowedRole="customer">
                  <CustomerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/caretaker-dashboard" 
              element={
                <ProtectedRoute allowedRole="caretaker">
                  <CaretakerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
