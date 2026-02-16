"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link"; // Added Link
import {
  ShieldCheck,
  Rocket,
  Users,
  EyeOff,
  AlertTriangle,
  BarChart2,
  Ban,
  Video,
  QrCode,
  Store,
  Wallet,
  Target,
  Shield,
  Banknote,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Globe,
  AtSign,
  CheckCircle2,
  ArrowRight,
  Zap,
  Languages,
  Sparkles,
  Building2,
} from "lucide-react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { HeroVideo } from "@/components/hero-video";
import { useLanguage } from "@/components/providers/language-provider"; // Added import

export default function Page() {
  const { t } = useLanguage(); // Replaced state logic
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="bg-background relative min-h-screen w-full overflow-x-hidden font-sans text-foreground selection:bg-primary/20">
      {/* Background Grid Pattern with parallax */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"
      >
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]" />
      </motion.div>

      <div className="relative flex w-full flex-col">
        {/* Hero Section */}
        <section className="relative flex w-full shrink-0 flex-col items-center pt-32 pb-24 lg:pt-48 lg:pb-32">
          {/* Tag */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="animate-fade-in group mb-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 transition-colors hover:bg-white/10"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1DE1B9] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1DE1B9]"></span>
            </span>
            <p className="text-sm font-medium text-muted-foreground">
              {t.hero.tag}
            </p>
          </motion.div>

          {/* Heading */}
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1]"
            >
              {t.hero.title}
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="block bg-gradient-to-r from-[#1DE1B9] to-[#E11D48] bg-clip-text text-transparent text-3xl sm:text-5xl md:text-6xl lg:text-7xl mt-2 font-bold tracking-tighter"
              >
                {t.hero.titleHighlight}
              </motion.span>
            </motion.h1>
          </div>

          {/* Subheading */}
          <div className="container mx-auto mt-8 max-w-2xl px-4 text-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-lg text-muted-foreground sm:text-xl leading-relaxed"
            >
              {t.hero.subtitle}
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="mt-12 flex w-full flex-col items-center justify-center gap-4 px-4 sm:flex-row"
          >
            <Link href="/influencer/dashboard">
              <Button size="lg" className="group h-12 min-w-[160px] bg-primary text-primary-foreground hover:bg-primary/90 text-base font-bold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/40">
                {t.hero.ctaPrimary}
                <Sparkles className="ml-2 size-4 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
            <Link href="/brand/dashboard">
              <Button size="lg" className="group h-12 min-w-[160px] bg-[#1DE1B9] text-black hover:bg-[#1DE1B9]/90 border-transparent text-base font-bold shadow-[0_0_20px_rgba(29,225,185,0.3)] transition-all hover:shadow-[0_0_30px_rgba(29,225,185,0.5)]">
                {t.hero.ctaSecondary}
                <Building2 className="ml-2 size-4 transition-transform group-hover:scale-110" />
              </Button>
            </Link>
          </motion.div>

          {/* Hero Visual/Stats - Bento Grid Style */}
          <div className="container mx-auto mt-24 px-4">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-8"
            >
              {/* Card 1: Security */}
              <motion.div variants={fadeIn} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1DE1B9]/10 blur-3xl group-hover:bg-[#1DE1B9]/20 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex rounded-xl bg-[#1DE1B9]/10 p-3 text-[#1DE1B9]">
                    <ShieldCheck className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{t.stats.security.title}</h3>
                  <div className="mt-4 flex flex-col items-start gap-1">
                    <span className="text-2xl font-bold tracking-tight text-foreground">{t.stats.security.value}</span>
                    <span className="text-sm text-muted-foreground">{t.stats.security.label}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t.stats.security.desc}
                  </p>
                </div>
              </motion.div>

              {/* Card 2: ROI (Featured) */}
              <motion.div 
                variants={fadeIn}
                whileHover={{ y: -5 }}
                className="group relative overflow-hidden rounded-3xl border border-[#1DE1B9]/20 bg-[#1DE1B9]/5 p-0 transition-all hover:border-[#1DE1B9]/40 md:-mt-8 shadow-2xl shadow-[#1DE1B9]/5 flex flex-col"
              >
                {/* Video Header using Remotion */}
                <div className="relative h-64 w-full bg-black/20 overflow-hidden">
                   <div className="absolute inset-x-0 bottom-0 top-0 z-10 bg-gradient-to-t from-[#1DE1B9]/10 to-transparent pointer-events-none" />
                   <div className="w-full h-full scale-110">
                      <HeroVideo />
                   </div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center p-8 pt-6">
                  <h3 className="text-xl font-bold text-foreground mb-1">{t.stats.roi.title}</h3>
                  <div className="text-3xl font-black tracking-tight text-foreground">{t.stats.roi.value}</div>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {t.stats.roi.label}
                  </p>
                </div>
              </motion.div>

              {/* Card 3: Network */}
              <motion.div variants={fadeIn} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] p-8 transition-colors hover:bg-white/[0.04]">
                <div className="absolute left-0 bottom-0 h-32 w-32 -translate-x-1/2 translate-y-1/2 rounded-full bg-[#E11D48]/10 blur-3xl group-hover:bg-[#E11D48]/20 transition-all duration-500" />
                <div className="relative z-10">
                  <div className="mb-4 inline-flex rounded-xl bg-[#E11D48]/10 p-3 text-[#E11D48]">
                    <Users className="size-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{t.stats.network.title}</h3>
                  <div className="mt-4 flex flex-col items-start gap-1">
                    <span className="text-2xl font-bold tracking-tight text-foreground">{t.stats.network.value}</span>
                    <span className="text-sm text-muted-foreground">{t.stats.network.label}</span>
                  </div>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {t.stats.network.desc}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className="relative w-full border-y border-white/5 bg-black/40 py-24">
          <div className="container mx-auto px-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-16 md:text-center max-w-3xl mx-auto"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t.problem.title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                {t.problem.desc}
              </p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="grid gap-8 md:grid-cols-2 lg:gap-12"
            >
              {/* Problem Card 1 */}
              <motion.div variants={fadeIn} className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 p-8 hover:bg-zinc-900/80 transition-colors duration-300">
                <div className="absolute top-0 right-0 p-32 bg-[#1DE1B9]/5 blur-[100px] rounded-full point" />
                <div className="flex items-start gap-6">
                  <div className="shrink-0 rounded-2xl bg-[#1DE1B9]/10 border border-[#1DE1B9]/10 p-4">
                    <EyeOff className="size-8 text-[#1DE1B9]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t.problem.card1.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {t.problem.card1.desc}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#1DE1B9]">
                      <AlertTriangle className="size-3" />
                      <span>{t.problem.card1.stat}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Problem Card 2 */}
              <motion.div variants={fadeIn} className="relative overflow-hidden rounded-3xl border border-white/5 bg-zinc-900/50 p-8 hover:bg-zinc-900/80 transition-colors duration-300">
                <div className="absolute bottom-0 left-0 p-32 bg-[#E11D48]/5 blur-[100px] rounded-full" />
                <div className="flex items-start gap-6">
                  <div className="shrink-0 rounded-2xl bg-[#E11D48]/10 border border-[#E11D48]/10 p-4">
                    <Ban className="size-8 text-[#E11D48]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{t.problem.card2.title}</h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed">
                      {t.problem.card2.desc}
                    </p>
                    <div className="mt-6 flex items-center gap-2 text-xs font-mono text-[#E11D48]">
                      <BarChart2 className="size-3" />
                      <span>{t.problem.card2.stat}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

         {/* How It Works - Vertical Steps */}
        <section className="w-full py-24 lg:py-32 overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="mb-16">
              <span className="text-sm font-bold tracking-widest text-primary uppercase">{t.steps.tag}</span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {t.steps.title}
              </h2>
            </div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="relative grid gap-12 lg:grid-cols-4"
            >
               {/* Connecting Line (Desktop) */}
              <div className="absolute top-12 left-0 hidden w-full border-t border-dashed border-white/10 lg:block" />

              {[
                {
                  icon: Video,
                  step: "01",
                  title: t.steps.step1.title,
                  desc: t.steps.step1.desc,
                  color: "text-[#E11D48]",
                  bg: "bg-[#E11D48]/10",
                  border: "group-hover:border-[#E11D48]/50"
                },
                {
                  icon: QrCode,
                  step: "02",
                  title: t.steps.step2.title,
                  desc: t.steps.step2.desc,
                  color: "text-white",
                  bg: "bg-white/5",
                  border: "group-hover:border-white/50"
                },
                {
                  icon: Store,
                  step: "03",
                  title: t.steps.step3.title,
                  desc: t.steps.step3.desc,
                  color: "text-[#1DE1B9]",
                  bg: "bg-[#1DE1B9]/10",
                  border: "group-hover:border-[#1DE1B9]/50"
                },
                {
                  icon: Wallet,
                  step: "04",
                  title: t.steps.step4.title,
                  desc: t.steps.step4.desc,
                  color: "text-[#E11D48]",
                  bg: "bg-[#E11D48]/10",
                  border: "group-hover:border-[#E11D48]/50"
                },
              ].map((item, i) => (
                <motion.div variants={fadeIn} key={i} className="relative flex flex-col gap-6 pt-4 group">
                  <div className={`relative z-10 flex size-16 items-center justify-center rounded-2xl border border-white/10 ${item.bg} ${item.border} backdrop-blur-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <item.icon className={`size-8 ${item.color}`} />
                    <div className="absolute -top-3 -right-3 flex size-8 items-center justify-center rounded-full bg-background border border-white/10 text-xs font-bold text-muted-foreground shadow-sm group-hover:bg-[#1DE1B9] group-hover:text-black transition-colors">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground group-hover:text-[#1DE1B9] transition-colors">{item.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Feature/Benefit Section */}
        <section className="relative overflow-hidden border-y border-white/5 bg-zinc-900/20 py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col gap-16 lg:flex-row lg:items-center">
              
              {/* Dashboard Preview (Left) */}
              <motion.div 
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative w-full lg:w-1/2"
              >
                <div className="absolute -inset-4 rounded-[32px] bg-gradient-to-r from-[#1DE1B9]/30 to-[#E11D48]/30 opacity-20 blur-2xl animate-pulse" />
                <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] shadow-2xl hover:scale-[1.01] transition-transform duration-500">
                  {/* Fake UI Header */}
                  <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-6 py-4">
                     <div className="flex items-center gap-4">
                       <div className="size-3 rounded-full bg-[#E11D48]/20" />
                       <div className="size-3 rounded-full bg-yellow-500/20" />
                       <div className="size-3 rounded-full bg-[#1DE1B9]/20" />
                     </div>
                     <div className="text-xs font-mono text-muted-foreground">clippay_dashboard_v2.exe</div>
                  </div>
                  
                  {/* Dashboard Content */}
                  <div className="p-8">
                    <div className="flex items-center justify-between">
                       <div>
                         <p className="text-sm font-medium text-muted-foreground">{t.features.dashboardTitle}</p>
                         <h3 className="mt-1 text-3xl font-bold text-foreground">$12,849.00</h3>
                       </div>
                       <motion.div 
                         animate={{ scale: [1, 1.05, 1] }}
                         transition={{ repeat: Infinity, duration: 2 }}
                         className="rounded-full bg-[#1DE1B9]/10 px-3 py-1 text-xs font-medium text-[#1DE1B9]"
                       >
                         {t.features.dashboardTag}
                       </motion.div>
                    </div>

                    <div className="mt-8 grid grid-cols-7 items-end gap-2 h-32">
                        {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                          <motion.div 
                            key={i} 
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5, type: "spring" }}
                            className="group relative w-full rounded-t-sm bg-[#1DE1B9]/20 transition-all hover:bg-[#1DE1B9]"
                          >
                             {i === 5 && (
                               <motion.div 
                                 initial={{ opacity: 0, y: 10 }}
                                 whileInView={{ opacity: 1, y: 0 }}
                                 transition={{ delay: 1 }}
                                 className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-zinc-800 px-2 py-1 text-xs text-white shadow-xl"
                               >
                                 {t.features.dashboardPayout}
                               </motion.div>
                             )}
                          </motion.div>
                        ))}
                    </div>

                    <div className="mt-8 flex gap-4">
                      <div className="flex-1 rounded-xl bg-zinc-900 border border-white/5 p-4 hover:border-[#1DE1B9]/20 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="rounded-lg bg-[#1DE1B9]/20 p-2 text-[#1DE1B9]"><ShoppingBag className="size-4"/></div>
                           <div>
                             <p className="text-xs text-muted-foreground">{t.features.dashboardSales}</p>
                             <p className="font-bold">42</p>
                           </div>
                        </div>
                      </div>
                      <div className="flex-1 rounded-xl bg-zinc-900 border border-white/5 p-4 hover:border-[#E11D48]/20 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className="rounded-lg bg-[#E11D48]/20 p-2 text-[#E11D48]"><Zap className="size-4"/></div>
                           <div>
                             <p className="text-xs text-muted-foreground">{t.features.dashboardSpeed}</p>
                             <p className="font-bold">Instant</p>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Text Content (Right) */}
              <div className="flex w-full flex-col gap-10 lg:w-1/2 lg:pl-16">
                <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                   {t.features.title}<br/>
                   <span className="bg-gradient-to-r from-[#1DE1B9] to-[#E11D48] bg-clip-text text-transparent">{t.features.titleHighlight}</span>
                </h2>
                
                <motion.div 
                  variants={staggerContainer}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex flex-col gap-8"
                >
                  <motion.div variants={fadeIn} className="flex gap-4 group">
                     <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1DE1B9]/10 border border-[#1DE1B9]/10 transition-colors">
                        <Target className="size-6 text-[#1DE1B9]" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-[#1DE1B9] transition-colors">{t.features.f1.title}</h3>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                           {t.features.f1.desc}
                        </p>
                     </div>
                  </motion.div>
                  <motion.div variants={fadeIn} className="flex gap-4 group">
                     <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#E11D48]/10 border border-[#E11D48]/10 transition-colors">
                        <Shield className="size-6 text-[#E11D48]" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-[#E11D48] transition-colors">{t.features.f2.title}</h3>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                           {t.features.f2.desc}
                        </p>
                     </div>
                  </motion.div>
                  <motion.div variants={fadeIn} className="flex gap-4 group">
                     <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#1DE1B9]/10 border border-[#1DE1B9]/10 transition-colors">
                        <Banknote className="size-6 text-[#1DE1B9]" />
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-[#1DE1B9] transition-colors">{t.features.f3.title}</h3>
                        <p className="mt-2 text-muted-foreground leading-relaxed">
                           {t.features.f3.desc}
                        </p>
                     </div>
                  </motion.div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-32">
           {/* Background Effects */}
           <div className="absolute inset-0 bg-gradient-to-br from-[#1DE1B9]/10 via-[#09090b] to-[#E11D48]/10" />
           
           <div className="container relative z-10 mx-auto px-4 text-center">
              <motion.h2 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight text-foreground sm:text-7xl"
              >
                {t.cta.title}
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="mx-auto mt-6 max-w-2xl text-xl text-muted-foreground"
              >
                {t.cta.subtitle}
              </motion.p>
              
              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                 <Button className="h-14 px-8 text-lg font-bold bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-xl shadow-white/10">
                   {t.cta.primary}
                 </Button>
                 <Button variant="outline" className="h-14 px-8 text-lg bg-black/50 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:text-[#1DE1B9] hover:scale-105 transition-all">
                   {t.cta.secondary}
                 </Button>
              </div>

              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground opacity-60">
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#1DE1B9]" /> {t.cta.noCard}
                 </div>
                 <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-[#E11D48]" /> {t.cta.cancel}
                 </div>
              </div>
           </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-[#050505] py-12">
          <div className="container mx-auto px-4 flex flex-col items-center gap-8">
            <div className="flex items-center gap-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all">
              <div className="relative size-6 shrink-0">
                <Image 
                  src="/logo.png" 
                  alt="Clippay Logo" 
                  fill 
                  className="object-contain"
                />
              </div>
              <span className="text-lg font-bold text-foreground">
                Clippay
              </span>
            </div>
            
            <div className="flex gap-6">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-white/5 rounded-full">
                <Globe className="size-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-white/5 rounded-full">
                <AtSign className="size-5" />
              </a>
            </div>

            <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-muted-foreground/60">
              <a href="#" className="hover:text-foreground transition-colors">{t.footer.links.terms}</a>
              <a href="#" className="hover:text-foreground transition-colors">{t.footer.links.privacy}</a>
              <span>{t.footer.copyright}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
