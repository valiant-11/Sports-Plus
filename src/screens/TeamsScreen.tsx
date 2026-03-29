import { useState } from 'react';
import { Trophy, Plus, Users, ArrowRight } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { mockTeams, mockUsers } from '../data/mockData';

interface TeamsScreenProps {
  onBack?: () => void;
  onViewTeam?: (teamId: string) => void;
}

export function TeamsScreen({ onBack, onViewTeam }: TeamsScreenProps) {
  const [selectedSport, setSelectedSport] = useState<string>('All');

  // Get sorted teams for leaderboard
  const topTeams = [...mockTeams].sort((a, b) => b.totalPoints - a.totalPoints);

  // Filter teams by sport
  const filteredTeams = selectedSport === 'All' 
    ? [...mockTeams].sort((a, b) => b.totalPoints - a.totalPoints)
    : [...mockTeams].filter(t => t.sport === selectedSport).sort((a, b) => b.totalPoints - a.totalPoints);

  // Get unique sports
  const sports = ['All', ...new Set(mockTeams.map(t => t.sport))];

  // Get captain name from userId
  const getCaptainName = (captainId: string) => {
    return mockUsers.find(u => u.id === captainId)?.name || 'Unknown';
  };

  // Get sport badge color
  const getSportColor = (sport: string) => {
    switch (sport) {
      case 'Basketball':
        return 'bg-blue-100 text-blue-700';
      case 'Badminton':
        return 'bg-teal-100 text-teal-700';
      case 'Football':
        return 'bg-green-100 text-green-700';
      case 'Volleyball':
        return 'bg-pink-100 text-pink-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-green-500 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ←
            </button>
          )}
          <h1 className="text-white text-xl font-bold flex-1 text-center">Teams</h1>
          <button className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6 pb-24">
          {/* Top Teams Leaderboard */}
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h2 className="text-gray-900 font-bold">Top Teams</h2>
            </div>

            <div className="space-y-2">
              {topTeams.map((team, index) => {
                const captainName = getCaptainName(team.captainId);
                return (
                  <div key={team.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    {/* Rank */}
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                      style={{
                        backgroundColor: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E5E7EB',
                        color: index < 3 ? 'white' : '#6B7280'
                      }}
                    >
                      {index + 1}
                    </div>

                    {/* Team Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-900 font-medium text-sm">{team.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`text-xs ${getSportColor(team.sport)}`}>
                          {team.sport}
                        </Badge>
                        <span className="text-xs text-gray-600">
                          {team.record.wins}W · {team.record.losses}L · {team.record.draws}D
                        </span>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-blue-600">{team.totalPoints}</div>
                      <span className="text-xs text-gray-500">Points</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sport Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sports.map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedSport === sport
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Team Cards */}
          <div className="space-y-3">
            {filteredTeams.map(team => {
              const captainName = getCaptainName(team.captainId);
              return (
                <div key={team.id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 hover:shadow-xl transition-shadow"
                  onClick={() => onViewTeam?.(team.id)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-lg">{team.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">Captain: {captainName}</p>
                    </div>
                    <Badge className={`${getSportColor(team.sport)} text-xs`}>
                      {team.sport}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4 py-3 border-y border-gray-100">
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{team.members.length}</p>
                      <p className="text-xs text-gray-600">Members</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-gray-900">{team.record.wins}-{team.record.losses}-{team.record.draws}</p>
                      <p className="text-xs text-gray-600">Record</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-blue-600">{team.totalPoints}</p>
                      <p className="text-xs text-gray-600">Points</p>
                    </div>
                  </div>

                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTeam?.(team.id);
                    }}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    View Team
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
