import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Users, CheckCircle2, Play, X, Trophy, Star, Flag, AlertCircle } from 'lucide-react';
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
  gameData?: {
    id: string;
    title: string;
    sport: string;
    location: string;
    date: string;
    time: string;
    maxPlayers: number;
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
}

type GameState = 'waiting' | 'active' | 'finish-score' | 'vote-score' | 'rating' | 'completed';

export function QueueScreen({ onBack, onLeaveGame, gameData, isHost = false }: QueueScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [userReady, setUserReady] = useState(false);
  const [userTeam, setUserTeam] = useState<1 | 2>(1);
  const [readyCount, setReadyCount] = useState(0);
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [team1Score, setTeam1Score] = useState('');
  const [team2Score, setTeam2Score] = useState('');
  const [votesApproved, setVotesApproved] = useState(0);
  const [currentRatingIndex, setCurrentRatingIndex] = useState(0);
  const [playerRatings, setPlayerRatings] = useState<{ [key: string]: number }>({});
  const [playerComments, setPlayerComments] = useState<{ [key: string]: string }>({});
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');

  useEffect(() => {
    if (gameData) {
      initializePlayers();
    }
  }, [gameData?.maxPlayers]);

  // Auto-ready all players after 5 seconds (simulation)
  useEffect(() => {
    if (isHost && gameState === 'waiting' && players.length > 0) {
      const timer = setTimeout(() => {
        // Auto-ready all players
        const updatedPlayers = players.map(p => ({ ...p, ready: true }));
        setPlayers(updatedPlayers);
        setReadyCount(players.length);
        toast.success('All players are ready!');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isHost, gameState, players]);

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
    });

    for (let i = 1; i < gameData.maxPlayers; i++) {
      const team = (i % 2 === 0) ? 1 : 2;
      newPlayers.push({
        id: `player-${i}`,
        name: aiPlayerNames[i - 1] || `Player ${i}`,
        verified: Math.random() > 0.3,
        team: team,
        isCurrentUser: false,
        ready: false,
      });
    }

    setPlayers(newPlayers);
  };

  const handleReady = () => {
    if (!userReady) {
      setUserReady(true);
      setReadyCount(prev => prev + 1);
      toast.success('You are ready! Waiting for others...');
    } else {
      setUserReady(false);
      setReadyCount(prev => Math.max(0, prev - 1));
      toast.info('You are no longer ready');
    }
  };

  const handleStartGame = () => {
    setGameState('active');
    toast.success('Game started! Play now...');
  };

  const handleFinishGame = () => {
    setGameState('finish-score');
    toast.info('Enter final scores for voting');
  };

  const handleSubmitScore = () => {
    if (!team1Score || !team2Score) {
      toast.error('Please enter scores for both teams');
      return;
    }
    setGameState('vote-score');
    toast.info('Players are voting on the score...');
    
    // Simulate votes coming in
    let voteCount = 0;
    const voteInterval = setInterval(() => {
      voteCount++;
      setVotesApproved(voteCount);
      if (voteCount >= players.length) {
        clearInterval(voteInterval);
        setTimeout(() => {
          setGameState('rating');
          toast.success('All players approved! Moving to rating...');
        }, 1000);
      }
    }, 500);
  };

  const handleRatePlayer = () => {
    const currentPlayer = players[currentRatingIndex];
    const rating = playerRatings[currentPlayer.id] || 0;
    const comment = playerComments[currentPlayer.id] || '';

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      toast.error('Please add a comment');
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
    if (!reportReason.trim()) {
      toast.error('Please provide a reason for the report');
      return;
    }
    toast.success('Report submitted successfully');
    setShowReportModal(false);
    setReportReason('');
  };

  const handleReturnToMenu = () => {
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

  const teamAPlayers = players.filter(p => p.team === 1);
  const teamBPlayers = players.filter(p => p.team === 2);

  // FINISH SCORE SCREEN
  if (gameState === 'finish-score') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-white text-2xl font-bold flex-1">{gameData?.title}</h1>
            <Badge className="bg-green-400 text-green-900 font-semibold text-xs px-2.5 py-1 flex-shrink-0">
              Active
            </Badge>
          </div>
          <p className="text-white/80 text-sm">Enter final scores</p>
        </div>

        <ScrollArea className="flex-1 px-6 py-6">
          <div className="space-y-6 pb-32">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-gray-900 font-bold text-xl mb-6 text-center">Final Score</h2>
              
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
                  onClick={() => setGameState('active')}
                  variant="outline"
                  className="rounded-2xl py-3 font-semibold border-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmitScore}
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

  // VOTE SCORE SCREEN
  if (gameState === 'vote-score') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <h1 className="text-white text-2xl font-bold">Score Voting</h1>
          <p className="text-white/80 text-sm">Players voting on final score...</p>
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center w-full">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-gray-900 font-bold text-xl mb-2">Score Confirmation</h2>
            <p className="text-gray-600 mb-6">Team 1: {team1Score} vs Team 2: {team2Score}</p>
            
            <div className="mb-6">
              <p className="text-sm text-gray-600 font-semibold mb-3">Players Approved:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {players.map((player, index) => (
                  <Badge
                    key={player.id}
                    className={`px-3 py-1.5 text-xs font-semibold ${
n                      index < votesApproved
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {player.name}
                  </Badge>
                ))}
              </div>
            </div>

            <p className="text-lg font-bold text-blue-600">{votesApproved}/{players.length}</p>
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
                  className="w-full rounded-xl p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none h-24"
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
            <div className="bg-white w-full rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900 font-bold text-lg">Report {currentPlayer.name}</h3>
                <button onClick={() => setShowReportModal(false)} className="text-gray-500 hover:text-gray-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Tell us why you're reporting this player. E.g., Inappropriate behavior, Didn't show up, etc."
                className="w-full rounded-xl p-3 border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 resize-none h-24 mb-4"
              />

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
              Return to Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ACTIVE GAME SCREEN
  if (gameState === 'active') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1">
              <h1 className="text-white text-2xl font-bold">{gameData?.title}</h1>
              <p className="text-white/80 text-sm">{gameData?.sport}</p>
            </div>
            <Badge className="bg-green-400 text-green-900 font-semibold text-xs px-2.5 py-1 flex-shrink-0">
              Live
            </Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 mt-6">
          <div className="space-y-4 pb-32">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-6 text-white text-center">
              <p className="text-sm opacity-90 mb-2">Game in Progress</p>
              <p className="text-3xl font-bold">Playing Now!</p>
            </div>

            {/* Team 1 */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <h3 className="text-gray-900 font-semibold">Team 1</h3>
                </div>
              </div>
              <div className="space-y-2">
                {teamAPlayers.map((player) => (
                  <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Avatar className="size-9 flex-shrink-0">
                      <AvatarFallback className="bg-blue-500 text-white text-xs font-bold">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{player.name}</p>
                    </div>
                    {player.ready && (
                      <Badge className="bg-green-100 text-green-700 text-xs font-semibold flex-shrink-0">Ready</Badge>
                    )}
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
              </div>
              <div className="space-y-2">
                {teamBPlayers.map((player) => (
                  <div key={player.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <Avatar className="size-9 flex-shrink-0">
                      <AvatarFallback className="bg-purple-500 text-white text-xs font-bold">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{player.name}</p>
                    </div>
                    {player.ready && (
                      <Badge className="bg-green-100 text-green-700 text-xs font-semibold flex-shrink-0">Ready</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {isHost && (
          <div className="fixed bottom-6 left-6 right-6 max-w-[calc(100%-3rem)]">
            <Button
              onClick={handleFinishGame}
              className="w-full rounded-2xl py-3 font-semibold text-white bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
            >
              Finish Game
            </Button>
          </div>
        )}
      </div>
    );
  }

  // WAITING SCREEN (original)
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
              <div className="flex items-center gap-2 text-white/90">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{gameData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{gameData.time}</span>
              </div>
            </div>
            <Badge className="bg-yellow-400 text-yellow-900 font-semibold text-xs px-3 py-1">
              Waiting for Players
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
                <p className="text-gray-900 font-medium text-sm">Waiting for all players to be ready</p>
                <p className="text-blue-600 text-xs mt-1 font-semibold">{readyCount}/{players.length} players ready</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
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
                onClick={handleStartGame}
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
                    ? 'bg-gray-600 hover:bg-gray-700'
                    : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
                }`}
              >
                {userReady ? 'Not Ready' : "I'm Ready!"}
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
                <button
                  key={player.id}
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
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    player.isCurrentUser
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <Avatar className="size-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs font-semibold">
                      {player.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900 font-medium truncate">{player.name}</p>
                      {player.verified && <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                    </div>
                  </div>
                  {player.isCurrentUser ? (
                    <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">You</Badge>
                  ) : player.ready ? (
                    <Badge className="bg-green-100 text-green-700 text-xs font-semibold flex-shrink-0">Ready</Badge>
                  ) : null}
                </button>
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
                <button
                  key={player.id}
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
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
                    player.isCurrentUser
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <Avatar className="size-9 flex-shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs font-semibold">
                      {player.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-900 font-medium truncate">{player.name}</p>
                      {player.verified && <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                    </div>
                  </div>
                  {player.isCurrentUser ? (
                    <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">You</Badge>
                  ) : player.ready ? (
                    <Badge className="bg-green-100 text-green-700 text-xs font-semibold flex-shrink-0">Ready</Badge>
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

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