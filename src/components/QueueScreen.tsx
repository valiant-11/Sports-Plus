import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Clock, Users, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
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
}

export function QueueScreen({ onBack, onLeaveGame, gameData, isHost = false }: QueueScreenProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [userReady, setUserReady] = useState(false);
  const [userTeam, setUserTeam] = useState<1 | 2>(1);
  const [readyCount, setReadyCount] = useState(0);

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
    
    newPlayers.push({
      id: 'current-user',
      name: 'You',
      verified: true,
      team: 1,
      isCurrentUser: true,
    });

    for (let i = 1; i < gameData.maxPlayers; i++) {
      const team = (i % 2 === 0) ? 1 : 2;
      newPlayers.push({
        id: `player-${i}`,
        name: aiPlayerNames[i - 1] || `Player ${i}`,
        verified: Math.random() > 0.3,
        team: team,
        isCurrentUser: false,
      });
    }

    setPlayers(newPlayers);
  };

  const handleReady = () => {
    if (!userReady) {
      // User is marking themselves as ready
      setUserReady(true);
      setReadyCount(prev => prev + 1);
      toast.success('You are ready! Game will start when all players are ready...');
      
      // Check if all players are now ready (including this one)
      const newReadyCount = readyCount + 1;
      if (newReadyCount === players.length) {
        // Simulate game start
        setTimeout(() => {
          toast.success('All players ready! Game starting...');
        }, 500);
      }
    } else {
      // User is marking themselves as not ready
      setUserReady(false);
      setReadyCount(prev => Math.max(0, prev - 1));
      toast.info('You are no longer ready');
    }
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
            <Button
              onClick={handleSwitchTeam}
              disabled={userReady}
              variant="outline"
              className="w-full rounded-2xl py-3 font-semibold border-gray-300"
            >
              Switch Team
            </Button>

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
                  {player.isCurrentUser && (
                    <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">You</Badge>
                  )}
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
                  {player.isCurrentUser && (
                    <Badge className="bg-blue-600 text-white text-xs flex-shrink-0">You</Badge>
                  )}
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