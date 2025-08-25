import React, { useState } from 'react';
import { Button, Input, Label } from './ui';

const AppWindowMockup = () => (
    <div className="group" style={{ perspective: '1000px' }}>
        <div className="relative bg-slate-800/50 border border-slate-700/50 rounded-xl shadow-2xl p-2 transition-all duration-500 w-full max-w-lg" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-10deg) rotateX(10deg)' }}>
            {/* Glossy effect */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-white/10 to-transparent rounded-xl opacity-50 group-hover:opacity-70 transition-opacity"></div>
            
            {/* Window Header */}
            <div className="flex items-center space-x-1.5 p-2 border-b border-slate-700/50">
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
                <div className="w-3 h-3 rounded-full bg-slate-700"></div>
            </div>
            
            {/* Window Content */}
            <div className="bg-slate-900/70 rounded-md p-4 h-[calc(100%-48px)] flex space-x-2">
                {/* Left Panel - Controls */}
                <div className="w-1/4 bg-slate-800/50 rounded p-2 space-y-2">
                    <div className="h-4 w-3/4 bg-cyan-400/30 rounded"></div>
                    <div className="h-6 bg-slate-700/50 rounded flex items-center p-1 space-x-1"><div className="w-4 h-4 rounded bg-cyan-400/50"></div><div className="h-2 flex-grow rounded-sm bg-slate-600/50"></div></div>
                    <div className="h-6 bg-slate-700/50 rounded flex items-center p-1 space-x-1"><div className="w-4 h-4 rounded bg-fuchsia-400/50"></div><div className="h-2 flex-grow rounded-sm bg-slate-600/50"></div></div>
                    <div className="h-6 bg-slate-700/50 rounded flex items-center p-1 space-x-1"><div className="w-4 h-4 rounded bg-indigo-400/50"></div><div className="h-2 flex-grow rounded-sm bg-slate-600/50"></div></div>
                </div>
                
                {/* Center Panel - Canvas */}
                <div className="w-1/2 bg-slate-800/50 rounded p-2 space-y-3">
                    <div className="h-4 w-1/3 bg-slate-600/50 rounded"></div>
                    <div className="h-8 bg-slate-700/50 border-2 border-indigo-500/50 rounded-md shadow-inner"></div>
                    <div className="h-4 w-1/3 bg-slate-600/50 rounded"></div>
                    <div className="h-8 bg-slate-700/50 rounded-md"></div>
                    <div className="flex justify-end"><div className="h-6 w-1/4 bg-indigo-500/50 rounded"></div></div>
                </div>
                
                 {/* Right Panel - Properties */}
                <div className="w-1/4 bg-slate-800/50 rounded p-2 space-y-2">
                     <div className="h-3 w-3/4 bg-slate-600/50 rounded"></div>
                     <div className="h-5 bg-slate-700/50 rounded"></div>
                     <div className="h-3 w-3/4 bg-slate-600/50 rounded mt-3"></div>
                     <div className="h-5 bg-slate-700/50 rounded"></div>
                     <div className="flex items-center justify-between mt-3">
                         <div className="h-3 w-1/3 bg-slate-600/50 rounded"></div>
                         <div className="h-5 w-8 bg-slate-700/50 rounded-full"></div>
                     </div>
                </div>
            </div>
            {/* Glowing border */}
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 opacity-20 group-hover:opacity-60 transition duration-500 blur-md"></div>
        </div>
    </div>
);


const Feature = ({ icon, title, children }: { icon: React.ReactNode, title: string, children: React.ReactNode }) => (
    <div className="relative bg-slate-900 p-6 rounded-lg overflow-hidden border border-slate-800 transition-all duration-300 hover:border-slate-700 hover:shadow-2xl hover:shadow-indigo-900/50">
        <div className="absolute -inset-px bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative">
            <div className="relative inline-flex items-center justify-center w-12 h-12 mb-4 rounded-lg bg-slate-800 border border-slate-700">
                 <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/30 rounded-lg blur"></div>
                 <div className="relative text-indigo-400">{icon}</div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-slate-400">{children}</p>
        </div>
    </div>
);

const Testimonial = ({ quote, author, title, avatar }: { quote: string, author: string, title: string, avatar: string }) => (
    <figure className="relative bg-gradient-to-br from-slate-900 to-slate-850 p-8 rounded-lg border border-slate-800 overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-fuchsia-500/20 to-transparent rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative z-10">
            <blockquote className="text-lg text-slate-300">
                <p>“{quote}”</p>
            </blockquote>
            <figcaption className="flex items-center space-x-4 mt-6">
                 <div className="p-0.5 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500">
                    <div className="p-0.5 bg-slate-900 rounded-full">
                        <img className="w-11 h-11 rounded-full" src={avatar} alt={author} />
                    </div>
                </div>
                <div>
                    <div className="font-semibold text-white">{author}</div>
                    <div className="text-slate-400">{title}</div>
                </div>
            </figcaption>
        </div>
    </figure>
);

