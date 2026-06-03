"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, CheckCircle2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const languages = [
  { code: "en", name: "English", region: "Global" },
  { code: "fr", name: "Français", region: "West & Central Africa" },
  { code: "pt", name: "Português", region: "Brazil, Angola, Cape Verde" },
  { code: "es", name: "Español", region: "Latin America" },
  { code: "ar", name: "العربية", region: "North Africa & Middle East" },
  { code: "sw", name: "Kiswahili", region: "East Africa" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as any, stiffness: 300, damping: 24 } },
};

export default function LanguageSelection() {
  const [selectedLang, setSelectedLang] = useState<string | null>(null);
  const router = useRouter();

  const handleContinue = () => {
    if (selectedLang) {
      // In a real app, save to context/cookie/localstorage
      router.push("/role");
    }
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl mx-auto space-y-12"
      >
        <div className="text-center space-y-6 pt-8">
          <div className="flex justify-center mb-10">
            <img 
              src="/logo.png" 
              alt="Rheodemy Logo" 
              className="h-20 sm:h-28 w-auto object-contain drop-shadow-2xl" 
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Choose your <span className="text-primary">language</span>
          </h1>
          <p className="text-lg text-foreground/70 max-w-lg mx-auto">
            Select your preferred language to get started with Rheodemy. You can always change this later in settings.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {languages.map((lang) => (
            <motion.button
              key={lang.code}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedLang(lang.code)}
              className={`relative flex flex-col items-start p-6 rounded-2xl transition-all duration-200 text-left w-full glass
                ${
                  selectedLang === lang.code
                    ? "ring-2 ring-primary bg-primary/5 shadow-md shadow-primary/20"
                    : "hover:bg-foreground/5"
                }
              `}
            >
              <div className="flex justify-between w-full items-center mb-2">
                <span className="text-xl font-semibold">{lang.name}</span>
                {selectedLang === lang.code && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" as any, stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </motion.div>
                )}
              </div>
              <span className="text-sm text-foreground/60">{lang.region}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: selectedLang ? 1 : 0 }}
          className="flex justify-center pt-8"
        >
          <button
            onClick={handleContinue}
            disabled={!selectedLang}
            className="group relative flex items-center gap-2 px-8 py-4 bg-foreground text-background rounded-full font-semibold text-lg overflow-hidden transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer"
          >
            <span className="relative z-10">Continue</span>
            <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </motion.div>
      </motion.div>
    </main>
  );
}
