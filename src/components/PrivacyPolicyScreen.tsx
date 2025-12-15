import { ArrowLeft } from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-white text-2xl">Privacy Policy</h1>
        <p className="text-white/80 text-sm mt-1">Your data protection matters</p>
      </div>

      <ScrollArea className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 mb-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 mb-4">
              SportsPlus respects your privacy and is committed to protecting your personal data. This policy explains what information we collect, how it is used, and your rights.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
            <p className="text-gray-700 mb-2"><strong>Account Data:</strong> Name, email, username, and password.</p>
            <p className="text-gray-700 mb-2">
              <strong>Profile Data:</strong> Preferred sports, location (barangay), ratings, and achievements.
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Location Data:</strong> Used only during game creation, check-in, and verification to ensure match authenticity.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Usage Data:</strong> Logs of app activity to improve user experience and security.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">2. How We Use Your Data</h2>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
              <li>To match players based on sport type and location.</li>
              <li>To verify that games occurred using GPS proximity.</li>
              <li>To maintain fair rankings and prevent fake matches.</li>
              <li>To notify you about upcoming games, invites, or team activities.</li>
            </ul>

            <h2 className="text-gray-900 mt-6 mb-3">3. Data Sharing</h2>
            <p className="text-gray-700 mb-2">SportsPlus does not sell or rent user data.</p>
            <p className="text-gray-700 mb-2">
              Limited data (e.g., name, rating, team) may be shown publicly to other users.
            </p>
            <p className="text-gray-700 mb-4">
              Location data is never shared publicly and is used solely for verification purposes.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">4. Data Security</h2>
            <p className="text-gray-700 mb-4">
              We implement encryption and security protocols to protect your data from unauthorized access, alteration, or misuse.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">5. User Rights</h2>
            <p className="text-gray-700 mb-2">You have the right to:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
              <li>Access or edit your information.</li>
              <li>Delete your account and associated data.</li>
              <li>Withdraw location permissions (though this may limit verification features).</li>
            </ul>

            <h2 className="text-gray-900 mt-6 mb-3">6. Location Permission Notice</h2>
            <p className="text-gray-700 mb-2">
              By using SportsPlus, you consent to share your location for the purpose of verifying your participation in physical games.
            </p>
            <p className="text-gray-700 mb-4">
              This helps ensure fairness and authenticity in matches and rankings.
            </p>

            <h2 className="text-gray-900 mt-6 mb-3">7. Updates to This Policy</h2>
            <p className="text-gray-700 mb-6">
              We may revise this Privacy Policy periodically. Significant updates will be announced within the app before they take effect.
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
