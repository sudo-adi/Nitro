import { motion } from "framer-motion";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  MessageSquare,
  ChevronLeft,
  PanelLeft,
} from "lucide-react";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isHoveringSidebar: boolean;
  setIsHoveringSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  isHoveringSidebar,
  setIsHoveringSidebar,
}) => {
  const handleSidebarMouseEnter = () => {
    setIsHoveringSidebar(true);
  };
  const handleSidebarMouseLeave = () => {
    if (!isSidebarOpen) {
      setIsHoveringSidebar(false);
    }
  };

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    setIsHoveringSidebar(newState);
  };

  return (
    <>
      <div
        className="fixed left-0 top-0 h-full w-6 z-50"
        onMouseEnter={handleSidebarMouseEnter}
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isHoveringSidebar || isSidebarOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed left-0 top-0 h-full w-64 bg-zinc-800/10 backdrop-blur border-r border-white/20 z-100 overflow-y-auto shadow-[0_0_10px_rgba(0,0,0,0.1)]"
        onMouseEnter={handleSidebarMouseEnter}
        onMouseLeave={handleSidebarMouseLeave}
      >
        <div className="p-4 border-b border-white/20 flex items-center justify-between bg-zinc-950/30">
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <Search className="h-3.5 w-3.5 text-white/50 absolute left-2 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search conversations"
                className="w-full bg-white/5 text-xs rounded-md py-1.5 pl-8 pr-2 text-white/80 border border-white/10 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
              />
            </div>
          </div>
        </div>

        <div className="p-3">
          <Button
            variant="outline"
            className="w-full justify-start text-xs h-9 border-white/10 bg-white/5 hover:bg-white/10 text-white/80 gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        <div className="mt-2 px-2">
          {/* Sample chat history items */}
          {[
            "Social media dashboard",
            "Portfolio website",
            "Expense tracker",
            "Weather app",
            "Task manager",
          ].map((chat, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-2 rounded-md hover:bg-white/10 cursor-pointer text-white/70 hover:text-white/90 text-xs mb-1 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{chat}</span>
            </div>
          ))}
        </div>

        {/* Sidebar footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-white/10 bg-black/10">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span className="text-[10px]">v1.0.0</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-full hover:bg-white/10"
              onClick={() => {
                setIsSidebarOpen(false);
                setIsHoveringSidebar(false);
              }}
            >
              <ChevronLeft className="h-4 w-4 text-white/70" />
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isSidebarOpen ? 0 : 0.7 }}
        transition={{ duration: 0.2 }}
        className="fixed bottom-6 left-6 z-30 bg-zinc-900/70 backdrop-blur-sm p-2 rounded-lg border border-white/10 shadow-lg cursor-pointer"
        onClick={toggleSidebar}
      >
        <PanelLeft className="h-4 w-4 text-white/70" />
      </motion.div>
    </>
  );
};

export default Sidebar;
