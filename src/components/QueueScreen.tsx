import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Clock, Star, CheckCircle2, Navigation, Shield, RotateCcw, Award } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { MiniProfileCard } from './MiniProfileCard';
import { GameScoreVotingDialog } from './GameScoreVotingDialog';

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
  isReady: boolean;
  isHost: boolean;
  isCurrentUser: boolean;
}

type GameState = 'queue' | 'countdown' | 'voting' | 'results';

export function QueueScreen({ onBack, onLeaveGame, onFinishGame, gameData, isHost = false }: QueueScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUserReady, setCurrentUserReady] = useState(false);
  const [gameState, setGameState] = useState<GameState>('queue');
  const [teamAScore, setTeamAScore] = useState(0);
  const [teamBScore, setTeamBScore] = useState(0);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [countdownSeconds, setCountdownSeconds] = useState(5);
  const [allPlayersReady, setAllPlayersReady] = useState(false);

  // Initialize players when component mounts
  useEffect(() => {
    if (gameData) {
      initializePlayers();
    }
  }, [gameData?.maxPlayers]);

  // Auto-start game countdown when all players are ready
  useEffect(() => {
    if (allPlayersReady && gameState === 'queue') {
      setGameState('countdown');
      toast.success('All players ready! Starting game...');
    }
  }, [allPlayersReady, gameState]);

  // Countdown timer
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdownSeconds <= 0) {
        // Game starts - move to voting
        setGameState('voting');
        toast.success('Game started! Time to vote scores.');
        return;
      }

      const timer = setTimeout(() => {
        setCountdownSeconds(countdownSeconds - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdownSeconds, gameState]);

  const initializePlayers = () => {
    if (!gameData) return;

    const aiPlayerNames = [
      'Alex Chen', 'Maria Santos', 'John Doe', 'Sarah Lee', 'Mike Johnson',
      'Emma Wilson', 'David Kim', 'Lisa Brown', 'Tom Anderson', 'Anna Garcia',
      'Chris Taylor', 'Nina Patel', 'Ryan Clark', 'Sophie Martin', 'Jake Lewis'
    ];

    const newPlayers: Player[] = [];
    
    // Add current user as first player
    newPlayers.push({
      id: 'current-user',
      name: 'You',
      verified: true,
      team: 1,
      isReady: false,
      isHost: isHost,
      isCurrentUser: true,
    });

    // Add AI players to fill the game
    for (let i = 1; i < gameData.maxPlayers; i++) {
      const team = (i % 2 === 0) ? 1 : 2; // Alternate teams
      newPlayers.push({
        id: `player-${i}`,
        name: aiPlayerNames[i - 1] || `Player ${i}`,
        verified: Math.random() > 0.3, // 70% chance of being verified
        team: team,
        isReady: false,
        isHost: i === 1 && !isHost, // If current user is not host, make first AI the host
        isCurrentUser: false,
      });
    }

    setPlayers(newPlayers);
  };

  // Handle ready/start button click
  const handleActionClick = () => {
    if (isHost) {
      // Host clicks "Start Now" - immediate game start
      if (!currentUserReady) {
        setCurrentUserReady(true);
        toast.success('Starting game...');
        
        // Immediate transition for host
        setTimeout(() => {
          setGameState('voting');
          toast.success('Game finished! Time to vote scores.');
        }, 2000);
      }
    } else {
      // Player clicks "I'm Ready!"
      if (!currentUserReady) {
        setCurrentUserReady(true);
        setPlayers(prev => prev.map(p => 
          p.isCurrentUser ? { ...p, isReady: true } : p
        ));
        toast.success('You are ready! Waiting for others...');
        
        // Check if all players are ready
        const updatedPlayers = players.map(p => 
          p.isCurrentUser ? { ...p, isReady: true } : p
        );
        checkIfAllReady(updatedPlayers);
      } else {
        // Un-ready
        setCurrentUserReady(false);
        setPlayers(prev => prev.map(p => 
          p.isCurrentUser ? { ...p, isReady: false } : p
        ));
        setAllPlayersReady(false);
        toast.info('You are no longer ready');
      }
    }
  };

  // Check if all players are ready
  const checkIfAllReady = (playersList: Player[]) => {
    const totalPlayers = playersList.length;
    const readyCount = playersList.filter(p => p.isReady).length;
    
    if (readyCount === totalPlayers) {
      setAllPlayersReady(true);
    }
  };

  // Handle team switch
  const handleSwitchTeam = () => {
    if (currentUserReady) {
      toast.error('Cannot switch teams after readying up');
      return;
    }

    setPlayers(prev => prev.map(p => 
      p.isCurrentUser ? { ...p, team: p.team === 1 ? 2 : 1 } : p
    ));
    const currentTeam = players.find(p => p.isCurrentUser)?.team || 1;
    toast.success(`Switched to Team ${currentTeam === 1 ? 2 : 1}`);
  };

  const handleScoresSubmitted = (teamAFinalScore: number, teamBFinalScore: number) => {
    setTeamAScore(teamAFinalScore);
    setTeamBScore(teamBFinalScore);
    
    // Calculate points earned
    const earned = Math.floor(Math.random() * 50) + 50; // 50-100 points
    setPointsEarned(earned);
    
    // Show results after a brief delay
    setTimeout(() => {
      setGameState('results');
    }, 500);
  };

  const handleReturnToHome = () => {
    onBack?.();
  };

  const teamAPlayers = players.filter(p => p.team === 1);
  const teamBPlayers = players.filter(p => p.team === 2);
  const currentUserTeam = players.find(p => p.isCurrentUser)?.team || 1;
  const readyPlayersCount = players.filter(p => p.isReady).length;

  // If no game data provided, show empty state
  if (!gameData) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
            >
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

  // RESULTS STATE - Show points earned and return button
  if (gameState === 'results') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-white text-2xl font-bold">Match Complete!</h1>
              <p className="text-white/80 text-sm">{gameData.title}</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 px-6 mt-6">
          <div className="space-y-6 pb-40">
            {/* Final Score Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
              <h3 className="text-gray-900 text-center font-semibold">Final Score</h3>
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600">{teamAScore}</div>
                  <p className="text-sm text-gray-600 mt-2">Team A</p>
                </div>
                <div className="text-2xl text-gray-400">vs</div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-600">{teamBScore}</div>
                  <p className="text-sm text-gray-600 mt-2">Team B</p>
                </div>
              </div>
            </div>

            {/* Points Earned Card */}
            <div className="bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl shadow-lg p-6 text-white space-y-2 text-center">
              <Award className="w-8 h-8 mx-auto mb-2" />
              <p className="text-white/90 text-sm">Points Earned</p>
              <p className="text-5xl font-bold">{pointsEarned}</p>
              <p className="text-white/80 text-xs mt-4">Great match! Keep playing to earn more points.</p>
            </div>

            {/* Game Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Sport</span>
                <span className="text-gray-900 font-medium">{gameData.sport}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Location</span>
                <span className="text-gray-900 font-medium">{gameData.location}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Players</span>
                <span className="text-gray-900 font-medium">{players.length} total</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Your Team</span>
                <span className="text-gray-900 font-medium">Team {currentUserTeam === 1 ? 'A' : 'B'}</span>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Return Button */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-sm">
          <Button
            onClick={handleReturnToHome}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white rounded-2xl font-semibold py-3"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  // VOTING STATE - Score voting dialog
  if (gameState === 'voting') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
        <GameScoreVotingDialog
          open={true}
          onOpenChange={() => {}}
          isHost={isHost}
          gameTitle={gameData.title}
          onScoresSubmitted={handleScoresSubmitted}
        />
      </div>
    );
  }

  // COUNTDOWN STATE - Show countdown timer
  if (gameState === 'countdown') {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Game Starting In</h2>
          <div className="text-8xl font-bold bg-gradient-to-br from-blue-600 to-green-600 bg-clip-text text-transparent animate-pulse">
            {countdownSeconds}
          </div>
          <p className="text-gray-600">Get ready!</p>
        </div>
      </div>
    );
  }

  // QUEUE STATE - Main queue screen
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl hover:bg-white/30 transition"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-2xl font-bold">My Queue</h1>
            <p className="text-white/80 text-sm">Active game</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1 px-6 mt-6">
        <div className="space-y-4 pb-40">
          {/* Game Info Card */}
          <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl mb-1">{gameData.sport}</h2>
                <h3 className="text-lg font-semibold text-gray-900">{gameData.title}</h3>
              </div>
              <Badge className={isHost ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                {isHost ? 'Host' : 'Joined'}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{gameData.location}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{gameData.date}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4" />
                <span>{gameData.time}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{players.length}/{gameData.maxPlayers} players</span>
              </div>
            </div>
          </div>

          {/* Your Status Section */}
          <div className="bg-white rounded-2xl shadow-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900 font-semibold">Your Status</h3>
              <Badge variant={currentUserReady ? "default" : "outline"} className={currentUserReady ? "bg-green-600" : ""}>
                {currentUserReady ? '✓ Ready' : 'Not Ready'}
              </Badge>
            </div>

            {/* Ready Status Info for Players */}
            {!isHost && (
              <div className="bg-blue-50 rounded-xl p-3 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">{readyPlayersCount}/{players.length}</span> players ready
                </p>
                {allPlayersReady && (
                  <p className="text-green-600 font-semibold mt-1">All players ready! Game starting...</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
              <div>
                <p className="text-xs text-gray-600">Your Team</p>
                <p className="text-gray-900 font-semibold">Team {currentUserTeam === 1 ? 'A' : 'B'}</p>
              </div>
              <Button
                onClick={handleSwitchTeam}
                disabled={currentUserReady}
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
              >
                Switch Team
              </Button>
            </div>

            {/* Main Action Button */}
            <Button
              onClick={handleActionClick}
              className={`w-full rounded-2xl font-semibold py-3 text-base ${
                currentUserReady
                  ? 'bg-gray-600 hover:bg-gray-700'
                  : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700'
              }`}
            >
              {isHost ? (currentUserReady ? 'Stop Game' : 'Start Now') : (currentUserReady ? 'Not Ready' : "I'm Ready!")}
            </Button>
          </div>

          {/* Teams */}
          {/* Team A */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 font-semibold">Team A</h3>
              <Badge variant="outline" className="text-xs">{teamAPlayers.length} players</Badge>
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
                      ? 'bg-blue-50 border border-blue-200 cursor-default'
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
                      <p className="text-sm text-gray-900 truncate">{player.name}</p>
                      {player.verified && <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                    </div>
                  </div>
                  {player.isCurrentUser && (
                    <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">You</Badge>
                  )}
                  {player.isReady && (
                    <Badge className="bg-green-600 text-white text-xs flex-shrink-0">✓ Ready</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Team B */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-900 font-semibold">Team B</h3>
              <Badge variant="outline" className="text-xs">{teamBPlayers.length} players</Badge>
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
                      ? 'bg-blue-50 border border-blue-200 cursor-default'
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
                      <p className="text-sm text-gray-900 truncate">{player.name}</p>
                      {player.verified && <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                    </div>
                  </div>
                  {player.isCurrentUser && (
                    <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">You</Badge>
                  )}
                  {player.isReady && (
                    <Badge className="bg-green-600 text-white text-xs flex-shrink-0">✓ Ready</Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Cancel/Leave Button */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <Button
              variant="outline"
              className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => gameData && onLeaveGame?.(gameData.id)}
            >
              {isHost ? 'Cancel Game' : 'Leave Game'}
            </Button>
          </div>
        </div>
      </ScrollArea>

      {/* Mini Profile Card */}
      {selectedPlayer && (
        <MiniProfileCard
          user={selectedPlayer}
          onClose={() => setSelectedPlayer(null)}
          onViewFullProfile={() => {
            setSelectedPlayer(null);
          }}
        />
      )}
    </div>
  );
}