import { useState } from 'react';
import { Trophy, MapPin, Calendar, Users, ArrowRight, Target } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { mockTournaments, mockTeams, mockUsers } from '../data/mockData';

interface TournamentScreenProps {
  onBack?: () => void;
  onViewTournament?: (tournamentId: string) => void;
}

export function TournamentScreen({ onBack, onViewTournament }: TournamentScreenProps) {
  const [selectedSport, setSelectedSport] = useState<string>('All');

  // Filter tournaments by sport
  const filteredTournaments = selectedSport === 'All'
    ? [...mockTournaments].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [...mockTournaments]
        .filter(t => t.sport === selectedSport)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Get unique sports
  const sports = ['All', ...new Set(mockTournaments.map(t => t.sport))];

  // Get org name
  const getOrgName = (orgId: string) => {
    return mockUsers.find(u => u.id === orgId)?.name || 'Unknown Org';
  };

  // Get sport color
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
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 pt-8 pb-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              ←
            </button>
          )}
          <h1 className="text-white text-xl font-bold flex-1 text-center">Tournaments</h1>
          <div className="w-10" />
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          {/* Sport Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {sports.map(sport => (
              <button
                key={sport}
                onClick={() => setSelectedSport(sport)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedSport === sport
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 border border-gray-200'
                }`}
              >
                {sport}
              </button>
            ))}
          </div>

          {/* Tournament Cards */}
          <div className="space-y-3">
            {filteredTournaments.map(tournament => {
              const orgName = getOrgName(tournament.orgId);
              const participantCount = tournament.participants.length;

              return (
                <div
                  key={tournament.id}
                  className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => onViewTournament?.(tournament.id)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <Badge className="bg-purple-100 text-purple-700 text-xs mb-2">{orgName}</Badge>
                      <h3 className="text-gray-900 font-bold text-sm">{tournament.name}</h3>
                    </div>
                  </div>

                  {/* Tournament Info */}
                  <div className="space-y-2 mb-3 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4" />
                      <span>{tournament.sport}</span>
                      <Badge className={`${getSportColor(tournament.sport)} text-xs ml-2`}>
                        {tournament.sport}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(tournament.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{tournament.venue}</span>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center justify-between mb-3 py-2 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">{participantCount}/{tournament.maxParticipants} Teams</span>
                    </div>
                    <span className="text-xs text-gray-600">{tournament.bracketType === 'single-elimination' ? 'Single Elim' : 'Round Robin'}</span>
                  </div>

                  {/* Prize & PWD Division */}
                  <div className="space-y-2 mb-4">
                    <p className="text-xs text-gray-700">🏆 {tournament.prizeDescription}</p>
                    {tournament.hasPWDDivision && (
                      <Badge className="bg-purple-100 text-purple-700 text-xs">
                        ♿ PWD Division
                      </Badge>
                    )}
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewTournament?.(tournament.id);
                    }}
                    className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    Register
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No tournaments available</p>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
