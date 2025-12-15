"use client";

import { BorderBeam } from "@/components/magicui/border-beam";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";
import { ImagePlus, Link, Send } from "lucide-react";
import { AuthDialog } from "@/components/custom/AuthDialog";
import NavBar from "@/components/custom/NavBar";
import LeftSidebar from "@/components/custom/LeftSidebar";
import { useUser } from "@clerk/nextjs";
import NitroText from "@/components/custom/NitroText";
import Footer from "@/components/custom/Footer";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { toast } from "sonner";

export const LandingPage = () => {
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { isSignedIn, isLoaded, user } = useUser();
  const [inputValue, setInputValue] = useState("");

  const router = useRouter();

  const handleSidebarMouseEnter = () => {
    setIsHoveringSidebar(true);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const createSession = useMutation(api.session.CreateSession);
  const createUser = useMutation(api.users.CreateUser);
  const getUser = useMutation(api.users.GetUser);

  useEffect(() => {
    async function checkAndCreateUser() {
      if (isLoaded && isSignedIn && user) {
        try {
          // Check if user exists in Convex
          const existingUser = await getUser({
            email: user.primaryEmailAddress?.emailAddress || "",
          });

          if (!existingUser) {
            await createUser({
              name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
              email: user.primaryEmailAddress?.emailAddress || "",
              picture: user.imageUrl || "",
              uid: user.id,
            });
            console.log("New user created in database");
          }
        } catch (error) {
          console.error("Error checking/creating user:", error);
        }
      }
    }

    checkAndCreateUser();
  }, [isLoaded, isSignedIn, user, createUser, getUser]);

  const handleGenerate = async (input: string) => {
    if (!input.trim()) return;

    if (!isSignedIn) {
      setShowAuthDialog(true);
      return;
    }
    setIsGenerating(true);
    try {
      const convexUser = await getUser({
        email: user?.primaryEmailAddress?.emailAddress || "",
      });
      const sessionId = await createSession({
        message: { role: "user", content: input },
        user: convexUser._id,
      });
      router.push("/project/" + sessionId);
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Failed to create project:");
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-0/20 via-zinc-950/70 to-cyan-950/50 text-white flex flex-col items-center overflow-hidden relative">
      <LeftSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        isHoveringSidebar={isHoveringSidebar}
        setIsHoveringSidebar={setIsHoveringSidebar}
      />
      <NavBar />
      <div className="flex flex-col w-full max-w-4xl mx-auto p-8 items-center justify-center text-center flex-1 gap-8 z-10 mt-[-10rem]">
        <motion.div
          className="relative group"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            delay: 0.2,
          }}
        >
          <Image
            src={"/logo.png"}
            alt={"Nitro logo"}
            width={120}
            height={120}
            className="relative z-10 logo-pulse pb-8"
          />
        </motion.div>

        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <span className="text-3xl md:text-5xl font-semibold text-zinc-300 leading-tight tracking-tight mr-1">
              Ask
            </span>
            <NitroText className="mb-0" />
            <span className="text-3xl md:text-5xl font-semibold text-zinc-300 leading-tight tracking-tight">
              To Build!
            </span>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-zinc-500 text-sm md:text-base max-w-md mx-auto"
          >
            Have an idea? Nitro brings it to life—no effort needed.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-lg border z-100 border-white/20 rounded-lg shadow-[0_0_8px_rgba(255,255,255,0.1)] hover:shadow-[0_0_8px_rgba(255,255,255,0.15)] transition-all bg-gradient-to-r from-zinc-950/50 via-cyan-950/30 to-zinc-950/50 animate-gradient-x backdrop-blur-sm relative overflow-hidden"
        >
          <BorderBeam
            duration={6}
            size={100}
            className="from-transparent via-cyan-500 opacity-65 to-transparent"
          />
          <BorderBeam
            duration={6}
            initialOffset={18}
            delay={80}
            size={100}
            className="from-transparent via-pink-400 opacity-65 to-transparent"
          />
          <div className="relative">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate(inputValue);
                }
              }}
              placeholder=""
              className="bg-transparent rounded-none z-100 rounded-t-md border-none text-white text-sm py-3 min-h-[80px] resize-none focus:ring-0 focus:outline-none w-full px-4"
              style={{ boxShadow: "none" }}
            />
            {!inputValue && (
              <div className="absolute top-3 left-4 text-zinc-500 text-sm pointer-events-none">
                <span className="text-zinc-500">Ask Nitro to </span>
                <Typewriter
                  words={[
                    "create an app...",
                    "build a social media dashboard...",
                    "design a portfolio website...",
                    "make an expense tracker...",
                    "build a workout planner...",
                  ]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={65}
                  deleteSpeed={35}
                  delaySpeed={150}
                />
              </div>
            )}
          </div>
          <div className="flex justify-between items-center p-1 px-2 pl-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                title="Attach image"
              >
                <ImagePlus className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                title="Add link"
              >
                <Link className="h-4 w-4" />
              </motion.button>
            </div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="link"
                size="sm"
                className="h-8 text-xs text-zinc-300 hover:text-white px-4"
                onClick={() => handleGenerate(inputValue)}
                disabled={isGenerating || !inputValue.trim()}
              >
                {isGenerating ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-white/80 rounded-full border-t-transparent"
                  />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-2 w-full max-w-2xl mx-auto mt-2 mb-8"
        >
          {[
            "Expense tracker",
            "Social media dashboard",
            "Hacker News top 100",
            "Habit tracker",
            "Recipe finder",
            "Workout planner",
            "Portfolio website",
            "Note taking app",
            "Weather dashboard",
            "Task manager",
          ].map((suggestion) => (
            <motion.div
              key={suggestion}
              whileHover={{
                scale: 1.05,
                backgroundColor: "rgba(8, 145, 178, 0.1)",
                borderColor: "rgba(14, 165, 233, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setInputValue(suggestion);
                handleGenerate(suggestion);
              }}
              className="px-3 opacity-75 py-1.5 border border-cyan-300/20 rounded-full text-zinc-400 text-xs hover:text-cyan-200 transition-all cursor-pointer flex items-center gap-1"
            >
              {suggestion}
              <Send className="ml-0.5 h-[10px] w-[10px]" />
            </motion.div>
          ))}
        </motion.div>
      </div>
      <AuthDialog isOpen={showAuthDialog} onOpenChange={setShowAuthDialog} />
      <Footer />
    </div>
  );
};
