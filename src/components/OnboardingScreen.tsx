import { useState } from 'react';
import { Users, Trophy, MapPin, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Users,
    title: 'Find Players Near You',
    description: 'Connect with athletes in your area and join games that match your skill level.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Trophy,
    title: 'Create & Join Games',
    description: 'Organize matches, build teams, and earn achievements as you play.',
    color: 'from-green-500 to-emerald-600',
  },
  {
    icon: MapPin,
    title: 'Play Anywhere',
    description: 'Discover games at nearby venues and expand your sports community.',
    color: 'from-blue-600 to-purple-600',
  },
];

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-white flex flex-col">
      <div className={`flex-1 bg-gradient-to-br ${slide.color} flex items-center justify-center p-8 rounded-b-[3rem] transition-all duration-500`}>
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
          <Icon className="w-32 h-32 text-white" strokeWidth={1.5} />
        </div>
      </div>

      <div className="flex-1 p-8 flex flex-col justify-between">
        <div className="space-y-4 text-center">
          <h2 className="text-gray-900 text-3xl">{slide.title}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{slide.description}</p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center gap-2">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? 'w-8 bg-blue-600' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 rounded-2xl shadow-lg shadow-blue-500/30"
          >
            {currentSlide < slides.length - 1 ? (
              <>
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              'Get Started'
            )}
          </Button>

          {currentSlide === slides.length - 1 && (
            <button
              onClick={onComplete}
              className="w-full text-gray-600 text-sm"
            >
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
