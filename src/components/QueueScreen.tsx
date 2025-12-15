import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Users, CheckCircle2, Play, X, Trophy, Star, Flag, AlertCircle, Map, UserMinus, UserPlus, Send } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Input } from './ui/input';
import { toast } from 'sonner';
import { MiniProfileCard } from './MiniProfileCard';

interface QueueScreenProps {
  onBack: () => void;
  onLeaveGame?: (gameId: string) => void;
  onFinishGame?: (gameId: string, gameTitle: string, organizer: any) => void;
  onGameComplete?: () => void;
  gameData?: {
    id: string;
    title: string;
    sport: string;
    location: string;
    date: string;
    time: string;
    maxPlayers: number;
    latitude?: number;
    longitude?: number;
  };
  isHost?: boolean;
}

interface Player {
  id: string;
  name: string;
  verified: boolean;
  team: 1 | 2;
  isCurrentUser: boolean;
  ready?: boolean;
  rating?: number;
  skillLevel?: 'Casual' | 'Novice' | 'Elite';
}

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  skillLevel: 'Casual' | 'Novice' | 'Elite';
  online: boolean;
}

type GameState = 'waiting' | 'active' | 'vote-score' | 'rescore' | 'revote-score' | 'rating' | 'completed';

const skillLevels: ('Casual' | 'Novice' | 'Elite')[] = ['Casual', 'Novice', 'Elite'];

const reportReasonsArray = [
  'Inappropriate behavior',
  "Didn't show up",
  'Poor sportsmanship',
  'Cheating/unfair play',
  'Verbal abuse',
  'Left early',
  'Other'
];

// Mock team members
const mockTeamMembers: TeamMember[] = [
  { id: 'tm1', name: 'Sarah Chen', avatar: '', skillLevel: 'Elite', online: true },
  { id: 'tm2', name: 'Mike Rodriguez', avatar: '', skillLevel: 'Novice', online: true },
  { id: 'tm3', name: 'Emily Davis', avatar: '', skillLevel: 'Elite', online: false },
  { id: 'tm4', name: 'James Wilson', avatar: '', skillLevel: 'Casual', online: true },
];

