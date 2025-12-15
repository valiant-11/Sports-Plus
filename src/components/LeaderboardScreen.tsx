import { useState } from 'react';
import { Trophy, Star, Target, MapPin, Crown, Medal, TrendingUp, Award, ChevronDown } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar } from './ui/avatar';
import { ScrollArea } from './ui/scroll-area';
import { Button } from './ui/button';

interface LeaderboardScreenProps {
  onBack?: () => void;
}

interface PlayerRating {
  gameId: string;
  opponent: string;
  rating: number;
  skillLevel: 'Casual' | 'Novice' | 'Elite';
  date: string;
}

interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  gamesPlayed: number;
  rating: number;
  barangay: string;
  isVerified: boolean;
  rank: number;
  change: number; // ranking change
  skillLevel?: 'Casual' | 'Novice' | 'Elite';
  ratings?: PlayerRating[];
}

interface BarangayRanking {
  barangay: string;
  totalPoints: number;
  players: number;
  rank: number;
}

const skillLevels: ('Casual' | 'Novice' | 'Elite')[] = ['Casual', 'Novice', 'Elite'];

export function LeaderboardScreen({ onBack }: LeaderboardScreenProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'all-time'>('monthly');
  const [expandedPlayerId, setExpandedPlayerId] = useState<string | null>(null);

  // Mock ratings data
  const mockRatings: { [key: string]: PlayerRating[] } = {
    '1': [
      { gameId: 'g1', opponent: 'Maria Santos', rating: 5, skillLevel: 'Elite', date: 'Dec 15' },
      { gameId: 'g2', opponent: 'Juan dela Cruz', rating: 4.8, skillLevel: 'Novice', date: 'Dec 14' },
      { gameId: 'g3', opponent: 'Ana Lopez', rating: 4.9, skillLevel: 'Elite', date: 'Dec 13' },
      { gameId: 'g4', opponent: 'Pedro Martinez', rating: 4.7, skillLevel: 'Casual', date: 'Dec 12' },
      { gameId: 'g5', opponent: 'Sofia Reyes', rating: 5, skillLevel: 'Elite', date: 'Dec 11' },
    ],
    '2': [
      { gameId: 'g6', opponent: 'Carlos Reyes', rating: 4.9, skillLevel: 'Elite', date: 'Dec 15' },
      { gameId: 'g7', opponent: 'Juan dela Cruz', rating: 4.7, skillLevel: 'Novice', date: 'Dec 14' },
      { gameId: 'g8', opponent: 'Ana Lopez', rating: 4.8, skillLevel: 'Elite', date: 'Dec 13' },
      { gameId: 'g9', opponent: 'Pedro Martinez', rating: 4.8, skillLevel: 'Casual', date: 'Dec 12' },
    ],
  };

  // Mock data
  const topRatedPlayers: Player[] = [
    { id: '1', name: 'Carlos Reyes', avatar: '', score: 4.9, gamesPlayed: 32, rating: 4.9, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, change: 0, skillLevel: 'Elite', ratings: mockRatings['1'] },
    { id: '2', name: 'Maria Santos', avatar: '', score: 4.8, gamesPlayed: 28, rating: 4.8, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, change: 1, skillLevel: 'Elite', ratings: mockRatings['2'] },
    { id: '3', name: 'Juan dela Cruz', avatar: '', score: 4.7, gamesPlayed: 25, rating: 4.7, barangay: 'Brgy. Mandaragat', isVerified: true, rank: 3, change: -1, skillLevel: 'Novice' },
    { id: '4', name: 'Ana Lopez', avatar: '', score: 4.6, gamesPlayed: 22, rating: 4.6, barangay: 'Brgy. Bagong Sikat', isVerified: true, rank: 4, change: 2, skillLevel: 'Elite' },
    { id: '5', name: 'Pedro Martinez', avatar: '', score: 4.5, gamesPlayed: 20, rating: 4.5, barangay: 'Brgy. San Jose', isVerified: true, rank: 5, change: 0, skillLevel: 'Casual' },
  ];

  const mostVerifiedPlayers: Player[] = [
    { id: '1', name: 'Carlos Reyes', avatar: '', score: 32, gamesPlayed: 32, rating: 4.9, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, change: 0, skillLevel: 'Elite' },
    { id: '2', name: 'Maria Santos', avatar: '', score: 28, gamesPlayed: 28, rating: 4.8, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, change: 0, skillLevel: 'Elite' },
    { id: '3', name: 'Juan dela Cruz', avatar: '', score: 25, gamesPlayed: 25, rating: 4.7, barangay: 'Brgy. Mandaragat', isVerified: true, rank: 3, change: 1, skillLevel: 'Novice' },
    { id: '4', name: 'Ana Lopez', avatar: '', score: 22, gamesPlayed: 22, rating: 4.6, barangay: 'Brgy. Bagong Sikat', isVerified: true, rank: 4, change: -1, skillLevel: 'Elite' },
    { id: '5', name: 'Pedro Martinez', avatar: '', score: 20, gamesPlayed: 20, rating: 4.5, barangay: 'Brgy. San Jose', isVerified: true, rank: 5, change: 0, skillLevel: 'Casual' },
  ];

  const mvpRankings: Player[] = [
    { id: '1', name: 'Carlos Reyes', avatar: '', score: 4.9, gamesPlayed: 32, rating: 4.9, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, change: 0, skillLevel: 'Elite' },
    { id: '2', name: 'Maria Santos', avatar: '', score: 4.8, gamesPlayed: 28, rating: 4.8, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, change: 1, skillLevel: 'Elite' },
    { id: '3', name: 'Juan dela Cruz', avatar: '', score: 4.7, gamesPlayed: 25, rating: 4.7, barangay: 'Brgy. Mandaragat', isVerified: true, rank: 3, change: 0, skillLevel: 'Novice' },
  ];

  const barangayRankings: BarangayRanking[] = [
    { barangay: 'Brgy. San Pedro', totalPoints: 15420, players: 48, rank: 1 },
    { barangay: 'Brgy. Bancao-Bancao', totalPoints: 14250, players: 42, rank: 2 },
    { barangay: 'Brgy. Mandaragat', totalPoints: 13890, players: 39, rank: 3 },
    { barangay: 'Brgy. Bagong Sikat', totalPoints: 12340, players: 35, rank: 4 },
    { barangay: 'Brgy. San Jose', totalPoints: 11580, players: 31, rank: 5 },
  ];

  const hallOfFame: Player[] = [
    { id: '1', name: 'Carlos Reyes', avatar: '', score: 4.9, gamesPlayed: 150, rating: 4.9, barangay: 'Brgy. San Pedro', isVerified: true, rank: 1, change: 0, skillLevel: 'Elite' },
    { id: '2', name: 'Maria Santos', avatar: '', score: 4.8, gamesPlayed: 142, rating: 4.8, barangay: 'Brgy. Bancao-Bancao', isVerified: true, rank: 2, change: 0, skillLevel: 'Elite' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="size-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="size-6 text-gray-400" />;
    if (rank === 3) return <Award className="size-6 text-orange-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-orange-400 to-orange-600';
    return 'bg-gray-200';
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

  const isExpanded = expandedPlayerId !== null;
  const expandedPlayer = isExpanded ? topRatedPlayers.find(p => p.id === expandedPlayerId) : null;

  const PlayerCard = ({ player, scoreLabel }: { player: Player; scoreLabel: string }) => {
    const isExpanded = expandedPlayerId === player.id;
    const hasRatings = player.ratings && player.ratings.length > 0;
    const visibleRatings = isExpanded ? player.ratings : player.ratings?.slice(0, 2);

    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="relative">
            <div className={`absolute -top-2 -left-2 size-8 rounded-full ${getRankBadge(player.rank)} flex items-center justify-center shadow-lg z-10`}>
              {player.rank <= 3 ? (
                getRankIcon(player.rank)
              ) : (
                <span className="text-white">#{player.rank}</span>
              )}
            </div>
            <Avatar className="size-16 border-2 border-white shadow">
              <div className="size-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                <span className="text-white">{player.name.charAt(0)}</span>
              </div>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-900">{player.name}</span>
              {player.isVerified && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-700 h-5 px-1.5">
                  <svg className="size-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </Badge>
              )}
              {player.change !== 0 && (
                <span className={`flex items-center gap-0.5 ${player.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`size-3 ${player.change < 0 ? 'rotate-180' : ''}`} />
                  <span className="text-xs">{Math.abs(player.change)}</span>
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={`${getSkillBadgeColor(player.skillLevel)} text-xs font-semibold`}>
                {player.skillLevel}
              </Badge>
              <span className="text-xs text-gray-500">{player.barangay}</span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-500">{player.gamesPlayed} games</span>
            </div>
          </div>

          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-600">
              <Star className="size-4 fill-current" />
              <span className="font-semibold">{player.score.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-500">{scoreLabel}</span>
          </div>
        </div>

        {/* Expanded Ratings Section */}
        {hasRatings && (
          <>
            {isExpanded && (
              <div className="border-t border-gray-100 p-4 bg-gray-50 space-y-2">
                <p className="text-xs font-semibold text-gray-600 mb-3">Recent Ratings ({player.ratings!.length} total)</p>
                {visibleRatings?.map((rating, index) => (
                  <div key={rating.gameId} className="bg-white rounded-lg p-3 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 font-medium">{rating.opponent}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{rating.date}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={`${getSkillBadgeColor(rating.skillLevel)} text-xs font-semibold`}>
                        {rating.skillLevel}
                      </Badge>
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="size-3.5 fill-current" />
                        <span className="font-semibold text-sm">{rating.rating}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Show More Button */}
            {hasRatings && (
              <div className="border-t border-gray-100 px-4 py-2 bg-gray-50">
                <Button
                  onClick={() => setExpandedPlayerId(isExpanded ? null : player.id)}
                  variant="ghost"
                  className="w-full h-auto py-2 px-0 text-blue-600 hover:text-blue-700 hover:bg-transparent flex items-center justify-center gap-1"
                >
                  <ChevronDown className={`size-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  {isExpanded ? 'Show Less' : `Show More (${Math.max(0, player.ratings!.length - 2)} more)`}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const BarangayCard = ({ barangay }: { barangay: BarangayRanking }) => (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`size-12 rounded-full ${getRankBadge(barangay.rank)} flex items-center justify-center shadow`}>
        {barangay.rank <= 3 ? (
          getRankIcon(barangay.rank)
        ) : (
          <span className="text-white">#{barangay.rank}</span>
        )}
      </div>

      <div className="flex-1">
        <span className="font-medium text-gray-900">{barangay.barangay}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{barangay.players} players</span>
        </div>
      </div>

      <div className="text-right">
        <div className="flex items-center gap-1 text-blue-600">
          <Trophy className="size-4" />
          <span className="font-semibold">{barangay.totalPoints.toLocaleString()}</span>
        </div>
        <span className="text-xs text-gray-500">Total Points</span>
      </div>
    </div>
  );

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gradient-to-br from-blue-50 via-white to-green-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 px-6 pt-12 pb-6 shadow-lg">
        <div className="flex items-center justify-center mb-4">
          <Trophy className="size-8 text-yellow-300 mr-2" />
          <h1 className="text-white text-center">Leaderboards</h1>
        </div>
        
        {/* Period Toggle */}
        <div className="flex gap-2 bg-white/20 backdrop-blur-sm rounded-full p-1">
          <button
            onClick={() => setSelectedPeriod('monthly')}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              selectedPeriod === 'monthly'
                ? 'bg-white text-blue-600 shadow'
                : 'text-white'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setSelectedPeriod('all-time')}
            className={`flex-1 py-2 px-4 rounded-full transition-all ${
              selectedPeriod === 'all-time'
                ? 'bg-white text-blue-600 shadow'
                : 'text-white'
            }`}
          >
            All-Time
          </button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="top-rated" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start gap-2 bg-transparent p-4 pb-0 overflow-x-auto">
          <TabsTrigger value="top-rated" className="data-[state=active]:bg-white data-[state=active]:shadow whitespace-nowrap">
            <Star className="size-4 mr-1.5" />
            Top Rated
          </TabsTrigger>
          <TabsTrigger value="most-games" className="data-[state=active]:bg-white data-[state=active]:shadow whitespace-nowrap">
            <Target className="size-4 mr-1.5" />
            Most Games
          </TabsTrigger>
          <TabsTrigger value="mvp" className="data-[state=active]:bg-white data-[state=active]:shadow whitespace-nowrap">
            <Crown className="size-4 mr-1.5" />
            MVP
          </TabsTrigger>
          <TabsTrigger value="barangay" className="data-[state=active]:bg-white data-[state=active]:shadow whitespace-nowrap">
            <MapPin className="size-4 mr-1.5" />
            Barangay
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3 pb-24">
            <TabsContent value="top-rated" className="mt-0 space-y-3">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
                <p className="text-sm text-blue-800">
                  <Trophy className="size-4 inline mr-1" />
                  Players ranked by average star rating (minimum 5 verified games)
                </p>
              </div>
              {topRatedPlayers.map(player => (
                <PlayerCard key={player.id} player={player} scoreLabel="Avg Rating" />
              ))}
            </TabsContent>

            <TabsContent value="most-games" className="mt-0 space-y-3">
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                <p className="text-sm text-green-800">
                  <Target className="size-4 inline mr-1" />
                  Players with the most verified matches
                </p>
              </div>
              {mostVerifiedPlayers.map(player => (
                <PlayerCard key={player.id} player={player} scoreLabel="Games Played" />
              ))}
            </TabsContent>

            <TabsContent value="mvp" className="mt-0 space-y-3">
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                <p className="text-sm text-yellow-800">
                  <Crown className="size-4 inline mr-1" />
                  Top performers with highest average ratings
                </p>
              </div>
              {mvpRankings.map(player => (
                <PlayerCard key={player.id} player={player} scoreLabel="MVP Score" />
              ))}
            </TabsContent>

            <TabsContent value="barangay" className="mt-0 space-y-3">
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-4">
                <p className="text-sm text-purple-800">
                  <MapPin className="size-4 inline mr-1" />
                  Barangays ranked by total player points
                </p>
              </div>
              {barangayRankings.map(barangay => (
                <BarangayCard key={barangay.barangay} barangay={barangay} />
              ))}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>

      {/* Hall of Fame Section */}
      {selectedPeriod === 'all-time' && (
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-4 border-t-4 border-yellow-600">
          <div className="flex items-center justify-center mb-2">
            <Crown className="size-5 text-white mr-2" />
            <h3 className="text-white">Hall of Fame</h3>
          </div>
          <p className="text-xs text-white/80 text-center">
            Legendary players who dominated past seasons
          </p>
        </div>
      )}
    </div>
  );
}