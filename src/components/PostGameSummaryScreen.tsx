import { useState } from 'react';
import { ArrowLeft, Star, AlertCircle, CheckCircle2, User, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';

interface PostGameSummaryScreenProps {
  gameTitle: string;
  participants: Array<{
    id: string;
    name: string;
    verified: boolean;
  }>;
  onComplete: () => void;
  onBack: () => void;
}

interface PlayerRating {
  playerId: string;
  rating: number;
  reportIssues: string[];
  additionalNotes: string;
}

const reportOptions = [
  { id: 'no-show', label: 'No Show', description: 'Player did not attend' },
  { id: 'late', label: 'Late Arrival', description: 'Player arrived late' },
  { id: 'left-early', label: 'Left Early', description: 'Player left before game ended' },
  { id: 'rude', label: 'Rude Behavior', description: 'Unsportsmanlike conduct' },
  { id: 'skill-mismatch', label: 'Skill Mismatch', description: 'Skill level not as advertised' },
  { id: 'safety', label: 'Safety Concern', description: 'Unsafe play or behavior' },
];

export function PostGameSummaryScreen({ 
  gameTitle, 
  participants, 
  onComplete, 
  onBack 
}: PostGameSummaryScreenProps) {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [ratings, setRatings] = useState<Record<string, PlayerRating>>({});
  const [showReportSection, setShowReportSection] = useState(false);

  const currentPlayer = participants[currentPlayerIndex];
  const currentRating = ratings[currentPlayer?.id] || {
    playerId: currentPlayer?.id,
    rating: 0,
    reportIssues: [],
    additionalNotes: '',
  };

  const handleRatingChange = (rating: number) => {
    setRatings({
      ...ratings,
      [currentPlayer.id]: {
        ...currentRating,
        rating,
      },
    });
  };

  const handleReportToggle = (issueId: string) => {
    const currentIssues = currentRating.reportIssues || [];
    const newIssues = currentIssues.includes(issueId)
      ? currentIssues.filter(id => id !== issueId)
      : [...currentIssues, issueId];
    
    setRatings({
      ...ratings,
      [currentPlayer.id]: {
        ...currentRating,
        reportIssues: newIssues,
      },
    });
  };

  const handleNotesChange = (notes: string) => {
    setRatings({
      ...ratings,
      [currentPlayer.id]: {
        ...currentRating,
        additionalNotes: notes,
      },
    });
  };

  const handleNext = () => {
    if (currentPlayerIndex < participants.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setShowReportSection(false);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    if (currentPlayerIndex < participants.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setShowReportSection(false);
    } else {
      onComplete();
    }
  };

  const progress = ((currentPlayerIndex + 1) / participants.length) * 100;

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
            <h1 className="text-white text-2xl">Rate Players</h1>
            <p className="text-white/80 text-sm">{gameTitle}</p>
          </div>
          <Badge className="bg-white/30 text-white border-white/30">
            {currentPlayerIndex + 1}/{participants.length}
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className="bg-white h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 mt-6">
        <div className="space-y-6 pb-24">
          {/* Player Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar className="size-16">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xl">
                  {currentPlayer?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-900">{currentPlayer?.name}</h3>
                  {currentPlayer?.verified && (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  )}
                </div>
                <p className="text-sm text-gray-600">Player #{currentPlayerIndex + 1}</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-3">
              <Label className="text-gray-900">How was their performance?</Label>
              <div className="flex items-center justify-center gap-3 py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRatingChange(star)}
                    className="transition-all duration-200 hover:scale-110"
                  >
                    <Star
                      className={`size-10 ${
                        star <= currentRating.rating
                          ? 'text-yellow-500 fill-yellow-500'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {currentRating.rating > 0 && (
                <p className="text-center text-sm text-gray-600">
                  {currentRating.rating === 5 && '⭐ Excellent!'}
                  {currentRating.rating === 4 && '👍 Great!'}
                  {currentRating.rating === 3 && '👌 Good'}
                  {currentRating.rating === 2 && '😐 Fair'}
                  {currentRating.rating === 1 && '😕 Poor'}
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
                {currentRating.reportIssues?.length || 0} selected
              </Badge>
            </button>

            {showReportSection && (
              <div className="space-y-4 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">
                  Select any issues you experienced with this player:
                </p>

                <div className="space-y-3">
                  {reportOptions.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-start gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Checkbox
                        id={`${currentPlayer?.id}-${option.id}`}
                        checked={currentRating.reportIssues?.includes(option.id) || false}
                        onCheckedChange={() => handleReportToggle(option.id)}
                        className="mt-0.5"
                      />
                      <div className="flex-1">
                        <Label
                          htmlFor={`${currentPlayer?.id}-${option.id}`}
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
                    value={currentRating.additionalNotes || ''}
                    onChange={(e) => handleNotesChange(e.target.value)}
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
              onClick={handleNext}
              disabled={currentRating.rating === 0}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {currentPlayerIndex < participants.length - 1 ? 'Next Player' : 'Complete Summary'}
            </Button>

            <Button
              onClick={handleSkip}
              variant="outline"
              className="w-full h-12 rounded-xl border-gray-200"
            >
              Skip This Player
            </Button>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 text-sm text-blue-900">
                <p className="mb-1">Your ratings help build a better community.</p>
                <p className="text-xs text-blue-700">
                  • Ratings affect player reliability scores<br />
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