export function QueueScreen({ onBack, onLeaveGame, gameData, isHost = false, onGameComplete }: QueueScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [userReady, setUserReady] = useState(false);
  const [userTeam, setUserTeam] = useState<1 | 2>(1);
  const [readyCount, setReadyCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [votesApproved, setVotesApproved] = useState(0);
  const [votesDisapproved, setVotesDisapproved] = useState(0);
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0);
  const [playerRatings, setPlayerRatings] = useState<{ [key: string]: number }>({});
  const [playerComments, setPlayerComments] = useState<{ [key: string]: string }>({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReportReasons, setSelectedReportReasons] = useState<string[]>([]);
  const [reportComment, setReportComment] = useState('');
  const [hasUserVoted, setHasUserVoted] = useState(false);
  const [userVote, setUserVote] = useState<'approve' | 'disagree' | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [kickingPlayerId, setKickingPlayerId] = useState<string | null>(null);

  useEffect(() => {
    if (gameData) {
      initializePlayers();
    }
  }, [gameData?.maxPlayers]);

  // Auto-ready all other players and start game ONLY after user clicks ready
  useEffect(() => {
    if (gameState === 'waiting' && players.length > 0 && userReady && readyCount < players.length) {
      const timer = setTimeout(() => {
        // Auto-ready remaining players
        const updatedPlayers = players.map(p => ({ ...p, ready: true }));
        setPlayers(updatedPlayers);
        setReadyCount(players.length);
        toast.success('All players are ready!');

        // Auto-start game after another delay
        const startTimer = setTimeout(() => {
          setGameState('vote-score');
          setTeam1Score('12');
          setTeam2Score('15');
          toast.success('Game finished! Voting on final score...');
        }, 2000);
        return () => clearTimeout(startTimer);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [gameState, players, readyCount, userReady]);

  const initializePlayers = () => {
    if (!gameData) return;

    const aiPlayerNames = [
      'Alex Chen', 'Maria Santos', 'John Doe', 'Sarah Lee', 'Mike Johnson',
      'Emma Wilson', 'David Kim', 'Lisa Brown', 'Tom Anderson', 'Anna Garcia',
      'Chris Taylor', 'Nina Patel', 'Ryan Clark', 'Sophie Martin', 'Jake Lewis'
    ];

    const newPlayers: Player[] = [];
    
    newPlayers.push({
      id: 'current-user',
      name: 'You',
      verified: true,
      team: 1,
      isCurrentUser: true,
      ready: false,
      skillLevel: 'Elite',
    });

    for (let i = 1; i < gameData.maxPlayers; i++) {
      const team = (i % 2 === 0) ? 1 : 2;
      const randomSkill = skillLevels[Math.floor(Math.random() * skillLevels.length)];
      newPlayers.push({
        id: `player-${i}`,
        name: aiPlayerNames[i - 1] || `Player ${i}`,
        verified: Math.random() > 0.3,
        team: team,
        isCurrentUser: false,
        ready: false,
        skillLevel: randomSkill,
      });
    }

    setPlayers(newPlayers);
  };

  const handleReady = () => {
    if (!userReady) {
      setUserReady(true);
      setReadyCount(prev => prev + 1);
      // Update current user's ready status
      setPlayers(prev => prev.map(p => 
        p.isCurrentUser ? { ...p, ready: true } : p
      ));
      toast.success('You are ready! Waiting for others...');
    } else {
      setUserReady(false);
      setReadyCount(prev => Math.max(0, prev - 1));
      setPlayers(prev => prev.map(p => 
        p.isCurrentUser ? { ...p, ready: false } : p
      ));
      toast.info('You are no longer ready');
    }
  };

  const handleKickPlayer = (playerId: string, playerName: string) => {
    setKickingPlayerId(playerId);
    setTimeout(() => {
      setPlayers(prev => prev.filter(p => p.id !== playerId));
      setReadyCount(prev => {
        const player = players.find(p => p.id === playerId);
        return player?.ready ? Math.max(0, prev - 1) : prev;
      });
      toast.success(`${playerName} has been kicked from the game`);
      setKickingPlayerId(null);
    }, 500);
  };

  const handleInviteTeamMember = (member: TeamMember) => {
    if (!member.online) {
      toast.error(`${member.name} is offline`);
      return;
    }
    toast.success(`Invitation sent to ${member.name}!`);
  };

  const handleVoteScore = (vote: 'approve' | 'disagree') => {
    setUserVote(vote);
    setHasUserVoted(true);
    
    if (vote === 'approve') {
      setVotesApproved(prev => prev + 1);
      toast.success('You approved the score!');
    } else {
      setVotesDisapproved(prev => prev + 1);
      toast.info('You disagree with the score. You will need to enter the correct score.');
      
      // Simulate other votes coming in (majority disagree)
      setTimeout(() => {
        setVotesDisapproved(players.length - 1); // Most disagree
        toast.warning('Majority disagrees! Need to re-enter score...');
        setGameState('rescore');
      }, 1500);
    }
  };

  const handleRescore = () => {
    if (!team1Score || !team2Score) {
      toast.error('Please enter correct scores for both teams');
      return;
    }
    
    // Reset votes and simulate new vote
    setVotesApproved(0);
    setVotesDisapproved(0);
    setHasUserVoted(false);
    setUserVote(null);
    setGameState('revote-score');
    toast.info('New score submitted. Players are voting again...');

    // Simulate votes with majority approval this time
    let approveCount = 0;
    const voteInterval = setInterval(() => {
      approveCount++;
      setVotesApproved(approveCount);
      if (approveCount >= Math.ceil(players.length * 0.7)) {
        clearInterval(voteInterval);
        setTimeout(() => {
          setGameState('rating');
          setVotesApproved(0);
          setVotesDisapproved(0);
          setHasUserVoted(false);
          setUserVote(null);
          toast.success('Score approved! Moving to rating...');
        }, 1000);
      }
    }, 400);
  };

  const handleRatePlayer = () => {
    const currentPlayer = players[currentRatingIndex];
    const rating = playerRatings[currentPlayer.id] || 0;

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    toast.success(`Rated ${currentPlayer.name} - ${rating} stars`);
    
    if (currentRatingIndex < players.length - 1) {
      setCurrentRatingIndex(prev => prev + 1);
    } else {
      // All players rated
      setGameState('completed');
      toast.success('Game completed! Thanks for playing!');
    }
  };

  const handleSubmitReport = () => {
    if (selectedReportReasons.length === 0) {
      toast.error('Please select at least one reason');
      return;
    }
    toast.success('Report submitted successfully');
    setShowReportModal(false);
    setSelectedReportReasons([]);
    setReportComment('');
  };

  const handleReturnToMenu = () => {
    // Clear game and return to home
    onGameComplete?.();
    onBack();
  };

  const handleSwitchTeam = () => {
    if (userReady) {
      toast.error('Cannot switch teams after readying up');
      return;
    }
    setUserTeam(userTeam === 1 ? 2 : 1);
    toast.success(`Switched to Team ${userTeam === 1 ? 2 : 1}`);
  };

  const toggleReportReason = (reason: string) => {
    setSelectedReportReasons(prev =>
      prev.includes(reason)
        ? prev.filter(r => r !== reason)
        : [...prev, reason]
    );
  };

  const getSkillBadgeColor = (skill?: string) => {
    switch (skill) {
      case 'Casual':
        return 'bg-blue-100 text-blue-700';
      case 'Novice':
        return 'bg-purple-100 text-purple-700';
      case 'Elite':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const teamAPlayers = players.filter(p => p.team === 1);
  const teamBPlayers = players.filter(p => p.team === 2);

  // Default coordinates (example: San Francisco)
  const gameLat = gameData?.latitude || 37.7749;
  const gameLng = gameData?.longitude || -122.4194;

  // VOTE SCORE SCREEN
  if (gameState === 'vote-score') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Score Voting</h1>
          <p className="text-white/80 text-sm">Do you agree with this score?</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-8">
          <div className="pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-gray-900 font-bold text-xl mb-2">Score Confirmation</h2>
              <p className="text-gray-600 mb-6 text-2xl font-bold">Team 1: {team1Score} vs Team 2: {team2Score}</p>
              
              {!hasUserVoted && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Button
                    onClick={() => handleVoteScore('approve')}
                    className="rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Agree
                  </Button>
                  <Button
                    onClick={() => handleVoteScore('disagree')}
                    className="rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Disagree
                  </Button>
                </div>
              )}

              {votesDisapproved > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-semibold mb-3">Votes Against:</p>
                  <p className="text-lg font-bold text-red-600">{votesDisapproved}/{players.length}</p>
                </div>
              )}

              {votesApproved > 0 && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-sm text-green-700 font-semibold mb-3">Votes For:</p>
                  <p className="text-lg font-bold text-green-600">{votesApproved}/{players.length}</p>
                </div>
              )}

              {userVote === 'disagree' && votesDisapproved >= Math.ceil(players.length * 0.6) && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <p className="text-sm text-blue-700 font-semibold">✓ Majority disagrees. You will enter the correct score next.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // RESCORE SCREEN
  if (gameState === 'rescore') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Re-enter Score</h1>
          <p className="text-white/80 text-sm">What was the correct final score?</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-gray-900 font-bold text-xl mb-2 text-center">Correct Final Score</h2>
              <p className="text-gray-600 text-sm text-center mb-6">Majority disagreed with the score. Please enter the correct score:</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 font-semibold mb-2 block">Team 1 Score</label>
                  <Input
                    type="number"
                    value={team1Score}
                    onChange={(e) => setTeam1Score(e.target.value)}
                    placeholder="Enter score"
                    className="rounded-xl h-12 text-lg text-center"
                  />
                </div>

                <div className="flex items-center justify-center py-4">
                  <div className="text-4xl font-bold text-gray-400">vs</div>
                </div>

                <div>
                  <label className="text-sm text-gray-600 font-semibold mb-2 block">Team 2 Score</label>
                  <Input
                    type="number"
                    value={team2Score}
                    onChange={(e) => setTeam2Score(e.target.value)}
                    placeholder="Enter score"
                    className="rounded-xl h-12 text-lg text-center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-8">
                <Button
                  onClick={() => setGameState('vote-score')}
                  variant="outline"
                  className="rounded-2xl py-3 font-semibold border-gray-300"
                >
                  Back
                </Button>
                <Button
                  onClick={handleRescore}
                  className="rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Submit Score
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  // REVOTE SCORE SCREEN
  if (gameState === 'revote-score') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Final Score Vote</h1>
          <p className="text-white/80 text-sm">New score submitted - voting again...</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-gray-900 font-bold text-xl mb-2">Final Score Confirmation</h2>
            <p className="text-gray-600 mb-6 text-2xl font-bold">Team 1: {team1Score} vs Team 2: {team2Score}</p>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 font-semibold mb-3">Players Approving:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {players.map((player, index) => (
                  <div key={player.id} className="flex flex-col items-center gap-1">
                    <Badge
                      className={`px-3 py-1.5 text-xs font-semibold ${
                        index < votesApproved
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {player.name}
                    </Badge>
                    <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold px-2 py-0.5`}>
                      {player.skillLevel}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-lg font-bold text-green-600">{votesApproved}/{players.length} Approved</p>
            
            {votesApproved >= Math.ceil(players.length * 0.7) && (
              <p className="text-sm text-green-600 font-semibold mt-4">✓ Score confirmed! Moving to rating...</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // RATING SCREEN
  if (gameState === 'rating') {
    const currentPlayer = players[currentRatingIndex];
    const ratedCount = Object.keys(playerRatings).length;
    const currentRating = playerRatings[currentPlayer.id] || 0;
    const currentComment = playerComments[currentPlayer.id] || '';

    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Rate Players</h1>
          <p className="text-white/80 text-sm">Progress: {ratedCount}/{players.length}</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-8">
          <div className="pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-8 w-full text-center">
              <Avatar className="size-20 mx-auto mb-4">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-2xl font-bold">
                  {currentPlayer.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-gray-900 font-bold text-2xl mb-2">{currentPlayer.name}</h2>
              <Badge className={`${getSkillBadgeColor(currentPlayer.skillLevel)} text-xs font-semibold px-3 py-1 inline-block mb-4`}>
                {currentPlayer.skillLevel}
              </Badge>
              <p className="text-gray-600 mb-6">How did they play?</p>

              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setPlayerRatings(prev => ({ ...prev, [currentPlayer.id]: star }))}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= currentRating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>

              <div className="mb-6 text-left">
                <label className="text-sm text-gray-600 font-semibold mb-2 block">Add a comment (optional)</label>
                <textarea
                  value={currentComment}
                  onChange={(e) => setPlayerComments(prev => ({ ...prev, [currentPlayer.id]: e.target.value }))}
                  placeholder="Why did you give this rating? E.g., Great teamwork, Good defense, Could improve..."
                  className="w-full rounded-xl p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none h-20"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setPlayerRatings(prev => ({ ...prev, [currentPlayer.id]: 0 }));
                    setPlayerComments(prev => ({ ...prev, [currentPlayer.id]: '' }));
                  }}
                  variant="outline"
                  className="flex-1 rounded-2xl py-3 font-semibold border-gray-300"
                >
                  Clear
                </Button>
                <Button
                  onClick={() => setShowReportModal(true)}
                  variant="outline"
                  className="flex-1 rounded-2xl py-3 font-semibold border-red-200 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Report
                </Button>
                <Button
                  onClick={handleRatePlayer}
                  className="flex-1 rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  Submit
                </Button>
              </div>

              {currentRatingIndex < players.length - 1 && (
                <p className="text-sm text-gray-500 mt-4">
                  {players.length - currentRatingIndex - 1} more to rate
                </p>
              )}
            </div>
          </div>
        </ScrollArea>

        {/* Report Modal */}
        {showReportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-end max-w-md mx-auto z-50">
            <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-gray-900 font-bold text-lg">Report {currentPlayer.name}</h3>
                  <Badge className={`${getSkillBadgeColor(currentPlayer.skillLevel)} text-xs font-semibold px-2 py-0.5 mt-1`}>
                    {currentPlayer.skillLevel}
                  </Badge>
                </div>
                <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 font-semibold mb-3">What happened? (Select all that apply)</p>
                <div className="space-y-2">
                  {reportReasonsArray.map((reason) => (
                    <label key={reason} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedReportReasons.includes(reason)}
                        onChange={() => toggleReportReason(reason)}
                        className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                      <span className="text-sm text-gray-700">{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 font-semibold mb-2 block">Additional details (optional)</label>
                <textarea
                  value={reportComment}
                  onChange={(e) => setReportComment(e.target.value)}
                  placeholder="Provide more context about your report..."
                  className="w-full rounded-xl p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none h-20"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowReportModal(false)}
                  variant="outline"
                  className="flex-1 rounded-2xl py-3 font-semibold border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitReport}
                  className="flex-1 rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 flex items-center justify-center gap-2"
                >
                  <Flag className="w-4 h-4" />
                  Submit Report
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // COMPLETED SCREEN
  if (gameState === 'completed') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-green-600 via-emerald-600 to-blue-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Game Complete!</h1>
          <p className="text-white/80 text-sm">Thanks for playing</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-gray-900 font-bold text-2xl mb-2">Game Finished!</h2>
            <p className="text-gray-600 mb-2">Final Score: {team1Score} - {team2Score}</p>
            <p className="text-gray-600 text-sm mb-8">All players rated successfully</p>

            <Button
              onClick={handleReturnToMenu}
              className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // WAITING SCREEN
  if (!gameData) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="bg-white/20 backdrop-blur-sm p-2 rounded-xl">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-2xl font-bold">My Queue</h1>
              <p className="text-white/80 text-sm">Active game</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="size-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">No Active Games</h3>
            <p className="text-sm text-gray-600">Create or join a game to see it here.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-24">
      {/* Header with Game Status */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl hover:bg-white/30 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl font-bold">{gameData.title}</h1>
            <p className="text-white/80 text-sm">{gameData.sport}</p>
          </div>
          {isHost && (
            <Badge className="bg-purple-400 text-purple-900 font-semibold text-xs px-2.5 py-1 flex-shrink-0">
              Host
            </Badge>
          )}
        </div>

        {/* Game Status Card */}
        <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setShowMapModal(true)}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{gameData.location}</span>
              </button>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{gameData.time}</span>
              </div>
            </div>
            <Badge className="bg-yellow-400 text-yellow-900 font-semibold text-xs px-3 py-1">
              {readyCount}/{players.length} Ready
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-6 mt-6">
        <div className="space-y-4 pb-40">
          {/* Status Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-900 font-medium text-sm">Click 'I'm Ready!' when you're prepared to play</p>
                <p className="text-blue-600 text-xs mt-1 font-semibold">{readyCount}/{players.length} players ready</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => setShowMapModal(true)}
                variant="outline"
                className="rounded-2xl py-3 font-semibold border-green-300 text-green-700 hover:bg-green-50 flex items-center justify-center gap-2"
              >
                <Map className="w-5 h-5" />
                Location
              </Button>
              <Button
                onClick={() => setShowInviteModal(true)}
                variant="outline"
                className="rounded-2xl py-3 font-semibold border-blue-300 text-blue-700 hover:bg-blue-50 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Invite
              </Button>
            </div>

            {!isHost && (
              <Button
                onClick={handleSwitchTeam}
                disabled={userReady}
                variant="outline"
                className="w-full rounded-2xl py-3 font-semibold border-gray-300"
              >
                Switch Team
              </Button>
            )}

            {isHost ? (
              <Button
                onClick={() => setGameState('vote-score')}
                disabled={readyCount < players.length}
                className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Play className="w-5 h-5" />
                Start Game
              </Button>
            ) : (
              <Button
                onClick={handleReady}
                className={`w-full rounded-2xl py-3 font-semibold text-white ${
                  userReady
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                }`}
              >
                {userReady ? '✓ Ready - Waiting for others' : "I'm Ready!"}
              </Button>
            )}

            <Button
              onClick={() => gameData && onLeaveGame?.(gameData.id)}
              variant="outline"
              className="w-full rounded-2xl py-3 font-semibold border-red-200 text-red-600 hover:bg-red-50"
            >
              Leave Game
            </Button>
          </div>

          {/* Team 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-4 mt-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <h3 className="text-gray-900 font-semibold">Team 1</h3>
              </div>
              <span className="text-gray-600 text-sm font-medium">{teamAPlayers.length} players</span>
            </div>
            <div className="space-y-2">
              {teamAPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    player.isCurrentUser
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50'
                  } ${kickingPlayerId === player.id ? 'opacity-50' : ''}`}
                >
                  <button
                    onClick={() => {
                      if (!player.isCurrentUser) {
                        setSelectedPlayer({
                          name: player.name,
                          username: player.name.toLowerCase().replace(' ', '_'),
                          userId: `SP2025-${1000 + parseInt(player.id.replace('player-', '') || '0')}`,
                          isVerified: player.verified,
                          rating: 4.5,
                          gamesPlayed: 20,
                          reliabilityScore: 88,
                        });
                      }
                    }}
                    disabled={player.isCurrentUser}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <Avatar className="size-9 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs font-semibold">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-gray-900 font-medium truncate">{player.name}</p>
                        {player.verified && <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                      </div>
                      <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold mt-1`}>
                        {player.skillLevel}
                      </Badge>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {player.isCurrentUser ? (
                      <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                    ) : player.ready ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-semibold">Ready</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 text-xs font-semibold">Waiting</Badge>
                    )}
                    {isHost && !player.isCurrentUser && (
                      <button
                        onClick={() => handleKickPlayer(player.id, player.name)}
                        disabled={kickingPlayerId === player.id}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600 disabled:opacity-50"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <h3 className="text-gray-900 font-semibold">Team 2</h3>
              </div>
              <span className="text-gray-600 text-sm font-medium">{teamBPlayers.length} players</span>
            </div>
            <div className="space-y-2">
              {teamBPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${
                    player.isCurrentUser
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50'
                  } ${kickingPlayerId === player.id ? 'opacity-50' : ''}`}
                >
                  <button
                    onClick={() => {
                      if (!player.isCurrentUser) {
                        setSelectedPlayer({
                          name: player.name,
                          username: player.name.toLowerCase().replace(' ', '_'),
                          userId: `SP2025-${1000 + parseInt(player.id.replace('player-', '') || '0')}`,
                          isVerified: player.verified,
                          rating: 4.5,
                          gamesPlayed: 20,
                          reliabilityScore: 88,
                        });
                      }
                    }}
                    disabled={player.isCurrentUser}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <Avatar className="size-9 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-semibold">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm text-gray-900 font-medium truncate">{player.name}</p>
                        {player.verified && <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                      </div>
                      <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold mt-1`}>
                        {player.skillLevel}
                      </Badge>
                    </div>
                  </button>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {player.isCurrentUser ? (
                      <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                    ) : player.ready ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-semibold">Ready</Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-600 text-xs font-semibold">Waiting</Badge>
                    )}
                    {isHost && !player.isCurrentUser && (
                      <button
                        onClick={() => handleKickPlayer(player.id, player.name)}
                        disabled={kickingPlayerId === player.id}
                        className="p-1.5 hover:bg-red-100 rounded-lg transition-colors text-red-600 disabled:opacity-50"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end max-w-md mx-auto z-50">
          <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Game Location</h3>
                <p className="text-sm text-gray-600 mt-1">{gameData.location}</p>
              </div>
              <button onClick={() => setShowMapModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 relative overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${gameLng - 0.01},${gameLat - 0.01},${gameLng + 0.01},${gameLat + 0.01}&layer=mapnik&marker=${gameLat},${gameLng}`}
                allowFullScreen
              />
            </div>
            <div className="p-6 border-t">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${gameLat},${gameLng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block text-center bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white py-3 rounded-2xl font-semibold transition-colors"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Invite Team Members Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-end max-w-md mx-auto z-50">
          <div className="bg-white w-full rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h3 className="text-gray-900 font-bold text-lg">Invite Team Members</h3>
                <p className="text-sm text-gray-600 mt-1">Send invites to your team</p>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
            <ScrollArea className="flex-1 px-6 py-4">
              <div className="space-y-2">
                {mockTeamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <Avatar className="size-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white text-sm font-semibold">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900 font-medium truncate">{member.name}</p>
                        {member.online && (
                          <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                        )}
                      </div>
                      <Badge className={`${getSkillBadgeColor(member.skillLevel)} text-xs font-semibold mt-1`}>
                        {member.skillLevel}
                      </Badge>
                    </div>
                    <button
                      onClick={() => handleInviteTeamMember(member)}
                      disabled={!member.online}
                      className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="p-6 border-t">
              <Button
                onClick={() => setShowInviteModal(false)}
                variant="outline"
                className="w-full rounded-2xl py-3 font-semibold"
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Mini Profile */}
      {selectedPlayer && (
        <MiniProfileCard
          user={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onViewFullProfile={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}