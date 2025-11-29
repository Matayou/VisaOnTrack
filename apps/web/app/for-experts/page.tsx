'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    ArrowRight,
    CheckCircle2,
    Briefcase,
    Zap,
    Shield,
    TrendingUp,
    Users,
    Clock,
    DollarSign,
} from 'lucide-react';
import { Footer } from '@/components/ui';
import { Header } from '@/components/Header';

export default function ForExpertsPage() {
    const [visibleRequests, setVisibleRequests] = useState<Array<{ type: string; budget: string; time: string }>>([]);

    // Mock data pool for streaming requests
    const mockRequests = [
        { type: 'Education Visa (ED)', budget: '฿35,000', time: 'Just now' },
        { type: 'LTR - Wealthy Pensioner', budget: '฿50,000', time: 'Just now' },
        { type: 'Business Visa (Non-B)', budget: '฿25,000', time: 'Just now' },
        { type: 'Digital Nomad (DTV)', budget: '฿40,000', time: 'Just now' },
        { type: 'Retirement Visa', budget: '฿45,000', time: 'Just now' },
        { type: 'Marriage Visa (Non-O)', budget: '฿28,000', time: 'Just now' },
        { type: 'Student Visa Extension', budget: '฿15,000', time: 'Just now' },
        { type: 'Elite Visa', budget: '฿120,000', time: 'Just now' },
    ];

    // Streaming requests effect
    useEffect(() => {
        // Initialize with first 3 requests
        setVisibleRequests(mockRequests.slice(0, 3));

        const interval = setInterval(() => {
            setVisibleRequests(prev => {
                // Get a random request that's not currently visible
                const availableRequests = mockRequests.filter(
                    req => !prev.some(p => p.type === req.type)
                );
                if (availableRequests.length === 0) return prev;

                const newRequest = availableRequests[Math.floor(Math.random() * availableRequests.length)];

                // Add new request at the top, keep only last 3
                return [newRequest, ...prev].slice(0, 3);
            });
        }, 4000); // Add new request every 4 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Header variant="landing" />

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white pb-20 pt-32 lg:pb-32 lg:pt-48">
                <div className="mx-auto max-w-7xl px-6 sm:px-8">
                    <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                        {/* Left: Content */}
                        <div>
                            <div className="bg-primary/10 border-primary/20 mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium text-primary">
                                <Briefcase className="h-4 w-4" />
                                For Visa Agents & Schools
                            </div>

                            <h1 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                                Grow Your Business with <span className="text-primary">Qualified Leads.</span>
                            </h1>

                            <p className="mb-8 text-xl leading-relaxed text-gray-600">
                                Stop chasing cold leads. Get detailed requests from travelers who are ready to start their visa journey.
                                Pay only for leads you unlock—no monthly fees, no contracts.
                            </p>

                            <div className="mb-12 flex flex-col gap-4 sm:flex-row">
                                <Link
                                    href="/auth/register?role=provider"
                                    className="shadow-primary/25 flex transform items-center justify-center gap-2 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-hover"
                                >
                                    Join as an Expert
                                    <ArrowRight className="h-5 w-5" />
                                </Link>

                                <Link
                                    href="#how-it-works"
                                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-lg font-semibold text-gray-900 transition-all duration-200 hover:border-gray-400"
                                >
                                    See How It Works
                                </Link>
                            </div>

                            {/* Key Stats */}
                            <div className="grid grid-cols-3 gap-6 border-t border-gray-200 pt-8">
                                <div>
                                    <div className="text-3xl font-bold text-primary">300+</div>
                                    <div className="text-sm text-gray-600">Active Requests</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">฿35K</div>
                                    <div className="text-sm text-gray-600">Avg. Budget</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary">24h</div>
                                    <div className="text-sm text-gray-600">Response Time</div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Streaming Requests Panel */}
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur-xl"></div>
                            <div className="relative rounded-2xl border-2 border-gray-200 bg-white p-8 shadow-md">
                                <div className="mb-8 flex items-center justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Live Requests</h3>
                                        <p className="text-sm text-gray-600">Real leads, right now</p>
                                    </div>
                                    <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-green-500"></span>
                                        Live
                                    </div>
                                </div>

                                <div className="space-y-3 overflow-hidden">
                                    {visibleRequests.map((req, i) => (
                                        <div
                                            key={`${req.type}-${i}`}
                                            className="animate-slide-in flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-md"
                                            style={{ animationDelay: `${i * 0.1}s` }}
                                        >
                                            <div>
                                                <p className="font-semibold text-gray-900">{req.type}</p>
                                                <p className="text-sm text-gray-600">Budget: {req.budget}</p>
                                            </div>
                                            <span className="rounded bg-green-50 px-2 py-1 text-xs font-medium text-green-600">{req.time}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 border-t border-gray-200 pt-6">
                                    <p className="text-center text-xs text-gray-500">
                                        <strong className="text-gray-700">Join today</strong> to unlock these leads and start winning clients.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Experts Choose Us */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-7xl px-6 sm:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">Why Experts Choose SawadeePass</h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600">
                            A smarter way to grow your visa business.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900">Qualified Leads Only</h3>
                            <p className="text-gray-600">
                                Every lead includes budget, timeline, and visa requirements. No more tire kickers—just serious travelers.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                                <DollarSign className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900">Pay Per Lead, No Subscriptions</h3>
                            <p className="text-gray-600">
                                Only pay when you unlock a lead. No monthly fees, no contracts. You're in control of your marketing spend.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
                                <Zap className="h-6 w-6 text-purple-600" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900">Built-In Proposal Tools</h3>
                            <p className="text-gray-600">
                                Send professional proposals and invoices directly through the platform. Close deals faster.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                                <Shield className="h-6 w-6 text-orange-600" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900">Verified Badge</h3>
                            <p className="text-gray-600">
                                Get verified to stand out. Travelers trust verified experts 3x more than unverified providers.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100">
                                <Users className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900">Direct Communication</h3>
                            <p className="text-gray-600">
                                Chat directly with travelers to answer questions and build trust before sending your proposal.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
                            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-pink-100">
                                <TrendingUp className="h-6 w-6 text-pink-600" />
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-gray-900">Analytics Dashboard</h3>
                            <p className="text-gray-600">
                                Track your performance, conversion rates, and average deal size. Make data-driven decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="bg-gray-50 py-24">
                <div className="mx-auto max-w-7xl px-6 sm:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">How It Works</h2>
                        <p className="text-lg text-gray-600">
                            Start winning clients in 4 simple steps.
                        </p>
                    </div>

                    <div className="space-y-8">
                        {[
                            {
                                step: '1',
                                title: 'Create Your Expert Profile',
                                description: 'Sign up and tell us about your services. Add your specialties, pricing, and availability. Get verified to build instant trust.',
                                icon: <Users className="h-6 w-6" />,
                            },
                            {
                                step: '2',
                                title: 'Browse Incoming Requests',
                                description: 'See real-time requests from travelers looking for visa help. Filter by visa type, budget, and timeline to find your ideal clients.',
                                icon: <Briefcase className="h-6 w-6" />,
                            },
                            {
                                step: '3',
                                title: 'Unlock & Connect',
                                description: 'Use credits to unlock leads and view full details. Chat directly with travelers to answer questions and understand their needs.',
                                icon: <Zap className="h-6 w-6" />,
                            },
                            {
                                step: '4',
                                title: 'Send Proposals & Win Clients',
                                description: 'Submit professional proposals with transparent pricing. Close deals and get paid directly by the client—we provide safety guidance.',
                                icon: <CheckCircle2 className="h-6 w-6" />,
                            },
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-6 rounded-2xl border border-gray-200 bg-white p-8 transition-shadow hover:shadow-lg">
                                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
                                    {item.step}
                                </div>
                                <div className="flex-1">
                                    <h3 className="mb-2 text-2xl font-bold text-gray-900">{item.title}</h3>
                                    <p className="leading-relaxed text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-primary py-24 text-white">
                <div className="mx-auto max-w-7xl px-6 text-center sm:px-8">
                    <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to Grow Your Business?</h2>
                    <p className="mb-10 text-xl text-blue-100">
                        Join hundreds of verified experts already winning clients on SawadeePass.
                    </p>
                    <Link
                        href="/auth/register?role=provider"
                        className="inline-flex items-center gap-2 rounded-xl bg-white px-10 py-5 text-lg font-bold text-primary shadow-xl transition-colors hover:bg-gray-100"
                    >
                        Join as an Expert
                        <ArrowRight className="h-5 w-5" />
                    </Link>
                    <p className="mt-6 text-sm text-blue-200">
                        No credit card required • No monthly fees • Cancel anytime
                    </p>
                </div>
            </section>

            <Footer />
        </div>
    );
}
