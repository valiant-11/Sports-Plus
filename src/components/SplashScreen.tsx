import { Trophy } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-br from-[#1e40af] via-[#3b82f6] to-[#10b981] flex flex-col items-center justify-center p-6">
      <div className="flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-3xl"></div>
          <div className="relative bg-white rounded-full p-8 shadow-2xl">
            <Trophy className="w-20 h-20 text-blue-600" strokeWidth={2.5} />
          </div>
        </div>
        
        <div className="text-center space-y-2">
          <h1 className="text-white text-5xl tracking-tight">SportsPlus</h1>
          <p className="text-white/90 text-xl">Find. Play. Connect.</p>
        </div>
      </div>
      
      <div className="absolute bottom-12">
        <div className="flex gap-2">
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-100"></div>
          <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-200"></div>
        </div>
      </div>
    </div>
  );
}
