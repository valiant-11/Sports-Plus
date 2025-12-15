import { useState } from 'react';
import { ArrowLeft, Star, AlertCircle, CheckCircle2, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface ParticipantFeedbackScreenProps {
  gameTitle: string;
  organizer: {
    name: string;
    verified: boolean;
  };
  onComplete: () => void;
  onBack: () => void;
}

const reportOptions = [
  { id: 'no-show', label: 'Organizer No Show', description: 'Organizer did not attend' },
  { id: 'cancelled-late', label: 'Cancelled Last Minute', description: 'Game was cancelled without notice' },
  { id: 'poor-organization', label: 'Poor Organization', description: 'Game was poorly organized' },
  { id: 'location-issue', label: 'Location Issues', description: 'Wrong or unsuitable location' },
  { id: 'safety', label: 'Safety Concern', description: 'Unsafe conditions or behavior' },
  { id: 'misleading', label: 'Misleading Info', description: 'Game details were inaccurate' },
];

export function ParticipantFeedbackScreen({ 
  gameTitle, 
  organizer,
  onComplete, 
  onBack 
}: ParticipantFeedbackScreenProps) {
  const [rating, setRating] = useState(0);
  const [reportIssues, setReportIssues] = useState<string[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [showReportSection, setShowReportSection] = useState(false);

  const handleReportToggle = (issueId: string) => {
    setReportIssues(prev =>
      prev.includes(issueId)
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    onComplete();
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl">Rate Game</h1>
            <p className="text-white/80 text-sm">{gameTitle}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 mt-6">
        <div className="space-y-6 pb-24">
          {/* Organizer Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="size-16">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xl">
                  {organizer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-900">{organizer.name}</h3>
                  {organizer.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Game Organizer</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-3">
              <Label className="text-gray-900">How was the game?</Label>
              <div className="flex items-center justify-center gap-3 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    <Star
                      className={`size-10 ${
                        star <= rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600">
                  {rating === 5 && '⭐ Excellent!'}
                  {rating === 4 && '👍 Great!'}
                  {rating === 3 && '👌 Good'}
                  {rating === 2 && '😐 Fair'}
                  {rating === 1 && '😕 Poor'}
                </p>
              )}
            </div>
          </div>

          {/* Report Issues Section */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
            <button
              onClick={() => setShowReportSection(!showReportSection)}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-orange-600" />
                <h3 className="text-gray-900">Report Issues (Optional)</h3>
              </div>
              <Badge variant="outline" className="text-xs">
                {reportIssues.length} selected
              </Badge>
            </button>

            {showReportSection && (
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">
                  Select any issues you experienced:
                </p>

                <div className="space-y-3">
                  {reportOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={option.id}
                        checked={reportIssues.includes(option.id)}
                        onCheckedChange={() => handleReportToggle(option.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={option.id}
                          className="text-gray-900 cursor-pointer"
                        >
                          {option.label}
                        </Label>
                        <p className="text-xs text-gray-600 mt-0.5">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Notes */}
                <div className="space-y-2 pt-3 border-t border-gray-100">
                  <Label className="text-gray-900">
                    Additional Details (Optional)
                  </Label>
                  <Textarea
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    placeholder="Provide more context about the issues..."
                    className="min-h-[100px] rounded-xl border-gray-200 bg-gray-50 resize-none"
                  />
                  <p className="text-xs text-gray-500">
                    This information helps maintain community standards.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={rating === 0}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              Submit Feedback
            </Button>

            <Button
              onClick={onComplete}
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200"
            >
              Skip Feedback
            </Button>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-blue-900">
                <p className="mb-1">Your feedback helps build a better community.</p>
                <p className="text-xs text-blue-700">
                  • Ratings affect organizer reliability scores<br />
                  • Reports are reviewed by our moderation team<br />
                  • All feedback is kept confidential
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
