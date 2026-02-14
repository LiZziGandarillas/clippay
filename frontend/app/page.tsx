import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export default function Page() {
  return (
    <div className="bg-background relative min-h-screen w-full overflow-x-hidden font-sans text-foreground selection:bg-primary/20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 flex h-[64px] flex-col items-start border-b border-border bg-background/60 backdrop-blur-[4px]">
        <div className="relative h-[64px] w-full shrink-0">
          <div className="flex size-full items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <CreditCard className="size-5" />
              </div>
              <div className="flex flex-col items-start">
                <p className="text-lg font-bold leading-7 tracking-tighter text-foreground">
                  Clippay
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="hidden text-sm sm:flex">
                Log in
              </Button>
              <Button size="sm" className="h-9 px-4 text-sm font-normal">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex w-full flex-col">
        {/* Hero Section */}
        <div className="relative flex w-full shrink-0 flex-col items-start overflow-hidden pt-[80px] pb-[128px]">
          <div className="absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-primary/20 blur-[60px] opacity-30 pointer-events-none" />
          <div className="relative flex w-full flex-col items-center">
            {/* Tag */}
            <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 mb-8">
              <div className="relative h-2 w-4 flex items-center justify-center">
                <div className="bg-primary size-2 rounded-full" />
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap font-medium">
                Powered by Stellar Blockchain
              </p>
            </div>

            {/* Heading */}
            <div className="flex max-w-[896px] flex-col items-center px-4 text-center">
              <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl leading-tight sm:leading-tight md:leading-tight">
                Advertising that you
                <br />
                only pay for{" "}
                <span className="bg-linear-to-r from-primary to-rose-400 bg-clip-text text-transparent">
                  if you sell
                </span>
              </h1>
            </div>

            {/* Subheading */}
            <div className="mt-6 flex max-w-[672px] flex-col items-center px-4 text-center">
              <p className="text-lg text-muted-foreground sm:text-xl leading-relaxed">
                The performance-driven bridge between local brands and creators.
                Stop paying for likes, start paying for customers through direct
                attribution.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="mt-10 flex w-full flex-col items-center justify-center gap-4 px-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/25 h-12 px-8 text-base">
                I&apos;m a Business
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-transparent border-input hover:bg-accent hover:text-accent-foreground">
                I&apos;m a Creator
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="mt-20 w-full max-w-[1024px] px-4">
              <div className="flex w-full flex-col items-center overflow-hidden rounded-xl border border-border bg-card shadow-xl md:flex-row relative z-10">
                <div className="flex w-full flex-col items-center justify-center gap-2 bg-linear-to-b from-primary/5 to-transparent p-8 md:w-1/3 border-b md:border-b-0 border-border">
                  <p className="text-sm tracking-widest text-muted-foreground uppercase font-medium">
                    Secure Payments
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <ShieldCheck className="size-6 text-primary" />
                    <p className="text-3xl font-bold text-foreground">100%</p>
                  </div>
                </div>
                <div className="relative flex w-full flex-col items-center justify-center gap-2 bg-linear-to-b from-primary/5 to-transparent p-8 md:w-1/3 border-b md:border-b-0 border-border md:border-l md:border-r">
                  <p className="text-sm tracking-widest text-muted-foreground uppercase font-medium">
                    Avg ROI
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Rocket className="size-6 text-primary" />
                    <p className="text-3xl font-bold text-foreground">2.4x</p>
                  </div>
                </div>
                <div className="flex w-full flex-col items-center justify-center gap-2 bg-linear-to-b from-primary/5 to-transparent p-8 md:w-1/3">
                  <p className="text-sm tracking-widest text-muted-foreground uppercase font-medium">
                    Active Creators
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Users className="size-6 text-primary" />
                    <p className="text-3xl font-bold text-foreground">5k+</p>
                  </div>
                </div>
              </div>
              <div className="h-px w-full bg-linear-to-r from-transparent via-primary/50 to-transparent mt-px" />
            </div>
          </div>
        </div>

        {/* The Invisible Gap Section */}
        <div className="bg-zinc-900/30 w-full shrink-0 flex-col items-start py-24 relative">
            <div className="absolute inset-0 bg-background/50 backdrop-blur-[2px] -z-10" />
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4">
            <div className="mx-auto flex w-full max-w-[768px] flex-col gap-6 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                The Invisible Gap in
                <br />
                Marketing
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Current platforms reward empty metrics.
                <br className="hidden sm:inline" />
                We focus on what actually moves the needle: Sales.
              </p>
            </div>

            <div className="grid w-full gap-8 md:grid-cols-2">
              <div className="relative h-[380px] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm group hover:border-red-900/30 transition-colors">
                <div className="absolute top-8 left-8 flex items-start rounded-lg border border-red-900/50 bg-red-950/50 p-3">
                  <EyeOff className="size-6 text-red-500" />
                </div>
                <div className="absolute top-[130px] left-8 right-8 flex flex-col items-start">
                  <h3 className="text-xl font-semibold text-foreground">
                    The Blindness of Investment
                  </h3>
                  <div className="mt-4 text-muted-foreground">
                    <p className="leading-relaxed text-sm sm:text-base">
                      Businesses waste thousands on "impressions" and "likes"
                      without ever knowing if those views turned into real
                      customers. It&apos;s time to stop guessing.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 rounded-full border border-red-900/30 bg-red-950/30 px-4 py-2 w-fit">
                    <AlertTriangle className="size-4 text-red-400 shrink-0" />
                    <p className="text-sm text-red-400 font-medium">
                      Ad spend waste is at an all-time high.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-[380px] w-full overflow-hidden rounded-xl border border-white/10 bg-zinc-900/60 backdrop-blur-sm group hover:border-amber-900/30 transition-colors">
                <div className="absolute top-8 left-8 flex items-start rounded-lg border border-yellow-900/50 bg-yellow-950/50 p-3">
                  <BarChart2 className="size-6 text-amber-500" />
                </div>
                <div className="absolute top-[130px] left-8 right-8 flex flex-col items-start">
                  <h3 className="text-xl font-semibold text-foreground">
                    The Micro-influencer Ceiling
                  </h3>
                  <div className="mt-4 text-muted-foreground">
                    <p className="leading-relaxed text-sm sm:text-base">
                      Great creators are ignored because they don&apos;t have 1M
                      followers. Real influence happens in local communities,
                      but it&apos;s hard to monetize fairly.
                    </p>
                  </div>
                  <div className="mt-8 flex items-center gap-2 rounded-full border border-yellow-900/30 bg-yellow-950/30 px-4 py-2 w-fit">
                    <Ban className="size-4 text-amber-400 shrink-0" />
                    <p className="text-sm text-amber-400 font-medium">
                      Low follower count ≠ Low impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How Clip&Cash Works */}
        <div className="w-full shrink-0 flex-col items-start px-4 py-24 bg-background">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-16">
            <div className="flex w-full flex-col items-center gap-4 text-center">
              <div className="w-full max-w-2xl">
                <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  How Clip&Cash Works
                </h2>
                <p className="mt-6 text-lg text-muted-foreground">
                  From content creation to instant payouts in 4 simple steps.
                </p>
              </div>
            </div>

            <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: Video,
                  title: "1. Create Content",
                  desc: "Creators generate authentic videos for local brands showcasing products.",
                },
                {
                  icon: QrCode,
                  title: "2. Customer Scans",
                  desc: "Your audience uses your unique code or QR to buy at the store.",
                },
                {
                  icon: Store,
                  title: "3. Sale Completed",
                  desc: "The sale is tracked and attributed directly to your profile automatically.",
                },
                {
                  icon: Wallet,
                  title: "4. Instant Payout",
                  desc: "Stellar Smart Contracts release your commission instantly.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="relative flex w-full flex-col items-start overflow-hidden rounded-xl border border-border bg-card p-8 transition-all hover:bg-zinc-900/50"
                >
                  <div className="absolute inset-0 bg-linear-to-b from-primary/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                  <div className="bg-primary/10 border-primary/20 relative mb-6 flex size-12 items-center justify-center rounded-lg border">
                    <item.icon className="size-6 text-primary" />
                  </div>
                  <h4 className="relative text-xl font-bold text-foreground mb-2">
                    {item.title}
                  </h4>
                  <p className="relative text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marketing that Scales */}
        <div className="bg-zinc-900/20 border-y border-border px-4 py-24">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 lg:flex-row lg:items-center">
            <div className="flex w-full flex-col gap-8 lg:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl leading-tight">
                Marketing that actually
                <br />
                scales your business
              </h2>
              <div className="flex flex-col gap-4">
                {[
                  {
                    icon: Target,
                    title: "Direct Attribution",
                    desc: "No more guessing. Know exactly which creator brought which customer to your door.",
                  },
                  {
                    icon: Shield,
                    title: "Blockchain Transparency",
                    desc: "Escrow payments powered by Stellar ensure both parties are protected and payments are automated.",
                  },
                  {
                    icon: Banknote,
                    title: "Risk-Free Growth",
                    desc: "Forget upfront fees. Only pay commissions on confirmed sales. Your budget is 100% efficient.",
                  },
                ].map((feature, i) => (
                  <div
                    key={i}
                    className="flex gap-5 rounded-xl border border-transparent p-5 transition-colors hover:bg-card hover:border-border hover:shadow-sm"
                  >
                    <div className="bg-primary/20 flex size-12 shrink-0 items-center justify-center rounded-full mt-1">
                      <feature.icon className="size-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-foreground">
                        {feature.title}
                      </h4>
                      <p className="mt-2 text-base text-muted-foreground leading-relaxed">
                        {feature.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative w-full lg:w-1/2 mt-8 lg:mt-0">
              <div className="absolute inset-[-4px] rounded-3xl bg-linear-to-r from-primary/40 to-purple-600/40 opacity-40 blur-xl" />
              <div className="relative w-full overflow-hidden rounded-2xl border border-border bg-zinc-950 p-6 shadow-2xl">
                {/* Header of card */}
                <div className="mb-8 flex items-center justify-between border-b border-border/50 pb-6">
                  <div className="flex items-center gap-4">
                    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-md">
                        R
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        Real-time Performance
                      </h3>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
                        Live Campaign Data
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1">
                    <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-xs font-medium text-green-500">Live</span>
                  </div>
                </div>

                {/* Main metric */}
                <div className="mb-8 flex items-end justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Total Revenue
                    </p>
                    <p className="text-4xl font-bold tracking-tight text-foreground">
                      $12,849.00
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-1 text-emerald-500">
                      <TrendingUp className="size-5" />
                      <span className="text-base font-bold">+24.5%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      vs last month
                    </p>
                  </div>
                </div>

                {/* Chart Mockup */}
                <div className="mb-8 flex h-24 items-end justify-between gap-1.5 px-2">
                  {[30, 45, 25, 60, 40, 75, 55].map((h, i) => (
                    <div
                      key={i}
                      className="w-full flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                  <div
                    className="w-full flex-1 rounded-t-sm bg-primary shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                    style={{ height: "65%" }}
                  />
                  {[45, 65, 35, 50, 80].map((h, i) => (
                    <div
                      key={i + 10}
                      className="w-full flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/30 transition-colors cursor-pointer"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>

                {/* Sub metrics */}
                <div className="flex gap-4">
                  <div className="bg-zinc-900 flex flex-1 flex-col gap-3 rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                       <ShoppingBag className="size-4 text-muted-foreground" />
                       <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sales Today</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">42</p>
                  </div>
                  <div className="bg-zinc-900 flex flex-1 flex-col gap-3 rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                       <CreditCard className="size-4 text-muted-foreground" />
                       <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Payouts Sent</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">$124.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="relative w-full overflow-hidden py-32 bg-background">
          <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 mt-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
          <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 text-center z-10">
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Ready to change how you
              <br />
              grow?
            </h2>
            <p className="max-w-2xl text-xl text-muted-foreground leading-relaxed">
              Join the new era of performance marketing. Secure, transparent, and
              built for real results.
            </p>
            <div className="mt-4 flex flex-col gap-4 sm:flex-row w-full justify-center">
              <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20 h-14 px-10 text-lg">
                Get Started as Brand
              </Button>
              <Button size="lg" variant="outline" className=" bg-background/50 backdrop-blur-sm w-full sm:w-auto h-14 px-10 text-lg">
                Sign up as Creator
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-background border-t border-border pt-20 pb-10">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-16 flex flex-col justify-between gap-12 lg:flex-row text-center lg:text-left">
              <div className="flex flex-col gap-6 lg:max-w-sm items-center lg:items-start">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                    <CreditCard className="size-5" />
                  </div>
                  <span className="text-xl font-bold text-foreground tracking-tight">
                    Clippay
                  </span>
                </div>
                <p className="text-base leading-relaxed text-muted-foreground">
                  The first performance-based marketplace for local influencer
                  marketing powered by Stellar Blockchain technology.
                </p>
                <div className="flex gap-4">
                  <a href="#" className="bg-zinc-900 border border-border hover:bg-zinc-800 transition-colors flex size-10 items-center justify-center rounded-full group">
                    <Globe className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                  <a href="#" className="bg-zinc-900 border border-border hover:bg-zinc-800 transition-colors flex size-10 items-center justify-center rounded-full group">
                    <AtSign className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-16 ">
                <div className="flex flex-col gap-6 min-w-[200px]">
                  <h4 className="font-bold text-foreground text-lg">Product</h4>
                  <ul className="flex flex-col gap-4 text-base text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">For Businesses</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">For Creators</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Stellar Tech</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
                  </ul>
                </div>
                <div className="flex flex-col gap-6 min-w-[200px]">
                  <h4 className="font-bold text-foreground text-lg">Company</h4>
                  <ul className="flex flex-col gap-4 text-base text-muted-foreground">
                    <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                    <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t border-border pt-10 text-center">
               <p className="text-sm text-muted-foreground">
                 © 2024 Clip&Cash Inc. All rights reserved.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
