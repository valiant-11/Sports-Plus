import { ArrowLeft, UserPlus, CheckCircle2, Crown } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface TeamMembersScreenProps {
  onBack: () => void;
  teamName: string;
  isAdmin: boolean;
}

const mockTeamMembers = [
  { id: '1', name: 'John Doe', role: 'Admin', verified: true, gamesPlayed: 45, rating: 4.8 },
  { id: '2', name: 'Alex Chen', role: 'Member', verified: true, gamesPlayed: 32, rating: 4.7 },
  { id: '3', name: 'Sarah Miller', role: 'Member', verified: true, gamesPlayed: 28, rating: 4.9 },
  { id: '4', name: 'Mike Johnson', role: 'Member', verified: false, gamesPlayed: 12, rating: 4.2 },
  { id: '5', name: 'Emma Davis', role: 'Member', verified: true, gamesPlayed: 38, rating: 4.6 },
];

export function TeamMembersScreen({ onBack, teamName, isAdmin }: TeamMembersScreenProps) {
  const handleInviteMember = () => {
    toast.success('Invite link copied to clipboard!');
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-24 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6">
        <div className="flex items-center gap-4 mb-2">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Team Members</h1>
            <p className="text-white/80 text-sm mt-0.5">{teamName}</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4 pb-24">
        {isAdmin && (
          <Button 
            onClick={handleInviteMember}
            className="w-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 rounded-2xl shadow-xl shadow-blue-500/30 h-12"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            Invite Member
          </Button>
        )}

        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5">
          <h3 className="text-gray-900 mb-4">
            Members ({mockTeamMembers.length})
          </h3>
          <div className="space-y-3">
            {mockTeamMembers.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-700 text-white">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-gray-900">{member.name}</p>
                    {member.verified && (
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    )}
                    {member.role === 'Admin' && (
                      <Crown className="w-4 h-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-gray-600">{member.gamesPlayed} games</span>
                    <span className="text-xs text-gray-600">⭐ {member.rating}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
