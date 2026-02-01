import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { DyslexiaProvider } from "@/lib/DyslexiaContext";

import Layout from "./components/layout/Layout";

import Index from "./pages/Index";
import Employee from "./pages/Employee";
import Employer from "./pages/Employer";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import Saved from "./pages/Saved";
import PostJob from "./pages/PostJob";
import ResumeBuilder from "./pages/ResumeBuilder";
import Chat from "./pages/Chat";
import Resources from "./pages/Resources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <DyslexiaProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <BrowserRouter>
            <Routes>
            
              <Route element={<Layout />}>
                <Route path="/" element={<Index />} />
                <Route path="/employee" element={<Employee />} />
                <Route path="/employer" element={<Employer />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/post-job" element={<PostJob />} />
                <Route path="/resume" element={<ResumeBuilder />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>

        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </DyslexiaProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
export default App;
