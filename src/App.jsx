import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from 'next-themes';
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import BottomNav from "./components/BottomNav";
import TopNav from "./components/TopNav";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <TopNav />
          <div className="pt-14 pb-16"> {/* Add padding to the top and bottom to account for both navs */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </div>
          <BottomNav />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;