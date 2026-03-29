import { useState } from 'react';
import { ArrowLeft, Trophy, MapPin, Calendar, Users, Accessibility, Target } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { toast } from 'sonner';
import { mockTournaments, mockTeams, mockUsers } from '../data/mockData';

interface TournamentDetailScreenProps {
  tournamentId: string;
  onBack?: () => void;
  currentUserId?: string;
}

export function TournamentDetailScreen({
  tournamentId,
  onBack,
  currentUserId,
}: TournamentDetailScreenProps) {
  const tournament = mockTournaments.find(t => t.id === tournamentId);
  const [showTeamPicker, setShowTeamPicker] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);

  if (!tournament) {
    return (
      <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Tournament not found</p>
      </div>
    );
  }

  // Get org name
  const orgName = mockUsers.find(u => u.id === tournament.orgId)?.name || 'Unknown Org';

  // Get current user's teams
  const currentUserTeams = currentUserId
    ? mockTeams.filter(t => t.members.some(m => m.userId === currentUserId))
    : [];

  // Get already registered teams for this user
  const userRegisteredTeams = tournament.participants
    .filter(p => p.type === 'team')
    .map(p => p.id)
    .filter(teamId =>
      currentUserTeams.some(t => t.id === teamId)
    );

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

  // Get participant details
  const getParticipantName = (participant: any) => {
    if (participant.type === 'team') {
      return mockTeams.find(t => t.id === participant.id)?.name || 'Unknown Team';
    } else {
      return mockUsers.find(u => u.id === participant.id)?.name || 'Unknown Player';
    }
  };

  const handleRegisterTeam = (teamId: string) => {
    setSelectedTeam(teamId);
    // In production, this would add the team to tournament.participants
    toast.success(`${mockTeams.find(t => t.id === teamId)?.name} registered for tournament!`);
    setIsRegistered(true);
    setShowTeamPicker(false);
  };

  const handleRegisterSolo = () => {
    // In production, this would add currentUserId to tournament.participants as solo
    toast.success('You registered for the tournament!');
    setIsRegistered(true);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-500 px-6 pt-8 pb-8 rounded-b-3xl shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-white text-xl font-bold">{tournament.name}</h1>
            <p className="text-white/80 text-xs">By {orgName}</p>
          </div>
        </div>
        <Badge className={`${getSportColor(tournament.sport)}`}>
          {tournament.sport}
        </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4 pb-24">
          {/* Tournament Info */}
          <div className="bg-white rounded-xl p-4 shadow-lg shadow-gray-200/50 space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-xs text-gray-600">Date</p>
                <p className="text-gray-900 font-semibold">
                  {new Date(tournament.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-xs text-gray-600">Venue</p>
                <p className="text-gray-900 font-semibold">{tournament.venue}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-xs text-gray-600">Format</p>
                <p className="text-gray-900 font-semibold">
                  {tournament.bracketType === 'single-elimination' ? 'Single Elimination' : tournament.bracketType === 'round-robin' ? 'Round Robin' : 'Double Elimination'}
                </p>
              </div>
            </div>
          </div>

          {/* PWD Division */}
          {tournament.hasPWDDivision && (
            <div className="bg-purple-50 border-2 border-purple-200 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Accessibility className="w-5 h-5 text-purple-700 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-purple-900">PWD Division Available</p>
                  <p className="text-sm text-purple-800 mt-1">A separate bracket is available for PWD athletes</p>
                </div>
              </div>
            </div>
          )}

          {/* Participants */}
          <div className="bg-white rounded-xl p-4 shadow-lg shadow-gray-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900 font-semibold">Registered</h3>
              </div>
              <Badge variant="secondary">{tournament.participants.length}/{tournament.maxParticipants}</Badge>
            </div>

            <div className="space-y-2">
              {tournament.participants.map((participant, idx) => (
                <div key={`${participant.type}-${participant.id}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-900 font-medium text-sm">{getParticipantName(participant)}</p>
                    <p className="text-xs text-gray-600">{participant.type === 'team' ? 'Team' : 'Solo'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prize Section */}
          <div className="bg-white rounded-xl p-4 shadow-lg shadow-gray-200/50">
            <div className="flex items-start gap-3">
              <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-gray-900 font-semibold">Prize</h3>
                <p className="text-gray-700 text-sm mt-1">{tournament.prizeDescription}</p>
              </div>
            </div>
          </div>

          {/* Bracket Preview */}
          <div className="bg-white rounded-xl p-4 shadow-lg shadow-gray-200/50">
            <h3 className="text-gray-900 font-semibold mb-3">Bracket Preview</h3>
            
            {tournament.bracketType === 'round-robin' ? (
              <div className="bg-gray-50 rounded-lg p-3 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 px-2 text-gray-600">Team</th>
                      <th className="text-center py-2 px-2 text-gray-600">W</th>
                      <th className="text-center py-2 px-2 text-gray-600">L</th>
                      <th className="text-center py-2 px-2 text-gray-600">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...Array(4)].map((_, i) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-2 px-2 text-gray-500">Team {i + 1}</td>
                        <td className="text-center py-2 px-2 text-gray-500">-</td>
                        <td className="text-center py-2 px-2 text-gray-500">-</td>
                        <td className="text-center py-2 px-2 text-gray-500">-</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <div className="text-center py-2 text-gray-400 text-xs">
                      {i < 2 ? 'Round 1' : 'Final'}
                    </div>
                    <div className="space-y-1">
                      <div className="bg-white p-2 rounded text-gray-500 text-xs text-center">TBD</div>
                      <div className="text-center text-gray-400 text-xs">vs</div>
                      <div className="bg-white p-2 rounded text-gray-500 text-xs text-center">TBD</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Registration Button */}
          {!isRegistered && (
            <div className="space-y-2">
              {currentUserTeams.length > 0 && (
                <button
                  onClick={() => setShowTeamPicker(true)}
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Register Team
                </button>
              )}
              {tournament.sport === 'Badminton' && (
                <button
                  onClick={handleRegisterSolo}
                  className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Register Solo
                </button>
              )}
            </div>
          )}

          {isRegistered && (
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
              <p className="text-green-800 font-semibold">✓ You're registered for this tournament!</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Team Picker Modal */}
      <Dialog open={showTeamPicker} onOpenChange={setShowTeamPicker}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Register Team</DialogTitle>
            <DialogDescription>
              Select a team to register for {tournament.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentUserTeams.map(team => {
              const alreadyRegistered = userRegisteredTeams.includes(team.id);
              return (
                <button
                  key={team.id}
                  onClick={() => !alreadyRegistered && handleRegisterTeam(team.id)}
                  disabled={alreadyRegistered}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    alreadyRegistered
                      ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                      : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <p className="text-gray-900 font-semibold">{team.name}</p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {team.sport} • {team.record.wins}W-{team.record.losses}L-{team.record.draws}D
                  </p>
                  {alreadyRegistered && (
                    <p className="text-xs text-green-600 mt-1">✓ Already registered</p>
                  )}
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
