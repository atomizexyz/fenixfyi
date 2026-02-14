"use client";

import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import NumberFlow from "@number-flow/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FenixLogo } from "@/components/icons";
import { useCooldownUnlockTs } from "@/hooks/use-fenix-contract";
import { useCountdown } from "@/hooks/use-countdown";
import { mainnet } from "wagmi/chains";

const ORB_CONFIG = [
  { size: 320, x: "15%", y: "20%", delay: 0, duration: 18, color: "rgba(249, 115, 22, 0.15)" },
  { size: 240, x: "75%", y: "60%", delay: 2, duration: 22, color: "rgba(239, 68, 68, 0.12)" },
  { size: 180, x: "50%", y: "30%", delay: 4, duration: 16, color: "rgba(245, 158, 11, 0.10)" },
  { size: 280, x: "85%", y: "15%", delay: 1, duration: 20, color: "rgba(249, 115, 22, 0.08)" },
  { size: 200, x: "25%", y: "75%", delay: 3, duration: 24, color: "rgba(220, 38, 38, 0.10)" },
];

const PARTICLE_COUNT = 20;

const EMBER_COLORS = [
  "bg-fenix-400/60",
  "bg-fenix-500/70",
  "bg-ember-400/60",
  "bg-amber-400/50",
  "bg-orange-300/60",
];

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {ORB_CONFIG.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
          }}
          animate={{
            x: [0, 30, -20, 15, 0],
            y: [0, -25, 15, -10, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
        const size = 2 + Math.random() * 5;
        const startX = Math.random() * 100;
        const duration = 5 + Math.random() * 8;
        const delay = Math.random() * 4;
        const color = EMBER_COLORS[i % EMBER_COLORS.length];
        const drift = (Math.random() - 0.5) * 120;
        const flickerMid = 0.6 + Math.random() * 0.4;

        return (
          <motion.div
            key={i}
            className={`absolute rounded-full ${color}`}
            style={{
              width: size,
              height: size,
              left: `${startX}%`,
              bottom: -10,
              boxShadow: `0 0 ${size * 2}px ${size}px rgba(249, 115, 22, 0.3)`,
            }}
            animate={{
              y: [0, -900],
              x: [0, drift * 0.4, drift, drift * 0.6],
              opacity: [0, 1, flickerMid, 1, 0.7, 0],
              scale: [1, 1.3, 0.8, 1.1, 0.6],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        );
      })}
    </div>
  );
}

function FlushCountdownDisplay() {
  const t = useTranslations("hero");
  const { data: cooldownUnlockTs } = useCooldownUnlockTs(mainnet.id);

  const target = useMemo(() => {
    if (!cooldownUnlockTs) return 0;
    return Number(cooldownUnlockTs);
  }, [cooldownUnlockTs]);

  const { days, hours, minutes, seconds, ready } = useCountdown(target);

  if (!target) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-ash-200/60 bg-white/60 px-5 py-3 backdrop-blur-md dark:border-ash-800/60 dark:bg-ash-900/60"
    >
      <span className="text-sm font-medium text-ash-500 dark:text-ash-400">
        {t("next_flush")}
      </span>
      {ready ? (
        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
          {t("flush_ready")}
        </span>
      ) : (
        <span className="flex items-center gap-1 font-mono text-sm font-bold text-ash-900 dark:text-ash-100">
          {days > 0 && (
            <>
              <NumberFlow
                value={days}
                transformTiming={{ duration: 400, easing: "ease-out" }}
              />
              <span className="text-ash-400 font-normal">d</span>
            </>
          )}
          <NumberFlow
            value={hours}
            format={{ minimumIntegerDigits: days > 0 ? 2 : 1 }}
            transformTiming={{ duration: 400, easing: "ease-out" }}
          />
          <span className="text-ash-400 font-normal">h</span>
          <NumberFlow
            value={minutes}
            format={{ minimumIntegerDigits: 2 }}
            transformTiming={{ duration: 400, easing: "ease-out" }}
          />
          <span className="text-ash-400 font-normal">m</span>
          <NumberFlow
            value={seconds}
            format={{ minimumIntegerDigits: 2 }}
            transformTiming={{ duration: 400, easing: "ease-out" }}
          />
          <span className="text-ash-400 font-normal">s</span>
        </span>
      )}
    </motion.div>
  );
}

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
      {/* Background effects */}
      <FloatingOrbs />
      <FloatingParticles />

      {/* Radial gradient overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(255,255,255,0.8)_70%)] dark:bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(10,10,10,0.85)_70%)]" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-fenix-500 to-ember-500 shadow-lg shadow-fenix-500/30 sm:h-20 sm:w-20">
              <FenixLogo className="h-10 w-10 sm:h-12 sm:w-12 [&_path]:fill-white" />
            </div>
            {/* Glow ring */}
            <motion.div
              className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-fenix-500/20 to-ember-500/20 blur-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          <span className="gradient-text">{t("title")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ash-600 dark:text-ash-400 sm:text-xl"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Button asChild size="lg" className="min-w-[180px]">
            <Link href="/burn">
              <FenixLogo className="h-4 w-4" />
              {t("cta_burn")}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="min-w-[180px]">
            <Link href="#features">
              {t("cta_learn")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Flush Countdown */}
        <FlushCountdownDisplay />

        {/* Decorative bottom gradient line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="mx-auto mt-16 h-px w-full max-w-md bg-gradient-to-r from-transparent via-fenix-500/50 to-transparent"
        />
      </div>
    </section>
  );
}
