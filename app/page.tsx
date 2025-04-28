"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bot, Calendar, Clock, CreditCard, MailCheck } from "lucide-react";
import { pacifico } from "./fonts";

function ElegantShape({
  className,
  delay = 0,
  width = 400,
  height = 100,
  rotate = 0,
  gradient = "from-white/[0.08]",
}: {
  className?: string;
  delay?: number;
  width?: number;
  height?: number;
  rotate?: number;
  gradient?: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: -150,
        rotate: rotate - 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: rotate,
      }}
      transition={{
        duration: 2.4,
        delay,
        ease: [0.23, 0.86, 0.39, 0.96],
        opacity: { duration: 1.2 },
      }}
      className={cn("absolute", className)}
    >
      <motion.div
        animate={{
          y: [0, 15, 0],
        }}
        transition={{
          duration: 12,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        style={{
          width,
          height,
        }}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full",
            "bg-gradient-to-r to-transparent",
            gradient,
            "backdrop-blur-[2px] border-2 border-white/[0.15]",
            "shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]",
            "after:absolute after:inset-0 after:rounded-full",
            "after:bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_70%)]"
          )}
        />
      </motion.div>
    </motion.div>
  );
}

function FeatureIcon({
  icon: Icon,
  text,
  delay,
}: {
  icon: any;
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: delay,
        ease: [0.25, 0.4, 0.25, 1],
      }}
      className="flex flex-col items-center gap-3 px-4"
    >
      <div className="p-4 rounded-full bg-white/[0.03] border border-white/[0.08]">
        <Icon className="w-6 h-6 text-orange-300" />
      </div>
      <span className="text-sm text-white/70">{text}</span>
    </motion.div>
  );
}

export default function HeroSection() {
  const badge = "EmailChef";
  const title1 = "Cook Up Perfect";
  const title2 = "Email Workflows";

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        delay: 0.5 + i * 0.2,
        ease: [0.25, 0.4, 0.25, 1],
      },
    }),
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#0a0a10]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.05] via-transparent to-purple-500/[0.05] blur-3xl" />

      <div className="absolute inset-0 overflow-hidden">
        <ElegantShape
          delay={0.3}
          width={600}
          height={140}
          rotate={12}
          gradient="from-orange-500/[0.15]"
          className="left-[-10%] md:left-[-5%] top-[15%] md:top-[20%]"
        />

        <ElegantShape
          delay={0.5}
          width={500}
          height={120}
          rotate={-15}
          gradient="from-purple-500/[0.15]"
          className="right-[-5%] md:right-[0%] top-[70%] md:top-[75%]"
        />

        <ElegantShape
          delay={0.4}
          width={300}
          height={80}
          rotate={-8}
          gradient="from-blue-500/[0.15]"
          className="left-[5%] md:left-[10%] bottom-[5%] md:bottom-[10%]"
        />

        <ElegantShape
          delay={0.6}
          width={200}
          height={60}
          rotate={20}
          gradient="from-amber-500/[0.15]"
          className="right-[15%] md:right-[20%] top-[10%] md:top-[15%]"
        />

        <ElegantShape
          delay={0.7}
          width={150}
          height={40}
          rotate={-25}
          gradient="from-teal-500/[0.15]"
          className="left-[20%] md:left-[25%] top-[5%] md:top-[10%]"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            custom={0}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] mb-10 md:mb-14"
          >
            <div className="p-1.5 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full">
              <MailCheck className="w-4 h-4 text-[#0a0a10]" />
            </div>
            <span className="text-sm font-medium text-white/70 tracking-wide font-geist">
              {badge}
            </span>
          </motion.div>

          <motion.div
            custom={1}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold mb-8 md:mb-10 tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-white to-white/80">
                {title1}
              </span>
              <br />
              <span
                className={cn(
                  pacifico.className,
                  "bg-clip-text font-pacifico text-transparent bg-gradient-to-r from-orange-300 via-amber-200 to-purple-300 "
                )}
              >
                {title2}
              </span>
            </h1>
          </motion.div>

          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
          >
            <p className="text-base sm:text-lg md:text-xl text-white/50 mb-10 md:mb-14 leading-relaxed font-light tracking-wide max-w-2xl mx-auto px-4 font-geist">
              Intelligent email management that tracks subscriptions and
              automates repetitive tasks with custom cron jobs for your inbox.
            </p>
          </motion.div>

          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-6 md:gap-10 mb-14 md:mb-16 font-geist"
          >
            <FeatureIcon
              icon={CreditCard}
              text="Subscription Tracking"
              delay={1.2}
            />
            <FeatureIcon icon={Calendar} text="Custom Cron Jobs" delay={1.3} />
            <FeatureIcon icon={Clock} text="Scheduled Tasks" delay={1.4} />
            <FeatureIcon icon={Bot} text="AI Automation" delay={1.5} />
          </motion.div>

          <motion.div
            custom={4}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="mb-16 md:mb-20 "
          >
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full text-white font-medium text-lg shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all duration-300 transform hover:scale-105 font-geist">
              Get Started Free
            </button>
          </motion.div>

          <motion.div
            custom={5}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex justify-center items-center gap-2 text-white/40 font-geist"
          >
            <span>Powered by</span>
            <div className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent font-semibold">
              Convex
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a10] via-transparent to-[#0a0a10]/80 pointer-events-none" />
    </div>
  );
}
