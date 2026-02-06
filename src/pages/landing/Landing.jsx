import React, { useState, useEffect, useRef } from 'react';
import {
  Zap,
  Shield,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Globe,
  Clock,
  Users,
  Layers,
} from 'lucide-react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Header from '../../components/landing/Header';
import Footer from '../../components/landing/Footer';

/* ------------------------------------------------------------------ */
/*  Animated Counter Hook                                              */
/* ------------------------------------------------------------------ */
function useCounter(end, duration = 2000, startOnView = true) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!startOnView || !inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, inView, startOnView]);

  return { count, ref };
}

/* ------------------------------------------------------------------ */
/*  Fade-in wrapper                                                    */
/* ------------------------------------------------------------------ */
const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }) => {
  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 30 : direction === 'down' ? -30 : 0,
      x: direction === 'left' ? 30 : direction === 'right' ? -30 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/*  Hero Section                                                       */
/* ------------------------------------------------------------------ */
const Hero = () => (
  <section className="relative overflow-hidden">
    {/* Background decoration */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
    </div>

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-28 lg:pt-32 lg:pb-36">
      <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
        {/* Badge */}
        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            Now in open beta
          </div>
        </FadeIn>

        {/* Headline */}
        <FadeIn delay={0.1}>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-text-primary tracking-tight leading-[1.1] text-balance">
            The complete platform for{' '}
            <span className="text-primary">team collaboration</span>
          </h1>
        </FadeIn>

        {/* Subtext */}
        <FadeIn delay={0.2}>
          <p className="mt-6 text-lg lg:text-xl text-text-secondary max-w-2xl leading-relaxed text-pretty">
            Synchronize your workflows, manage projects, and communicate
            in real-time. Everything your team needs to move faster, together.
          </p>
        </FadeIn>

        {/* CTA Buttons */}
        <FadeIn delay={0.3}>
          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <a
              href="/register"
              className="group inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30"
            >
              Get Started Free
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="/#features"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-text-primary bg-surface-elevated rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200"
            >
              Explore Features
            </a>
          </div>
        </FadeIn>

        {/* Social proof mini */}
        <FadeIn delay={0.4}>
          <div className="mt-14 flex items-center gap-3">
            <div className="flex -space-x-2">
              {[
                'bg-blue-500',
                'bg-green-500',
                'bg-amber-500',
                'bg-rose-500',
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`w-8 h-8 rounded-full ${bg} border-2 border-surface flex items-center justify-center`}
                >
                  <Users className="w-3.5 h-3.5 text-white" />
                </div>
              ))}
            </div>
            <p className="text-sm text-text-secondary">
              <span className="font-semibold text-text-primary">2,000+</span>{' '}
              teams already on board
            </p>
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Stats Section                                                      */
/* ------------------------------------------------------------------ */
const stats = [
  { value: 99, suffix: '.9%', label: 'Uptime SLA' },
  { value: 50, suffix: 'k+', label: 'Active Users' },
  { value: 300, suffix: '%', label: 'Productivity Boost' },
  { value: 24, suffix: '/7', label: 'Support' },
];

const StatsSection = () => (
  <section className="border-y border-border bg-surface-secondary">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => {
          const { count, ref } = useCounter(stat.value, 1800);
          return (
            <FadeIn key={stat.label} delay={i * 0.1}>
              <div ref={ref} className="text-center">
                <p className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight">
                  {count}
                  <span className="text-primary">{stat.suffix}</span>
                </p>
                <p className="mt-2 text-sm text-text-secondary font-medium">
                  {stat.label}
                </p>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Features Section                                                   */
/* ------------------------------------------------------------------ */
const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description:
      'Real-time updates with zero lag. Every change syncs instantly across all your devices and team members.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description:
      'End-to-end encryption, SOC2 compliance, and role-based access controls to keep your data safe.',
  },
  {
    icon: MessageSquare,
    title: 'Seamless Communication',
    description:
      'Built-in messaging, threaded discussions, and file sharing to keep conversations contextual.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track team performance, project velocity, and resource allocation with powerful visual insights.',
  },
  {
    icon: Globe,
    title: 'Global Collaboration',
    description:
      'Work across time zones with async-first tools, smart notifications, and shared calendars.',
  },
  {
    icon: Clock,
    title: 'Time Tracking',
    description:
      'Automatic time logging, sprint tracking, and detailed reports to keep every project on schedule.',
  },
];

const FeaturesSection = () => (
  <section id="features" className="py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Features
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight text-balance">
            Everything your team needs to ship faster
          </h2>
          <p className="mt-4 text-text-secondary leading-relaxed">
            A complete toolkit designed for modern teams that value speed,
            security, and seamless collaboration.
          </p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FadeIn key={feature.title} delay={i * 0.08}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="group p-6 rounded-xl bg-surface-elevated border border-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-default"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors duration-300">
                <feature.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  How It Works                                                       */
/* ------------------------------------------------------------------ */
const steps = [
  {
    number: '01',
    title: 'Create your workspace',
    description:
      'Sign up in seconds and set up your team workspace with custom channels and projects.',
  },
  {
    number: '02',
    title: 'Invite your team',
    description:
      'Add team members via email or a shared link. Set roles and permissions for each member.',
  },
  {
    number: '03',
    title: 'Start collaborating',
    description:
      'Create tasks, track progress on Kanban boards, and communicate in real-time.',
  },
];

const HowItWorks = () => (
  <section id="about" className="py-24 lg:py-32 bg-surface-secondary border-y border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            How it works
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight text-balance">
            Up and running in minutes
          </h2>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <FadeIn key={step.number} delay={i * 0.15}>
            <div className="relative flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-5">
                <span className="text-lg font-bold text-primary">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed max-w-xs">
                {step.description}
              </p>
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-7 left-[calc(50%+40px)] w-[calc(100%-80px)] h-px bg-border" />
              )}
            </div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Testimonials                                                       */
/* ------------------------------------------------------------------ */
const testimonials = [
  {
    quote:
      "TeamSync transformed how we manage projects. The real-time updates alone saved us hours every week.",
    author: 'Sarah Chen',
    role: 'Engineering Lead at Horizon',
    initials: 'SC',
    color: 'bg-blue-500',
  },
  {
    quote:
      "The Kanban boards and Gantt charts give us complete visibility into every sprint. Our velocity is up 40%.",
    author: 'Marcus Rivera',
    role: 'Product Manager at NovaTech',
    initials: 'MR',
    color: 'bg-emerald-500',
  },
  {
    quote:
      "Switching from three separate tools to TeamSync simplified everything. Our team actually enjoys using it.",
    author: 'Emily Watkins',
    role: 'CTO at Cloudbridge',
    initials: 'EW',
    color: 'bg-amber-500',
  },
];

const TestimonialsSection = () => (
  <section className="py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
            Testimonials
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight text-balance">
            Loved by teams everywhere
          </h2>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((t, i) => (
          <FadeIn key={t.author} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="p-6 rounded-xl bg-surface-elevated border border-border hover:border-primary/20 transition-all duration-300"
            >
              <p className="text-sm text-text-secondary leading-relaxed mb-6">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold`}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary">
                    {t.author}
                  </p>
                  <p className="text-xs text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Checklist / Feature highlights                                     */
/* ------------------------------------------------------------------ */
const highlights = [
  'Unlimited projects and workspaces',
  'Real-time Kanban and Gantt views',
  'Built-in team messaging',
  'File sharing and document collaboration',
  'Role-based access controls',
  'Detailed analytics and reporting',
];

const HighlightsSection = () => (
  <section className="py-24 lg:py-32 bg-surface-secondary border-y border-border">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <FadeIn direction="right">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">
              Why TeamSync
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-text-primary tracking-tight leading-tight text-balance">
              Faster iteration. More innovation.
            </h2>
            <p className="mt-4 text-text-secondary leading-relaxed">
              Let your team focus on shipping features instead of managing
              tools. One platform for everything.
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-lg bg-surface-elevated border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-sm text-text-primary font-medium">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  CTA Section                                                        */
/* ------------------------------------------------------------------ */
const CTASection = () => (
  <section className="py-24 lg:py-32">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <FadeIn>
        <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 lg:px-16 lg:py-20 text-center">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

          <div className="relative">
            <h2 className="text-3xl lg:text-4xl font-bold text-white tracking-tight text-balance">
              Ready to transform your workflow?
            </h2>
            <p className="mt-4 text-white/80 text-lg max-w-lg mx-auto">
              Join thousands of teams already using TeamSync to ship better,
              faster.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="/register"
                className="group inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-primary bg-white rounded-lg hover:bg-white/90 transition-all duration-200 shadow-lg"
              >
                Start Your Free Trial
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all duration-200"
              >
                Sign In
              </a>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>
  </section>
);

/* ------------------------------------------------------------------ */
/*  Landing Page                                                       */
/* ------------------------------------------------------------------ */
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <main>
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
        <TestimonialsSection />
        <HighlightsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