const AuthModal = ({ onLogin, onSignUp, onClose }: { onLogin: (email: string, pass: string) => boolean, onSignUp: (email: string, pass: string) => boolean, onClose: () => void }) => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const success = isLoginView ? onLogin(email, password) : onSignUp(email, password);
        if (!success && isLoginView) {
            setError('Invalid credentials. Please try again.');
        } else if (!success && !isLoginView) {
            setError('Could not sign up. The email might already be taken.');
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-slate-900 border border-slate-800 rounded-lg shadow-2xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex border-b border-slate-800">
                    <button onClick={() => setIsLoginView(true)} className={`flex-1 p-4 font-semibold ${isLoginView ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Login</button>
                    <button onClick={() => setIsLoginView(false)} className={`flex-1 p-4 font-semibold ${!isLoginView ? 'bg-slate-800 text-white' : 'text-slate-400'}`}>Sign Up</button>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <h2 className="text-2xl font-bold text-center text-white">{isLoginView ? 'Welcome Back' : 'Create an Account'}</h2>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <Button type="submit" className="w-full !mt-8">{isLoginView ? 'Login' : 'Sign Up'}</Button>
                </form>
            </div>
        </div>
    );
};

export const LandingPage = ({ onLogin, onSignUp }: { onLogin: (email: string, pass: string) => boolean, onSignUp: (email: string, pass: string) => boolean }) => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    return (
        <div className="bg-slate-950 text-slate-300 relative isolate overflow-hidden">
            {isAuthModalOpen && <AuthModal onLogin={onLogin} onSignUp={onSignUp} onClose={() => setIsAuthModalOpen(false)} />}
            
             <div className="absolute inset-0 -z-10 h-full w-full bg-slate-950 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
             <div className="absolute -top-1/2 left-0 -z-10">
                <div className="w-[100vw] h-[100vh] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/50 via-slate-950 to-slate-950 blur-3xl"></div>
            </div>

            <header className="py-4 px-6 md:px-12 flex justify-between items-center border-b border-slate-800 sticky top-0 bg-slate-950/80 backdrop-blur-sm z-40">
                <h1 className="text-2xl font-bold text-white">FormSculptor</h1>
                <nav className="flex items-center space-x-4">
                    <Button variant="secondary" onClick={() => setIsAuthModalOpen(true)}>Login</Button>
                    <Button onClick={() => setIsAuthModalOpen(true)} className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 hover:from-cyan-400 hover:to-fuchsia-400 border-0">Sign Up</Button>
                </nav>
            </header>

            <main>
                <section className="relative py-20 md:py-32 px-6 md:px-12">
                    <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/20 rounded-full filter blur-3xl opacity-50 animate-blob" style={{animationDelay: '0s'}}></div>
                    <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-500/20 rounded-full filter blur-3xl opacity-50 animate-blob" style={{animationDelay: '2s'}}></div>

                    <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">Build <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">Powerful Forms</span>, Intuitively</h2>
                            <p className="mt-6 text-lg text-slate-400 max-w-xl mx-auto md:mx-0">The ultimate drag-and-drop form builder with advanced logic, team collaboration, and enterprise-grade security. Go from idea to a fully functional form in minutes.</p>
                            <Button onClick={() => setIsAuthModalOpen(true)} className="mt-8 !text-lg !px-8 !py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform hover:from-cyan-400 hover:to-fuchsia-400 border-0">Get Started for Free</Button>
                        </div>
                        <div className="flex justify-center">
                            <AppWindowMockup />
                        </div>
                    </div>
                </section>
                
                <section id="features" className="py-20 bg-slate-900/70">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="text-center max-w-3xl mx-auto">
                            <h3 className="text-3xl font-bold text-white">Everything you need, and more.</h3>
                            <p className="mt-4 text-slate-400">FormSculptor is packed with features designed for professionals who need power, flexibility, and control.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 mt-12">
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>}
                                title="Visual Drag & Drop Builder"
                            >
                                Effortlessly design complex layouts with our intuitive, grid-based canvas. What you see is what you get.
                            </Feature>
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path><path d="m9 12 2 2 4-4"></path></svg>}
                                title="Advanced Conditional Logic"
                            >
                                Create dynamic forms that react to user input. Show, hide, or set values based on a powerful rules engine.
                            </Feature>
                            <Feature
                                icon={<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>}
                                title="Team Collaboration"
                            >
                                Invite your team, assign granular roles like Designer or Data Manager, and build forms together in real-time.
                            </Feature>
                        </div>
                    </div>
                </section>

                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-6 md:px-12">
                         <Testimonial
                            quote="FormSculptor has revolutionized how we collect data. The logic engine is incredibly powerful, and the ability to assign specific roles to my team has streamlined our entire workflow."
                            author="Jane Doe"
                            title="Marketing Lead, TechCorp"
                            avatar="https://i.pravatar.cc/150?u=jane"
                        />
                    </div>
                </section>

                 <section className="relative py-20 text-center bg-slate-900/70 overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 to-transparent"></div>
                    <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-12">
                        <h3 className="text-3xl font-bold text-white">Ready to start building?</h3>
                        <p className="mt-4 text-slate-400">Sign up today and experience the future of form building. No credit card required.</p>
                        <Button onClick={() => setIsAuthModalOpen(true)} className="mt-8 !text-lg !px-8 !py-4 bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white font-bold shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform hover:from-cyan-400 hover:to-fuchsia-400 border-0">Create Your First Form</Button>
                    </div>
                </section>
            </main>

            <footer className="relative py-6 border-t border-slate-800 overflow-hidden">
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-slate-900/50 to-transparent -z-10"></div>
                <div className="relative max-w-7xl mx-auto px-6 md:px-12 text-center text-slate-500">
                    <p>&copy; {new Date().getFullYear()} FormSculptor. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};