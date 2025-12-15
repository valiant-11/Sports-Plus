import { Trophy, Award, Star, Users, Calendar, Target, ArrowLeft } from 'lucide-react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';

const achievements = [
  {
    id: 1,
    title: 'First Game',
    description: 'Complete your first game',
    icon: '🏆',
    points: 50,
    earned: true,
    progress: 100,
  },
  {
    id: 2,
    title: '10 Games Milestone',
    description: 'Play 10 games',
    icon: '⭐',
    points: 100,
    earned: true,
    progress: 100,
  },
  {
    id: 3,
    title: 'Team Player',
    description: 'Join your first team',
    icon: '🤝',
    points: 75,
    earned: true,
    progress: 100,
  },
  {
    id: 4,
    title: '50 Games Champion',
    description: 'Play 50 games',
    icon: '🔥',
    points: 250,
    earned: false,
    progress: 48,
  },
  {
    id: 5,
    title: 'Elite Player',
    description: 'Reach Elite skill level',
    icon: '👑',
    points: 500,
    earned: false,
    progress: 65,
  },
  {
    id: 6,
    title: 'Legend Status',
    description: 'Play 100 games',
    icon: '💎',
    points: 1000,
    earned: false,
    progress: 24,
  },
];

const pointsSources = [
  { activity: 'Game Completed', points: '+50', icon: '⚽' },
  { activity: 'Showed Up', points: '+25', icon: '✓' },
  { activity: 'Friend Invited', points: '+100', icon: '👥' },
  { activity: 'Team Created', points: '-500', icon: '🏆', isExpense: true },
];

interface PointsBadgesScreenProps {
  onBack?: () => void;
}

export function PointsBadgesScreen({ onBack }: PointsBadgesScreenProps) {
  const totalPoints = 1250;
  const earnedBadges = achievements.filter(a => a.earned).length;
  const totalBadges = achievements.length;

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-16 px-6 rounded-b-[3rem]">
        <div className="flex items-center gap-4 mb-6">
          {onBack && (
            <button 
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <h1 className="text-white text-2xl">Achievements</h1>
        </div>
        
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 text-sm">Total Points</p>
              <p className="text-white text-4xl">{totalPoints}</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-white/90 text-sm">
            <Award className="w-4 h-4" />
            <span>{earnedBadges}/{totalBadges} Badges Earned</span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-8 space-y-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-5">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Achievements
          </h3>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 ${
                  achievement.earned
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`text-3xl ${!achievement.earned && 'opacity-40'}`}>
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">{achievement.description}</p>
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

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5">
          <h3 className="text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            How to Earn Points
          </h3>
          <div className="space-y-2">
            {pointsSources.map((source, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl">
                    {source.icon}
                  </div>
                  <span className="text-sm text-gray-900">{source.activity}</span>
                </div>
                <span className={`${
                  source.isExpense ? 'text-red-600' : 'text-green-600'
                }`}>
                  {source.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-xl shadow-blue-500/30 p-5 text-white">
          <h3 className="mb-2">Spend Points On:</h3>
          <ul className="space-y-2 text-sm text-white/90">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span>Creating teams (500 pts)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span>Buying team slots (100 pts each)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              <span>Premium features (coming soon)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
