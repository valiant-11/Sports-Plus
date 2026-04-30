import { Trophy, ShieldCheck, Search, ChevronRight, UserPlus, LogIn, LineChart, PlayCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';

interface LandingPageProps {
  onGetStarted: () => void;
  onSignIn: () => void;
  onScoutMode: () => void;
}

export function LandingPage({ onGetStarted, onSignIn, onScoutMode }: LandingPageProps) {

  const features = [
    {
      title: "Game Discovery",
      description: "Find and join local sports matches with ease. See exactly where they are on an interactive map.",
      icon: <Search className="w-8 h-8 text-white/90" />,
      gradient: "from-blue-500 to-blue-700"
    },
    {
      title: "Organization Tools",
      description: "Powerful tools for local entities to host events, manage teams, and handle tournaments.",
      icon: <ShieldCheck className="w-8 h-8 text-white/90" />,
      gradient: "from-blue-600 via-blue-700 to-green-600"
    },
    {
      title: "Gamification",
      description: "Earn points, badges, and work your way up the leaderboards by being an active player.",
      icon: <Trophy className="w-8 h-8 text-white/90" />,
      gradient: "from-green-500 to-green-700"
    }
  ];

  return (
    <div className="bg-gray-50 overflow-y-auto pb-10 h-full">
      {/* Hero Section */}
      <div className="relative pt-16 pb-20 px-8 flex flex-col items-center text-center bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 rounded-b-[3rem] shadow-2xl shadow-blue-900/30 overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 w-full">
          {/* Logo - no white wrapper */}
          <div className="bg-gradient-to-br from-blue-500 to-green-500 p-5 rounded-3xl mx-auto mb-6 w-fit shadow-2xl shadow-blue-900/30">
            <PlayCircle className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter leading-none">
            SportsPlus
          </h1>
          <p className="text-white font-semibold text-base mb-10 leading-relaxed tracking-tight">
            Your community platform for finding, joining, and hosting local sports games.
          </p>

          <div className="space-y-3 w-full">
            <button
              onClick={onGetStarted}
              className="w-full bg-white text-blue-700 font-black text-base py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 hover:bg-blue-50 hover:scale-[1.02] active:scale-[0.98]"
            >
              <UserPlus className="w-5 h-5" />
              Get Started
            </button>

            <button
              onClick={onSignIn}
              className="w-full bg-white/10 text-white border border-white/30 font-bold text-base py-4 rounded-2xl backdrop-blur-xl transition-all flex items-center justify-center gap-3 hover:bg-white/20 hover:scale-[1.02] active:scale-[0.98]"
            >
              <LogIn className="w-5 h-5" />
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Scout Mode Card */}
      <div className="mt-6 px-6">
        <button
          onClick={onScoutMode}
          className="w-full group bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-6 flex flex-col items-center gap-3 transition-all hover:shadow-2xl hover:border-blue-100 relative overflow-hidden"
        >
          {/* Subtle top accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-t-[2rem]" />
          <div className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl">
            <LineChart className="w-8 h-8 text-blue-600" />
          </div>
          <div className="text-center">
            <h3 className="font-black text-gray-900 text-lg tracking-tight group-hover:text-blue-600 transition-colors">Scout Mode</h3>
            <p className="text-sm text-gray-500 font-medium mt-1">View live leaderboards & local top players</p>
          </div>
          <div className="text-blue-600 text-sm font-bold flex items-center gap-1">
            Enter Scout Mode
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-8 px-6 flex flex-col gap-4">
        <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">Platform Features</h2>

        {features.map((feature, idx) => (
          <div
            key={idx}
            style={{ borderRadius: '1.75rem' }}
            className={`overflow-hidden shadow-xl bg-gradient-to-br ${feature.gradient} transition-transform hover:scale-[1.02]`}
          >
            <div className="p-6 flex items-start gap-5 text-white">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 backdrop-blur-md shadow-inner">
                {feature.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-black tracking-tight mb-1">{feature.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed font-medium">
                  {feature.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
