import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LeadModalProvider } from "@/contexts/LeadModalContext";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Booking from "./pages/Booking";
import Auth from "./pages/Auth";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import SearchBuses from "./pages/SearchBuses";
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerOverview from "./pages/owner/OwnerOverview";
import RegisterBus from "./pages/owner/RegisterBus";
import MyBuses from "./pages/owner/MyBuses";
import BookingManagement from "./pages/owner/BookingManagement";
import Earnings from "./pages/owner/Earnings";
import AvailabilityManager from "./pages/owner/AvailabilityManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <AuthProvider>
          <LeadModalProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/search" element={<SearchBuses />} />
                {/* Owner routes */}
                <Route path="/owner" element={<OwnerLayout />}>
                  <Route index element={<OwnerOverview />} />
                  <Route path="register" element={<RegisterBus />} />
                  <Route path="buses" element={<MyBuses />} />
                  <Route path="bookings" element={<BookingManagement />} />
                  <Route path="earnings" element={<Earnings />} />
                  <Route path="availability" element={<AvailabilityManager />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </LeadModalProvider>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
