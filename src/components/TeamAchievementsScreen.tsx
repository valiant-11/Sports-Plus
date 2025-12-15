import { ArrowLeft, Trophy, Star } from 'lucide-react';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface TeamAchievementsScreenProps {
  onBack: () => void;
  teamName: string;
}

const mockTeamAchievements = [
  { 
    id: 1, 
    name: 'Team Founded', 
    icon: '🎉', 
    earned: true, 
    description: 'Create your team',
    points: 100,
    progress: 100
  },
  { 
    id: 2, 
    name: '10 Games Won', 
    icon: '🏆', 
    earned: true, 
    description: 'Win 10 team games',
    points: 250,
    progress: 100
  },
  { 
    id: 3, 
    name: '50 Members', 
    icon: '👥', 
    earned: false, 
    description: 'Reach 50 team members',
    points: 500,
    progress: 24
  },
  { 
    id: 4, 
    name: 'Legendary Team', 
    icon: '⭐', 
    earned: false, 
    description: 'Win 100 team games',
    points: 1000,
    progress: 10
  },
  { 
    id: 5, 
    name: 'Community Leaders', 
    icon: '🌟', 
    earned: false, 
    description: 'Host 25 community events',
    points: 750,
    progress: 32
  },
  { 
    id: 6, 
    name: 'Top Ranked', 
    icon: '💎', 
    earned: false, 
    description: 'Reach top 3 in rankings',
    points: 2000,
    progress: 60
  },
];

export function TeamAchievementsScreen({ onBack, teamName }: TeamAchievementsScreenProps) {
  const earnedCount = mockTeamAchievements.filter(a => a.earned).length;
  const totalPoints = mockTeamAchievements.filter(a => a.earned).reduce((sum, a) => sum + a.points, 0);

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="text-white text-2xl">Team Achievements</h1>
            <p className="text-white/80 text-sm mt-0.5">{teamName}</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 text-sm">Achievements Earned</p>
              <p className="text-white text-2xl">{earnedCount}/{mockTeamAchievements.length}</p>
            </div>
            <div className="text-right">
              <p className="text-white/80 text-sm">Total Points</p>
              <p className="text-white text-2xl">{totalPoints}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 space-y-3 pb-4">
        {mockTeamAchievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 border-2 ${
              achievement.earned
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`text-3xl ${!achievement.earned && 'opacity-40'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="text-gray-900">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mt-0.5">{achievement.description}</p>
                  </div>
                  <Badge className={`${
                    achievement.earned
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {achievement.points} pts
                  </Badge>
                </div>
              </div>
            </div>
            {!achievement.earned && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} className="h-2" />
              </div>
            )}
            {achievement.earned && (
              <div className="flex items-center gap-2 text-sm text-blue-600">
                <Star className="w-4 h-4 fill-blue-600" />
                <span>Earned!</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
