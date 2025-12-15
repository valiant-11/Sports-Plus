import { useState } from 'react';
import { ArrowLeft, Star, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner';

interface AppFeedbackScreenProps {
  onBack: () => void;
}

export function AppFeedbackScreen({ onBack }: AppFeedbackScreenProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [suggestion, setSuggestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Thank you for your feedback!');
    setRating(0);
    setSuggestion('');
    setIsSubmitting(false);
    
    // Optionally go back after submission
    setTimeout(() => {
      onBack();
    }, 1000);
  };

  const getRatingText = (stars: number) => {
    switch (stars) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return 'Rate the app';
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-white text-2xl">App Feedback</h1>
        <p className="text-white/80 text-sm mt-1">Help us improve SportsPlus</p>
      </div>

      <div className="flex-1 px-6 -mt-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-6 mb-6">
          {/* Rating Section */}
          <div className="text-center mb-8">
            <h2 className="text-gray-900 mb-2">How would you rate SportsPlus?</h2>
            <p className="text-sm text-gray-600 mb-6">
              {getRatingText(hoveredRating || rating)}
            </p>

            <div className="flex justify-center gap-3 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 active:scale-95"
                >
                  <Star
                    className={`w-12 h-12 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Suggestion Section */}
          <div className="space-y-3">
            <div>
              <label className="text-gray-900 block mb-2">
                Do you have any suggestions? (Optional)
              </label>
              <Textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Tell us what you think or how we can improve..."
                className="rounded-xl min-h-[120px] resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {suggestion.length}/500 characters
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-xl h-12"
            >
              {isSubmitting ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-sm text-gray-700">
              <strong>Thank you!</strong> Your feedback helps us make SportsPlus better for everyone. We read every submission and use them to improve the app.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
