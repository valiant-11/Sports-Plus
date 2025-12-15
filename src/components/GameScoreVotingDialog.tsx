import { useState } from 'react';
import { Trophy, ThumbsUp, ThumbsDown, CheckCircle2, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

interface GameScoreVotingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isHost: boolean;
  gameTitle: string;
  onScoresSubmitted?: (teamAScore: number, teamBScore: number) => void;
}

interface Vote {
  playerId: string;
  playerName: string;
  agreed: boolean;
}

export function GameScoreVotingDialog({
  open,
  onOpenChange,
  isHost,
  gameTitle,
  onScoresSubmitted
}: GameScoreVotingDialogProps) {
  const [step, setStep] = useState<'input' | 'voting' | 'results'>('input');
  const [teamAScore, setTeamAScore] = useState('');
  const [teamBScore, setTeamBScore] = useState('');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);

  // Mock player data for voting
  const totalPlayers = 8; // Team A (4) + Team B (4)
  const requiredVotes = Math.ceil(totalPlayers / 2); // Majority

  const handleSubmitScores = () => {
    const scoreA = parseInt(teamAScore);
    const scoreB = parseInt(teamBScore);

    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      toast.error('Please enter valid scores');
      return;
    }

    // Move to voting step
    setStep('voting');
    toast.success('Scores submitted! Waiting for players to vote...');
    
    // Simulate some automatic votes from other players
    setTimeout(() => {
      simulatePlayerVotes();
    }, 2000);
  };

  const simulatePlayerVotes = () => {
    // Simulate random votes from other players
    const mockVotes: Vote[] = [
      { playerId: '1', playerName: 'John Doe', agreed: true },
      { playerId: '2', playerName: 'Maria Santos', agreed: true },
      { playerId: '3', playerName: 'Alex Chen', agreed: true },
      { playerId: '4', playerName: 'Sarah Lee', agreed: false },
      { playerId: '5', playerName: 'Mike Johnson', agreed: true },
    ];
    setVotes(mockVotes);
  };

  const handleVote = (agreed: boolean) => {
    setHasVoted(true);
    const newVote: Vote = {
      playerId: 'current-user',
      playerName: 'You',
      agreed: agreed
    };
    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);

    // Check if majority reached
    const agreedVotes = updatedVotes.filter(v => v.agreed).length;
    const disagreedVotes = updatedVotes.filter(v => !v.agreed).length;

    if (agreedVotes >= requiredVotes) {
      setTimeout(() => {
        setStep('results');
        toast.success('Score accepted by majority!');
        onScoresSubmitted?.(parseInt(teamAScore), parseInt(teamBScore));
      }, 1000);
    } else if (disagreedVotes >= requiredVotes) {
      setTimeout(() => {
        setStep('results');
        toast.error('Score rejected by majority');
      }, 1000);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after a delay to avoid visual glitch
    setTimeout(() => {
      setStep('input');
      setTeamAScore('');
      setTeamBScore('');
      setVotes([]);
      setHasVoted(false);
    }, 300);
  };

  const agreedVotes = votes.filter(v => v.agreed).length;
  const disagreedVotes = votes.filter(v => !v.agreed).length;
  const votingComplete = agreedVotes >= requiredVotes || disagreedVotes >= requiredVotes;
  const scoresAccepted = agreedVotes >= requiredVotes;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[90%] rounded-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {step === 'input' ? 'Submit Final Score' : step === 'voting' ? 'Vote on Final Score' : 'Voting Complete'}
          </DialogTitle>
          <DialogDescription>
            {step === 'input' ? `Enter the final score for ${gameTitle}. Players will vote to confirm.` : step === 'voting' ? 'The host has submitted the final score. Do you agree?' : (scoresAccepted ? 'The scores have been accepted!' : 'The scores were rejected')}
          </DialogDescription>
        </DialogHeader>

        {step === 'input' && isHost && (
          <div className="space-y-4 pt-4">
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-900">
              <p className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                All players will vote on the scores you submit
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Majority vote ({requiredVotes}/{totalPlayers}) required to confirm
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="team-a-score">Team A Score</Label>
                <Input
                  id="team-a-score"
                  type="number"
                  min="0"
                  value={teamAScore}
                  onChange={(e) => setTeamAScore(e.target.value)}
                  placeholder="Enter score"
                  className="mt-1 rounded-xl"
                />
              </div>

              <div>
                <Label htmlFor="team-b-score">Team B Score</Label>
                <Input
                  id="team-b-score"
                  type="number"
                  min="0"
                  value={teamBScore}
                  onChange={(e) => setTeamBScore(e.target.value)}
                  placeholder="Enter score"
                  className="mt-1 rounded-xl"
                />
              </div>
            </div>

            {teamAScore && teamBScore && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 text-center border-2 border-blue-200">
                <p className="text-sm text-gray-600 mb-1">Final Score</p>
                <p className="text-2xl text-gray-900">
                  Team A: <span className="font-bold">{teamAScore}</span>
                  {' '}-{' '}
                  Team B: <span className="font-bold">{teamBScore}</span>
                </p>
              </div>
            )}

            <Button
              onClick={handleSubmitScores}
              disabled={!teamAScore || !teamBScore}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-xl h-12"
            >
              Submit for Voting
            </Button>
          </div>
        )}

        {step === 'input' && !isHost && (
          <div className="space-y-4 pt-4">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-sm text-blue-900">Waiting for host to submit scores...</p>
            </div>
          </div>
        )}

        {step === 'voting' && (
          <div className="space-y-4 pt-4">
            {/* Proposed Scores */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 text-center border-2 border-blue-200">
              <p className="text-sm text-gray-600 mb-2">Proposed Final Score</p>
              <p className="text-3xl text-gray-900">
                <span className="font-bold">{teamAScore}</span>
                {' '}-{' '}
                <span className="font-bold">{teamBScore}</span>
              </p>
              <p className="text-xs text-gray-500 mt-2">Team A vs Team B</p>
            </div>

            {/* Voting Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Voting Progress</span>
                <Badge variant="outline">
                  {votes.length}/{totalPlayers} voted
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ThumbsUp className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Agree</span>
                  </div>
                  <p className="text-xl text-green-700">
                    {agreedVotes}
                    <span className="text-sm text-green-600">/{requiredVotes}</span>
                  </p>
                </div>
                
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <ThumbsDown className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Disagree</span>
                  </div>
                  <p className="text-xl text-red-700">
                    {disagreedVotes}
                    <span className="text-sm text-red-600">/{requiredVotes}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Votes */}
            {votes.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 mb-2">Recent Votes</p>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {votes.slice().reverse().map((vote, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-900">{vote.playerName}</span>
                      {vote.agreed ? (
                        <Badge className="bg-green-100 text-green-700 gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Agreed
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 gap-1">
                          <XCircle className="w-3 h-3" />
                          Disagreed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Vote Buttons */}
            {!isHost && !hasVoted && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button
                  onClick={() => handleVote(false)}
                  variant="outline"
                  className="h-14 rounded-xl border-red-200 text-red-600 hover:bg-red-50 flex flex-col gap-1"
                >
                  <ThumbsDown className="w-5 h-5" />
                  <span className="text-xs">Disagree</span>
                </Button>
                <Button
                  onClick={() => handleVote(true)}
                  className="h-14 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 flex flex-col gap-1"
                >
                  <ThumbsUp className="w-5 h-5" />
                  <span className="text-xs">Agree</span>
                </Button>
              </div>
            )}

            {hasVoted && (
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-blue-900">Your vote has been recorded</p>
                <p className="text-xs text-blue-700 mt-1">Waiting for other players...</p>
              </div>
            )}

            {isHost && (
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <p className="text-sm text-blue-900">Waiting for players to vote...</p>
                <p className="text-xs text-blue-700 mt-1">
                  {requiredVotes - Math.max(agreedVotes, disagreedVotes)} more votes needed
                </p>
              </div>
            )}
          </div>
        )}

        {step === 'results' && (
          <div className="space-y-4 pt-4">
            {/* Final Result */}
            <div className={`rounded-xl p-6 text-center border-2 ${
              scoresAccepted 
                ? 'bg-gradient-to-r from-green-50 to-blue-50 border-green-200' 
                : 'bg-gradient-to-r from-red-50 to-orange-50 border-red-200'
            }`}>
              {scoresAccepted ? (
                <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-3" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600 mx-auto mb-3" />
              )}
              <p className="text-xl text-gray-900 mb-2">
                {scoresAccepted ? 'Scores Accepted!' : 'Scores Rejected'}
              </p>
              <p className="text-sm text-gray-600 mb-4">
                {scoresAccepted 
                  ? `Majority vote: ${agreedVotes}/${totalPlayers} agreed`
                  : `Majority vote: ${disagreedVotes}/${totalPlayers} disagreed`
                }
              </p>
              
              {scoresAccepted && (
                <div className="bg-white/50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600 mb-1">Final Score</p>
                  <p className="text-3xl text-gray-900">
                    <span className="font-bold">{teamAScore}</span>
                    {' '}-{' '}
                    <span className="font-bold">{teamBScore}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Voting Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-3">Voting Summary</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="text-center">
                  <p className="text-2xl text-green-600">{agreedVotes}</p>
                  <p className="text-xs text-gray-600">Agreed</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-red-600">{disagreedVotes}</p>
                  <p className="text-xs text-gray-600">Disagreed</p>
                </div>
              </div>
              
              {votes.length > 0 && (
                <div className="space-y-2 border-t border-gray-200 pt-3">
                  {votes.map((vote, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">{vote.playerName}</span>
                      {vote.agreed ? (
                        <Badge className="bg-green-100 text-green-700 gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          Agreed
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-700 gap-1">
                          <ThumbsDown className="w-3 h-3" />
                          Disagreed
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!scoresAccepted && isHost && (
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <p className="text-sm text-orange-900">
                  Please submit corrected scores for another vote
                </p>
              </div>
            )}

            <Button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-xl h-12"
            >
              {scoresAccepted ? 'Continue' : 'Close'}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}