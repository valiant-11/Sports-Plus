import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface TermsAndConditionsScreenProps {
  onBack: () => void;
}

export function TermsAndConditionsScreen({ onBack }: TermsAndConditionsScreenProps) {
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-white text-2xl">Terms and Conditions</h1>
        <p className="text-white/80 text-sm mt-1">Please read carefully</p>
      </div>

      <ScrollArea className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 mb-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-4">
              Welcome to SportsPlus, a sports networking and matchmaking platform designed to help players connect, create games, and build communities.
            </p>
            <p className="text-gray-700 mb-4">
              By creating an account or using SportsPlus, you agree to these Terms and Conditions. Please read them carefully before proceeding.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By accessing or using the SportsPlus app, you confirm that you are at least 13 years old and agree to comply with these Terms. If you do not agree, please discontinue using the application.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">2. Account Registration</h2>
            <p className="text-gray-700 mb-2">You must provide accurate and truthful information during registration.</p>
            <p className="text-gray-700 mb-2">You are responsible for maintaining the confidentiality of your login credentials.</p>
            <p className="text-gray-700 mb-4">
              SportsPlus reserves the right to suspend or terminate accounts that provide false information or engage in fraudulent activities.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">3. Use of Location Services</h2>
            <p className="text-gray-700 mb-2">
              SportsPlus requires access to your location to verify participation in games and ensure fair gameplay.
            </p>
            <p className="text-gray-700 mb-2">
              Your GPS data may be temporarily used to confirm proximity to other players during check-in or game sessions.
            </p>
            <p className="text-gray-700 mb-4">
              Location tracking only occurs when necessary for verification and is not continuously active in the background.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">4. User Conduct</h2>
            <p className="text-gray-700 mb-2">Users agree not to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
              <li>Post or upload false, misleading, or offensive content.</li>
              <li>Attempt to falsify match results or manipulate ratings.</li>
              <li>Use the app for illegal activities or harassment.</li>
              <li>Exploit bugs or loopholes to gain unfair advantages (e.g., fake check-ins or GPS spoofing).</li>
            </ul>

            <h2 className="text-gray-900 mt-6 mb-3">5. Game Verification and Ratings</h2>
            <p className="text-gray-700 mb-2">Game results and ratings depend on player honesty and GPS-based verification.</p>
            <p className="text-gray-700 mb-2">
              Suspicious activities (e.g., distant GPS locations or inconsistent check-ins) may trigger a "Verification Flag" and manual review.
            </p>
            <p className="text-gray-700 mb-4">
              SportsPlus reserves the right to revoke points, suspend, or terminate users found falsifying matches.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">6. Points, Levels, and Team Systems</h2>
            <p className="text-gray-700 mb-2">Points and team levels are earned through verified games, ratings, and challenges.</p>
            <p className="text-gray-700 mb-4">
              Abuse of the system, including fake games, may result in penalties or point deductions.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">7. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              All designs, logos, trademarks, and content within SportsPlus are the property of the developers. Unauthorized use or reproduction is prohibited.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">8. Limitation of Liability</h2>
            <p className="text-gray-700 mb-4">
              SportsPlus is not liable for any injuries, damages, or disputes that may occur during real-world sports activities organized through the platform.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">9. Modifications</h2>
            <p className="text-gray-700 mb-6">
              SportsPlus may update these Terms at any time. Continued use of the app after updates indicates acceptance of the revised Terms.
            </p>

            <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
              <p>Last updated: October 20, 2025</p>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
