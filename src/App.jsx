import { useEffect, useMemo, useState } from 'react'
import {
  BatteryCharging,
  Droplets,
  Hexagon,
  Instagram,
  Linkedin,
  Activity,
  Twitter,
  Watch,
} from 'lucide-react'

const LAUNCH_DATE = new Date('2026-09-15T00:00:00')

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Specs', href: '#specs' },
  { label: 'Countdown', href: '#countdown' },
]

const FEATURES = [
  {
    icon: Hexagon,
    title: 'Titanium Unibody',
    description: 'Durable & ultra-lightweight',
  },
  {
    icon: Activity,
    title: 'Bio-Sensor Matrix',
    description: 'Real-time AI health tracking',
  },
  {
    icon: BatteryCharging,
    title: '14-Day Battery',
    description: 'Fast wireless charging',
  },
  {
    icon: Droplets,
    title: '50m Water Resistant',
    description: 'Built for extremes',
  },
]

function getTimeLeft(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds }
}

function pad(value) {
  return String(value).padStart(2, '0')
}

function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(LAUNCH_DATE))
  const [tickKey, setTickKey] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft(getTimeLeft(LAUNCH_DATE))
      setTickKey((k) => k + 1)
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const units = useMemo(
    () => [
      { label: 'Days', value: timeLeft.days },
      { label: 'Hours', value: timeLeft.hours },
      { label: 'Minutes', value: timeLeft.minutes },
      { label: 'Seconds', value: timeLeft.seconds },
    ],
    [timeLeft],
  )

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
      {units.map((unit) => (
        <div
          key={unit.label}
          className="glass-panel rounded-2xl px-3 py-5 text-center transition duration-300 hover:border-cyan-400/40 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
        >
          <div
            key={`${unit.label}-${tickKey}`}
            className="animate-tick-pop font-display text-3xl font-semibold tracking-wider text-white sm:text-4xl md:text-5xl"
          >
            {pad(unit.value)}
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400 sm:text-sm">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  )
}

function ProductVisual() {
  return (
    <div className="relative mx-auto flex h-[340px] w-full max-w-md items-center justify-center sm:h-[420px]">
      <div className="animate-glow-pulse absolute inset-[12%] rounded-full bg-cyan-400/30" />
      <div className="absolute inset-[18%] rounded-full bg-blue-500/20 blur-3xl" />

      <div className="animate-ring-spin absolute h-64 w-64 rounded-full border border-dashed border-cyan-400/25 sm:h-80 sm:w-80" />
      <div className="absolute h-52 w-52 rounded-full border border-cyan-400/15 sm:h-64 sm:w-64" />

      <div className="animate-watch-float relative z-10 flex h-56 w-40 flex-col items-center justify-center rounded-[2rem] border border-cyan-300/30 bg-gradient-to-b from-slate-200/15 via-slate-900/90 to-black shadow-[0_0_60px_rgba(0,229,255,0.35)] sm:h-72 sm:w-48 sm:rounded-[2.5rem]">
        <div className="absolute -top-3 h-3 w-16 rounded-full bg-gradient-to-r from-slate-500 to-slate-300 opacity-80" />
        <div className="absolute -bottom-3 h-3 w-16 rounded-full bg-gradient-to-r from-slate-500 to-slate-300 opacity-80" />

        <div className="flex h-[78%] w-[78%] flex-col items-center justify-center rounded-[1.6rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(0,229,255,0.25),transparent_45%),linear-gradient(160deg,#0b1220,#05070a)] shadow-inner sm:rounded-[2rem]">
          <Watch className="mb-3 h-8 w-8 text-cyan-300 drop-shadow-[0_0_12px_rgba(0,229,255,0.8)] sm:h-10 sm:w-10" />
          <p className="font-display text-[10px] tracking-[0.35em] text-cyan-300/90 sm:text-xs">
            AURA
          </p>
          <p className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">
            09:41
          </p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-slate-400 sm:text-xs">
            Limited
          </p>
          <div className="mt-4 h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(0,229,255,0.9)]" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [alreadyRegistered, setAlreadyRegistered] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [preorderCount, setPreorderCount] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch('/api/preorders/count')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => {
        if (!cancelled) setPreorderCount(data.count)
      })
      .catch(() => {
        if (!cancelled) setPreorderCount(null)
      })
    return () => {
      cancelled = true
    }
  }, [submitted])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email.trim() || submitting) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/preorders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.error || 'Request failed')
      }

      setAlreadyRegistered(Boolean(data.alreadyRegistered))
      setSubmitted(true)
      setEmail('')
    } catch (err) {
      setSubmitError(err.message || 'Could not join the list. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-aura-black text-slate-100">
      {/* Atmosphere */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(22,29,39,0.65),transparent_55%)]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-aura-black/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <a
            href="#top"
            className="font-display text-sm font-semibold tracking-[0.28em] text-white transition hover:text-cyan-300 sm:text-base"
          >
            AURA WEAR
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-300 transition hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#preorder"
              className="hidden rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-sm font-semibold text-aura-black shadow-[0_0_24px_rgba(0,229,255,0.35)] transition duration-300 hover:scale-[1.04] hover:shadow-[0_0_36px_rgba(0,229,255,0.55)] sm:inline-flex"
            >
              Pre-order
            </a>
            <button
              type="button"
              aria-label="Toggle menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-200 md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="sr-only">Menu</span>
              <div className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-5 bg-current" />
                <span className="block h-0.5 w-4 bg-current" />
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-white/5 bg-aura-charcoal/95 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-300"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#preorder"
                onClick={() => setMenuOpen(false)}
                className="mt-1 inline-flex w-fit rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-5 py-2 text-sm font-semibold text-aura-black"
              >
                Pre-order
              </a>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:pb-28 lg:pt-20">
          <div className="animate-fade-up order-2 lg:order-1">
            <p className="mb-4 font-display text-xs font-semibold tracking-[0.4em] text-cyan-300 sm:text-sm">
              AURA WEAR
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight tracking-wide text-white sm:text-5xl lg:text-6xl">
              The Future on Your Wrist
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg">
              Next-generation health tracking, sleek titanium body, and 14-day
              battery life. Designed for those who live in tomorrow.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#preorder"
                className="group inline-flex items-center justify-center rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 text-sm font-semibold text-aura-black shadow-[0_0_28px_rgba(0,229,255,0.35)] transition duration-300 hover:scale-[1.05] hover:shadow-[0_0_42px_rgba(0,229,255,0.6)]"
              >
                Pre-Order Now
                <span className="ml-2 transition group-hover:translate-x-0.5">
                  →
                </span>
              </a>
              <a
                href="#features"
                className="text-sm text-slate-300 underline-offset-4 transition hover:text-cyan-300 hover:underline"
              >
                Explore features
              </a>
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-slate-500">
              Limited Edition Launch · Aura Smartwatch
            </p>
          </div>

          <div className="animate-fade-up order-1 lg:order-2" style={{ animationDelay: '120ms' }}>
            <ProductVisual />
          </div>
        </section>

        {/* Countdown */}
        <section id="countdown" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            <p className="font-display text-xs tracking-[0.3em] text-cyan-300">
              LAUNCH COUNTDOWN
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
              Limited Edition Drops Soon
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-slate-400">
              Secure your place before the Aura Smartwatch goes live.
            </p>
            <div className="mt-10">
              <CountdownTimer />
            </div>
          </div>
        </section>

        {/* Features / Specs */}
        <section id="features" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="font-display text-xs tracking-[0.3em] text-cyan-300">
                KEY FEATURES
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
                Engineered Beyond Ordinary
              </h2>
              <p className="mt-3 text-slate-400">
                Four pillars of performance wrapped in a luxury titanium form.
              </p>
            </div>

            <div id="specs" className="mt-12 grid scroll-mt-24 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURES.map((feature) => {
                const Icon = feature.icon
                return (
                  <article
                    key={feature.title}
                    className="glass-panel group rounded-2xl p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_0_40px_rgba(0,229,255,0.12)]"
                  >
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/25 bg-cyan-400/10 text-cyan-300 transition group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.35)]">
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </div>
                    <h3 className="font-display text-lg font-semibold tracking-wide text-white">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-400">
                      {feature.description}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* Pre-order / Email capture */}
        <section id="preorder" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-24">
          <div className="glass-panel mx-auto max-w-3xl rounded-3xl px-6 py-10 sm:px-10 sm:py-12">
            <div className="text-center">
              <p className="font-display text-xs tracking-[0.3em] text-cyan-300">
                VIP ACCESS
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-white sm:text-4xl">
                Claim Exclusive VIP Access &amp; 20% Off
              </h2>
              <p className="mx-auto mt-3 max-w-md text-slate-400">
                Join the early list for launch pricing, priority shipping, and
                exclusive Aura Wear updates.
              </p>
            </div>

            {typeof preorderCount === 'number' && (
              <p className="mt-6 text-center text-sm text-slate-400">
                <span className="font-display text-cyan-300">{preorderCount}</span>{' '}
                early members already on the list
              </p>
            )}

            {submitted ? (
              <div className="mt-8 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-6 text-center">
                <p className="font-display text-lg font-semibold text-cyan-300">
                  {alreadyRegistered
                    ? 'You were already on the list.'
                    : "You're on the list."}
                </p>
                <p className="mt-2 text-sm text-slate-300">
                  Check your inbox soon for VIP confirmation and your early-access
                  code.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={submitting}
                  className="w-full flex-1 rounded-full border border-white/10 bg-black/40 px-5 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400/50 focus:shadow-[0_0_0_3px_rgba(0,229,255,0.15)] disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-7 py-3.5 text-sm font-semibold text-aura-black shadow-[0_0_24px_rgba(0,229,255,0.3)] transition duration-300 hover:scale-[1.03] hover:shadow-[0_0_36px_rgba(0,229,255,0.55)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? 'Saving…' : 'Get Early Access'}
                </button>
              </form>
            )}

            {submitError && (
              <p className="mt-4 text-center text-sm text-rose-300">{submitError}</p>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 py-10 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            © 2026 Aura Wear Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="Twitter"
              className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              <Twitter className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-full border border-white/10 p-2 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
