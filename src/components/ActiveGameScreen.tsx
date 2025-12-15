import { useState, useEffect } from 'react';
import { ArrowLeft, Users, Clock, MapPin, CheckCircle2, Shield, AlertCircle, Trophy } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner@2.0.3';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { MiniProfileCard } from './MiniProfileCard';
import { PostGameSummaryScreen } from './PostGameSummaryScreen';

interface Player {
  id: string;
  name: string;
  verified: boolean;
  team: 1 | 2;
  isReady: boolean;
  isHost: boolean;
  isCurrentUser: boolean;
}

interface ActiveGameScreenProps {
  onBack: () => void;
  gameData: {
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

type GameStatus = 'waiting' | 'ready' | 'in-progress' | 'scoring' | 'voting' | 'completed';

interface Vote {
  playerId: string;
  playerName: string;
  agreed: boolean;
}

export function ActiveGameScreen({ onBack, gameData, isHost = false }: ActiveGameScreenProps) {
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUserReady, setCurrentUserReady] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [teamAScore, setTeamAScore] = useState('');
  const [teamBScore, setTeamBScore] = useState('');
  const [proposedScores, setProposedScores] = useState<{ teamA: number; teamB: number } | null>(null);
  const [votes, setVotes] = useState<Vote[]>([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [showCounterProposal, setShowCounterProposal] = useState(false);
  const [counterTeamAScore, setCounterTeamAScore] = useState('');
  const [counterTeamBScore, setCounterTeamBScore] = useState('');
  const [showPlayerRating, setShowPlayerRating] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Initialize players when component mounts
  useEffect(() => {
    initializePlayers();
  }, [gameData.maxPlayers]);

  const initializePlayers = () => {
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

  // Handle ready button click
  const handleReadyClick = () => {
    setCurrentUserReady(!currentUserReady);
    setPlayers(prev => prev.map(p => 
      p.isCurrentUser ? { ...p, isReady: !p.isReady } : p
    ));

    if (!currentUserReady) {
      toast.success('You are ready!');
      // Simulate other players getting ready after 1-3 seconds
      simulateOtherPlayersReady();
    } else {
      toast.info('You are no longer ready');
    }
  };

  // Simulate other AI players getting ready
  const simulateOtherPlayersReady = () => {
    const unreadyPlayers = players.filter(p => !p.isCurrentUser && !p.isReady);
    
    unreadyPlayers.forEach((player, index) => {
      setTimeout(() => {
        setPlayers(prev => prev.map(p => 
          p.id === player.id ? { ...p, isReady: true } : p
        ));
      }, (index + 1) * 1500 + Math.random() * 1000); // Stagger the ready times
    });
  };

  // Check if all players are ready
  useEffect(() => {
    const allReady = players.length > 0 && players.every(p => p.isReady);
    if (allReady && gameStatus === 'waiting') {
      setGameStatus('ready');
      if (isHost) {
        toast.success('All players are ready! You can start the game now.');
      } else {
        toast.success('All players are ready! Waiting for host to start...');
        // If current user is not host, simulate host starting the game
        setTimeout(() => {
          handleStartGame();
        }, 2000);
      }
    }
  }, [players, gameStatus]);

  // Handle switching teams
  const handleSwitchTeam = () => {
    if (gameStatus !== 'waiting' || currentUserReady) {
      toast.error('Cannot switch teams after readying up or when game has started');
      return;
    }

    setPlayers(prev => prev.map(p => 
      p.isCurrentUser ? { ...p, team: p.team === 1 ? 2 : 1 } : p
    ));
    toast.success(`Switched to Team ${players.find(p => p.isCurrentUser)?.team === 1 ? 2 : 1}`);
  };

  // Handle start game (host only)
  const handleStartGame = () => {
    setGameStatus('in-progress');
    toast.success('Game has started! Good luck!');

    // After 3 seconds, host submits score
    setTimeout(() => {
      setGameStatus('scoring');
      if (isHost) {
        setShowScoreDialog(true);
      } else {
        // Simulate host submitting score
        setTimeout(() => {
          const mockScore = {
            teamA: Math.floor(Math.random() * 20) + 10,
            teamB: Math.floor(Math.random() * 20) + 10,
          };
          setProposedScores(mockScore);
          setGameStatus('voting');
          toast.info('Host has submitted the final score. Please vote!');
        }, 2000);
      }
    }, 3000);
  };

  // Handle host submitting scores
  const handleSubmitScores = () => {
    const scoreA = parseInt(teamAScore);
    const scoreB = parseInt(teamBScore);

    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      toast.error('Please enter valid scores');
      return;
    }

    setProposedScores({ teamA: scoreA, teamB: scoreB });
    setShowScoreDialog(false);
    setGameStatus('voting');
    toast.success('Scores submitted! Waiting for players to vote...');

    // Simulate other players voting
    setTimeout(() => {
      simulatePlayerVotes();
    }, 2000);
  };

  // Simulate AI player votes
  const simulatePlayerVotes = () => {
    const otherPlayers = players.filter(p => !p.isCurrentUser);
    const mockVotes: Vote[] = otherPlayers.slice(0, Math.floor(otherPlayers.length * 0.6)).map((p, index) => ({
      playerId: p.id,
      playerName: p.name,
      agreed: Math.random() > 0.3, // 70% chance of agreeing
    }));
    
    setVotes(mockVotes);
  };

  // Handle player voting
  const handleVote = (agreed: boolean) => {
    setHasVoted(true);
    const newVote: Vote = {
      playerId: 'current-user',
      playerName: 'You',
      agreed: agreed,
    };
    const updatedVotes = [...votes, newVote];
    setVotes(updatedVotes);

    const totalPlayers = players.length;
    const requiredVotes = Math.ceil(totalPlayers / 2);
    
    // Check if all players have voted
    if (updatedVotes.length === totalPlayers) {
      const agreedVotes = updatedVotes.filter(v => v.agreed).length;
      const disagreedVotes = updatedVotes.filter(v => !v.agreed).length;

      if (agreedVotes >= requiredVotes) {
        // Majority agreed - settle score and proceed to player rating
        setTimeout(() => {
          setGameStatus('completed');
          toast.success('Score accepted by majority! Game completed!');
          // Auto-proceed to player rating after a short delay
          setTimeout(() => {
            setShowPlayerRating(true);
          }, 1500);
        }, 1000);
      } else {
        // Majority disagreed - allow counter proposal
        setTimeout(() => {
          toast.error('Score rejected by majority');
          setShowCounterProposal(true);
        }, 1000);
      }
    } else {
      // Still waiting for more votes
      toast.success('Vote recorded! Waiting for other players...');
    }
  };

  // Handle counter proposal submission
  const handleSubmitCounterProposal = () => {
    const scoreA = parseInt(counterTeamAScore);
    const scoreB = parseInt(counterTeamBScore);

    if (isNaN(scoreA) || isNaN(scoreB) || scoreA < 0 || scoreB < 0) {
      toast.error('Please enter valid scores');
      return;
    }

    setProposedScores({ teamA: scoreA, teamB: scoreB });
    setShowCounterProposal(false);
    setHasVoted(false);
    setVotes([]);
    toast.success('Counter proposal submitted! Other players will vote...');

    // Simulate other players agreeing with counter proposal
    setTimeout(() => {
      const otherPlayers = players.filter(p => !p.isCurrentUser);
      const mockVotes: Vote[] = otherPlayers.map(p => ({
        playerId: p.id,
        playerName: p.name,
        agreed: true, // Most agree with counter proposal
      }));
      
      // Add current user's vote
      mockVotes.push({
        playerId: 'current-user',
        playerName: 'You',
        agreed: true,
      });
      
      setVotes(mockVotes);
      setHasVoted(true);
      
      setTimeout(() => {
        setGameStatus('completed');
        toast.success('Counter proposal accepted! Game completed!');
        // Auto-proceed to player rating after counter proposal is accepted
        setTimeout(() => {
          setShowPlayerRating(true);
        }, 1500);
      }, 2000);
    }, 2000);
  };

  // Handle leave game
  const handleLeaveGame = () => {
    if (gameStatus === 'in-progress' || gameStatus === 'scoring' || gameStatus === 'voting') {
      toast.error('Cannot leave game while in progress!');
      return;
    }
    toast.success('Left the game');
    onBack();
  };

  // Auto-simulate the entire game flow
  const handleQuickSimulate = () => {
    if (isSimulating) return;
    
    setIsSimulating(true);
    toast.info('Starting quick simulation...');
    
    // Step 1: Mark current user as ready
    setCurrentUserReady(true);
    setPlayers(prev => prev.map(p => 
      p.isCurrentUser ? { ...p, isReady: true } : p
    ));
    
    // Step 2: Mark all other players as ready (staggered)
    setTimeout(() => {
      setPlayers(prev => prev.map(p => ({ ...p, isReady: true })));
      toast.success('All players ready!');
      setGameStatus('ready');
      
      // Step 3: Start the game
      setTimeout(() => {
        setGameStatus('in-progress');
        toast.success('Game started!');
        
        // Step 4: Simulate game finishing and score submission
        setTimeout(() => {
          setGameStatus('scoring');
          const mockScore = {
            teamA: Math.floor(Math.random() * 10) + 15,
            teamB: Math.floor(Math.random() * 10) + 10,
          };
          setProposedScores(mockScore);
          setGameStatus('voting');
          toast.info(`Host submitted score: ${mockScore.teamA} - ${mockScore.teamB}`);
          
          // Step 5: Simulate all players voting (all agree)
          setTimeout(() => {
            const allVotes: Vote[] = players.map(p => ({
              playerId: p.id,
              playerName: p.name,
              agreed: true,
            }));
            setVotes(allVotes);
            setHasVoted(true);
            
            // Step 6: Complete game and proceed to ratings
            setTimeout(() => {
              setGameStatus('completed');
              toast.success('Score accepted! Proceeding to player ratings...');
              
              setTimeout(() => {
                setShowPlayerRating(true);
                setIsSimulating(false);
              }, 1500);
            }, 1000);
          }, 1500);
        }, 2000);
      }, 1500);
    }, 1500);
  };

  const team1Players = players.filter(p => p.team === 1);
  const team2Players = players.filter(p => p.team === 2);
  const allReady = players.length > 0 && players.every(p => p.isReady);
  const canStartGame = isHost && allReady && gameStatus === 'ready';
  const canLeaveGame = gameStatus === 'waiting' || gameStatus === 'ready';

  const agreedVotes = votes.filter(v => v.agreed).length;
  const disagreedVotes = votes.filter(v => !v.agreed).length;
  const totalPlayers = players.length;
  const requiredVotes = Math.ceil(totalPlayers / 2);

  // Prepare participants for rating (exclude current user)
  const participantsForRating = players
    .filter(p => !p.isCurrentUser)
    .map(p => ({
      id: p.id,
      name: p.name,
      verified: p.verified,
    }));

  // If showing player rating screen, render that instead
  if (showPlayerRating) {
    return (
      <PostGameSummaryScreen
        gameTitle={gameData.title}
        participants={participantsForRating}
        onComplete={() => {
          toast.success('Player ratings submitted!');
          onBack();
        }}
        onBack={() => {
          setShowPlayerRating(false);
        }}
      />
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={handleLeaveGame}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <h1 className="text-white text-2xl">{gameData.title}</h1>
            <p className="text-white/80 text-sm">{gameData.sport}</p>
          </div>
          {isHost && (
            <Badge className="bg-yellow-500 text-white">
              Host
            </Badge>
          )}
        </div>

        {/* Game Status */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80 text-sm">Game Status</span>
            <Badge className={
              gameStatus === 'waiting' ? 'bg-yellow-500' :
              gameStatus === 'ready' ? 'bg-green-500' :
              gameStatus === 'in-progress' ? 'bg-blue-500' :
              gameStatus === 'scoring' || gameStatus === 'voting' ? 'bg-purple-500' :
              'bg-gray-500'
            }>
              {gameStatus === 'waiting' ? 'Waiting for Players' :
               gameStatus === 'ready' ? 'Ready to Start' :
               gameStatus === 'in-progress' ? 'In Progress' :
               gameStatus === 'scoring' ? 'Submitting Score' :
               gameStatus === 'voting' ? 'Voting on Score' :
               'Completed'}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-white/90 text-sm">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{gameData.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{gameData.time}</span>
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 mt-4">
        <div className="space-y-4 pb-6">
          {/* Ready Status Info */}
          {gameStatus === 'waiting' && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-blue-900 mb-1">
                    {allReady ? '✅ All players are ready!' : 'Waiting for all players to be ready'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {players.filter(p => p.isReady).length}/{players.length} players ready
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Above Teams */}
          {gameStatus !== 'completed' && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <div className="space-y-2">
                {gameStatus === 'waiting' && (
                  <>
                    {/* Quick Simulate Button */}
                    <Button
                      onClick={handleQuickSimulate}
                      disabled={isSimulating}
                      className="w-full h-12 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      {isSimulating ? '⚡ Simulating...' : '⚡ Quick Simulate Game'}
                    </Button>
                    <div className="text-center text-xs text-gray-500 py-1">
                      or manually play:
                    </div>
                    <Button
                      onClick={handleSwitchTeam}
                      variant="outline"
                      className="w-full h-12 rounded-xl border-gray-300"
                      disabled={currentUserReady || isSimulating}
                    >
                      Switch Team
                    </Button>
                    <Button
                      onClick={handleReadyClick}
                      disabled={isSimulating}
                      className={`w-full h-12 rounded-xl ${
                        currentUserReady
                          ? 'bg-yellow-500 hover:bg-yellow-600'
                          : 'bg-gradient-to-r from-blue-600 to-green-600'
                      }`}
                    >
                      {currentUserReady ? 'Not Ready' : 'Ready'}
                    </Button>
                  </>
                )}
                
                {canStartGame && (
                  <Button
                    onClick={handleStartGame}
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    Start Game
                  </Button>
                )}

                {!canStartGame && gameStatus === 'ready' && !isHost && (
                  <div className="bg-blue-50 rounded-xl p-3 text-center">
                    <p className="text-sm text-blue-900">
                      Waiting for host to start the game...
                    </p>
                  </div>
                )}

                {canLeaveGame && (
                  <Button
                    onClick={handleLeaveGame}
                    variant="outline"
                    className="w-full h-10 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Leave Game
                  </Button>
                )}

                {!canLeaveGame && gameStatus === 'in-progress' && (
                  <div className="bg-orange-50 rounded-xl p-3 text-center">
                    <p className="text-xs text-orange-900">
                      ⚠️ Cannot leave game while in progress
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Team 1 */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-600" />
                <h3 className="text-gray-900">Team 1</h3>
              </div>
              <Badge variant="outline">{team1Players.length} players</Badge>
            </div>
            <div className="space-y-2">
              {team1Players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    if (!player.isCurrentUser) {
                      setSelectedPlayer({
                        name: player.name,
                        username: player.name.toLowerCase().replace(' ', '_'),
                        userId: `SP2025-${Math.floor(Math.random() * 9000) + 1000}`,
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
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
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
                        <Shield className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  {player.isReady && (
                    <Badge className="bg-green-500 text-white text-xs">
                      Ready
                    </Badge>
                  )}
                  {player.isCurrentUser && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      You
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Team 2 */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-600" />
                <h3 className="text-gray-900">Team 2</h3>
              </div>
              <Badge variant="outline">{team2Players.length} players</Badge>
            </div>
            <div className="space-y-2">
              {team2Players.map((player) => (
                <button
                  key={player.id}
                  onClick={() => {
                    if (!player.isCurrentUser) {
                      setSelectedPlayer({
                        name: player.name,
                        username: player.name.toLowerCase().replace(' ', '_'),
                        userId: `SP2025-${Math.floor(Math.random() * 9000) + 1000}`,
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
                      ? 'bg-green-50 border border-green-200 cursor-default'
                      : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
                  }`}
                >
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-gradient-to-br from-green-500 to-green-600 text-white">
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
                        <Shield className="w-3 h-3 text-yellow-600 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  {player.isReady && (
                    <Badge className="bg-green-500 text-white text-xs">
                      Ready
                    </Badge>
                  )}
                  {player.isCurrentUser && (
                    <Badge className="bg-blue-600 text-white text-xs">
                      You
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Voting Section */}
          {gameStatus === 'voting' && proposedScores && (
            <div className="bg-white rounded-2xl shadow-lg p-4">
              <h3 className="text-gray-900 mb-3">Vote on Final Score</h3>
              
              {/* Proposed Score */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-4 text-center border-2 border-blue-200 mb-4">
                <p className="text-sm text-gray-600 mb-2">Proposed Score</p>
                <p className="text-3xl text-gray-900">
                  <span>{proposedScores.teamA}</span>
                  <span className="mx-2">-</span>
                  <span>{proposedScores.teamB}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">Team 1 vs Team 2</p>
              </div>

              {/* Voting Progress */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Voting Progress</span>
                  <Badge variant="outline">
                    {votes.length}/{totalPlayers} voted
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-green-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-green-600 mb-1">Agree</p>
                    <p className="text-xl text-green-700">
                      {agreedVotes}
                      <span className="text-sm">/{requiredVotes}</span>
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-red-600 mb-1">Disagree</p>
                    <p className="text-xl text-red-700">
                      {disagreedVotes}
                      <span className="text-sm">/{requiredVotes}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Vote Buttons */}
              {!hasVoted && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleVote(false)}
                    variant="outline"
                    className="h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Disagree
                  </Button>
                  <Button
                    onClick={() => handleVote(true)}
                    className="h-12 rounded-xl bg-gradient-to-r from-green-600 to-blue-600"
                  >
                    Agree
                  </Button>
                </div>
              )}

              {hasVoted && (
                <div className="bg-blue-50 rounded-xl p-4 text-center">
                  <CheckCircle2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm text-blue-900">Your vote has been recorded</p>
                </div>
              )}
            </div>
          )}

          {/* Completed Status */}
          {gameStatus === 'completed' && proposedScores && (
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 text-center border-2 border-green-200">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-xl text-gray-900 mb-2">Game Completed!</h3>
              <div className="bg-white/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">Final Score</p>
                <p className="text-3xl text-gray-900">
                  {proposedScores.teamA} - {proposedScores.teamB}
                </p>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={() => setShowPlayerRating(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-xl h-12"
                >
                  Rate Players
                </Button>
                <Button
                  onClick={onBack}
                  variant="outline"
                  className="w-full rounded-xl h-12"
                >
                  Skip & Go Home
                </Button>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Score Submission Dialog (Host Only) */}
      <Dialog open={showScoreDialog} onOpenChange={setShowScoreDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl" aria-describedby="score-submission-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Submit Final Score
            </DialogTitle>
            <DialogDescription id="score-submission-description">
              Enter the final score for both teams. Players will vote to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="team1-score">Team 1 Score</Label>
              <Input
                id="team1-score"
                type="number"
                min="0"
                value={teamAScore}
                onChange={(e) => setTeamAScore(e.target.value)}
                placeholder="Enter score"
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="team2-score">Team 2 Score</Label>
              <Input
                id="team2-score"
                type="number"
                min="0"
                value={teamBScore}
                onChange={(e) => setTeamBScore(e.target.value)}
                placeholder="Enter score"
                className="mt-1 rounded-xl"
              />
            </div>

            <Button
              onClick={handleSubmitScores}
              disabled={!teamAScore || !teamBScore}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-xl h-12"
            >
              Submit for Voting
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Counter Proposal Dialog */}
      <Dialog open={showCounterProposal} onOpenChange={setShowCounterProposal}>
        <DialogContent className="max-w-[90%] rounded-2xl" aria-describedby="counter-proposal-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Propose Counter Score
            </DialogTitle>
            <DialogDescription id="counter-proposal-description">
              The majority disagreed with the proposed score. Submit your own score for voting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="bg-orange-50 rounded-xl p-3 text-sm text-orange-900">
              Previous proposal: {proposedScores?.teamA} - {proposedScores?.teamB}
            </div>

            <div>
              <Label htmlFor="counter-team1-score">Team 1 Score</Label>
              <Input
                id="counter-team1-score"
                type="number"
                min="0"
                value={counterTeamAScore}
                onChange={(e) => setCounterTeamAScore(e.target.value)}
                placeholder="Enter score"
                className="mt-1 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="counter-team2-score">Team 2 Score</Label>
              <Input
                id="counter-team2-score"
                type="number"
                min="0"
                value={counterTeamBScore}
                onChange={(e) => setCounterTeamBScore(e.target.value)}
                placeholder="Enter score"
                className="mt-1 rounded-xl"
              />
            </div>

            <Button
              onClick={handleSubmitCounterProposal}
              disabled={!counterTeamAScore || !counterTeamBScore}
              className="w-full bg-gradient-to-r from-blue-600 to-green-600 rounded-xl h-12"
            >
              Submit Counter Proposal
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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