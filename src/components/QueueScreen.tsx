import { toast } from 'sonner@2.0.3';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Clock, Star, CheckCircle2, Navigation, Shield } from 'lucide-react';
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

export function QueueScreen({ onBack, onLeaveGame, onFinishGame, gameData, isHost = false }: QueueScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUserReady, setCurrentUserReady] = useState(false);
  const [showVotingDialog, setShowVotingDialog] = useState(false);

  // Initialize players when component mounts
  useEffect(() => {
    if (gameData) {
      initializePlayers();
    }
  }, [gameData?.maxPlayers]);

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

  // Handle ready button click - now triggers game simulation
  const handleReadyClick = () => {
    if (!currentUserReady) {
      // User is getting ready - trigger simulation
      setCurrentUserReady(true);
      setPlayers(prev => prev.map(p => 
        p.isCurrentUser ? { ...p, isReady: true } : p
      ));
      toast.success('You are ready! Starting game...');
      
      // Simulate the game after a short delay
      setTimeout(() => {
        setShowVotingDialog(true);
      }, 1500);
    } else {
      // User is un-readying
      setCurrentUserReady(false);
      setPlayers(prev => prev.map(p => 
        p.isCurrentUser ? { ...p, isReady: false } : p
      ));
      toast.info('You are no longer ready');
    }
  };

  // Handle switching teams
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

  const teamAPlayers = players.filter(p => p.team === 1);
  const teamBPlayers = players.filter(p => p.team === 2);
  const currentUserTeam = players.find(p => p.isCurrentUser)?.team || 1;

  // If no game data provided, show the mock games list (legacy view)
  if (!gameData) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <div>
              <h1 className="text-white text-2xl">My Queue</h1>
              <p className="text-white/80 text-sm">No active games</p>
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <Users className="size-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-gray-900 mb-2">No Active Games</h3>
            <p className="text-sm text-gray-600">
              Create or join a game to see it here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-2xl">My Queue</h1>
            <p className="text-white/80 text-sm">Active game</p>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <ScrollArea className="flex-1 px-6 mt-6">
        <div className="space-y-4 pb-40">
          {/* Game Info Card */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-4">
            {/* Game Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{gameData.sport}</div>
                <div>
                  <h3 className="text-gray-900">{gameData.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">
                      {isHost ? 'You are the host' : 'Joined as participant'}
                    </span>
                    {isHost && <Shield className="w-4 h-4 text-blue-600" />}
                  </div>
                </div>
              </div>
              <Badge className={isHost ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}>
                {isHost ? 'Host' : 'Joined'}
              </Badge>
            </div>

            {/* Game Details */}
            <div className="grid grid-cols-2 gap-3 text-sm">
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

          {/* Team Selection & Ready Status */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-900">Your Status</h3>
              <Badge variant={currentUserReady ? "default" : "outline"} className={currentUserReady ? "bg-green-600" : ""}>
                {currentUserReady ? '✓ Ready' : 'Not Ready'}
              </Badge>
            </div>

            <div className="flex items-center justify-between bg-blue-50 rounded-xl p-3">
              <div>
                <p className="text-sm text-gray-600">Your Team</p>
                <p className="text-gray-900">Team {currentUserTeam === 1 ? 'A' : 'B'}</p>
              </div>
              <Button
                onClick={handleSwitchTeam}
                disabled={currentUserReady}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                Switch Team
              </Button>
            </div>

            <Button
              onClick={handleReadyClick}
              className={`w-full rounded-xl ${
                currentUserReady 
                  ? 'bg-gray-600 hover:bg-gray-700' 
                  : 'bg-gradient-to-r from-blue-600 to-green-600'
              }`}
            >
              {currentUserReady ? 'Not Ready' : 'I\'m Ready!'}
            </Button>
          </div>

          {/* Teams Display */}
          <div className="space-y-3">
            {/* Team A */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900">Team A</h3>
                <Badge variant="outline" className="text-xs">
                  {teamAPlayers.length} players
                </Badge>
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
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-left ${
                      player.isCurrentUser
                        ? 'bg-blue-50 border border-blue-200 cursor-default'
                        : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                    }`}
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-green-500 text-white text-xs">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900 truncate">{player.name}</p>
                        {player.verified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        )}
                        {player.isHost && (
                          <Shield className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {player.isCurrentUser && (
                      <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                    )}
                    {player.isReady && (
                      <Badge className="bg-green-600 text-white text-xs">Ready</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Team B */}
            <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900">Team B</h3>
                <Badge variant="outline" className="text-xs">
                  {teamBPlayers.length} players
                </Badge>
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
                    className={`w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-left ${
                      player.isCurrentUser
                        ? 'bg-blue-50 border border-blue-200 cursor-default'
                        : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                    }`}
                  >
                    <Avatar className="size-8">
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xs">
                        {player.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-900 truncate">{player.name}</p>
                        {player.verified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-600 flex-shrink-0" />
                        )}
                        {player.isHost && (
                          <Shield className="w-3 h-3 text-amber-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                    {player.isCurrentUser && (
                      <Badge className="bg-blue-600 text-white text-xs">You</Badge>
                    )}
                    {player.isReady && (
                      <Badge className="bg-green-600 text-white text-xs">Ready</Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-2">
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

      {/* Game Score Voting Dialog */}
      {showVotingDialog && (
        <GameScoreVotingDialog
          open={showVotingDialog}
          onOpenChange={(open) => {
            setShowVotingDialog(open);
            if (!open) {
              // When dialog closes after successful rating, trigger finish game
              if (gameData && onFinishGame) {
                onFinishGame(gameData.id, gameData.title, {
                  id: 'host-player',
                  name: isHost ? 'You' : players.find(p => p.isHost)?.name || 'Host',
                  verified: true,
                });
              }
            }
          }}
          isHost={isHost}
          gameTitle={gameData?.title || 'Game'}
          onScoresSubmitted={(teamAScore, teamBScore) => {
            toast.success(`Final Score: ${teamAScore} - ${teamBScore}`);
          }}
        />
      )}
    </div>
  );
}