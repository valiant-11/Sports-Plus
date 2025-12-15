import { Settings, CheckCircle2, Trophy, Award, Upload, Star, Camera, History, Edit2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';
import { NotificationSystem } from './NotificationSystem';

interface ProfileScreenProps {
  onSettings: () => void;
  onViewAchievements: () => void;
  onViewHistory?: () => void;
  onVerify?: () => void;
  userData?: {
    name: string;
    username: string;
    userId: string;
    isVerified: boolean;
    reliabilityScore: number;
    points: number;
    rating: number;
    gamesPlayed: number;
    teamName: string | null;
    skillLevel?: 'Casual' | 'Novice' | 'Elite';
  };
}

const badges = [
  { id: 1, name: 'First Game', icon: '🏆', earned: true },
  { id: 2, name: '10 Games', icon: '⭐', earned: true },
  { id: 3, name: 'Team Player', icon: '🤝', earned: true },
  { id: 4, name: '50 Games', icon: '🔥', earned: false },
];

const skillLevelOptions: ('Casual' | 'Novice' | 'Elite')[] = ['Casual', 'Novice', 'Elite'];

export function ProfileScreen({ onSettings, onViewAchievements, onViewHistory, onVerify, userData }: ProfileScreenProps) {
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showProfilePictureDialog, setShowProfilePictureDialog] = useState(false);
  const [showEditSkillDialog, setShowEditSkillDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [userSkillLevel, setUserSkillLevel] = useState<'Casual' | 'Novice' | 'Elite'>(userData?.skillLevel || 'Novice');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState<'Casual' | 'Novice' | 'Elite'>(userSkillLevel);
  
  const defaultUserData = {
    name: 'John Doe',
    username: 'johndoe',
    userId: 'SP2025-4521',
    isVerified: true,
    reliabilityScore: 92,
    points: 1250,
    rating: 4.7,
    gamesPlayed: 24,
    teamName: 'Thunder Squad',
    skillLevel: 'Novice' as const,
  };

  const user = userData || defaultUserData;

  const handleUploadProfilePicture = () => {
    toast.success('Profile picture uploaded!');
    setShowProfilePictureDialog(false);
  };

  const handleVerifyAccount = () => {
    onVerify?.();
    setShowVerificationDialog(false);
  };

  const handleSaveSkillLevel = () => {
    setUserSkillLevel(selectedSkillLevel);
    toast.success(`Skill level updated to ${selectedSkillLevel}!`);
    setShowEditSkillDialog(false);
  };

  const getSkillBadgeColor = (skill: string) => {
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

  const getSkillDescription = (skill: string) => {
    switch (skill) {
      case 'Casual':
        return 'Beginner level - New to the sport';
      case 'Novice':
        return 'Intermediate level - Some experience';
      case 'Elite':
        return 'Advanced level - Expert player';
      default:
        return '';
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20 overflow-y-auto">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-[2rem] relative">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-white text-xl">Profile</h1>
          <div className="flex gap-2">
            <NotificationSystem unreadCount={3} />
            <button onClick={onSettings} className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <Avatar className="w-20 h-20 border-4 border-white shadow-xl">
              <AvatarImage src={profilePicture || ""} alt="User" />
              <AvatarFallback className="bg-blue-200 text-blue-700 text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <button
              onClick={() => setShowProfilePictureDialog(true)}
              className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1.5 border-2 border-white hover:bg-blue-700 transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <h2 className="text-white text-xl">{user.name}</h2>
            {user.isVerified && (
              <CheckCircle2 className="w-5 h-5 text-white" />
            )}
          </div>
          {!user.isVerified && (
            <p className="text-white/60 text-sm mt-0.5">Unverified Player</p>
          )}
          <p className="text-white/70 text-sm mt-1">@{user.username}</p>
          <p className="text-white/60 text-xs mt-0.5">ID: {user.userId}</p>
          <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-lg mt-2">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs">{user.rating}</span>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm text-gray-600">Reliability Score</p>
              <p className="text-2xl text-gray-900">{user.reliabilityScore}%</p>
            </div>
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-white" />
            </div>
          </div>
          <Progress value={user.reliabilityScore} className="h-2 mb-2" />
          <p className="text-xs text-gray-500">
            {user.reliabilityScore >= 90 ? 'Excellent reliability! Keep it up.' : 
             user.reliabilityScore >= 70 ? 'Good reliability. Show up to more games to improve.' :
             'Low reliability. Attend games to improve your score.'}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={onViewAchievements}
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-2xl mb-1">🏆</div>
            <p className="text-lg text-gray-900">{user.points}</p>
            <p className="text-xs text-gray-600">Points</p>
          </button>
          <button 
            onClick={onViewHistory}
            className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 text-center hover:shadow-xl transition-shadow"
          >
            <div className="text-2xl mb-1">⚽</div>
            <p className="text-lg text-gray-900">{user.gamesPlayed}</p>
            <p className="text-xs text-gray-600">Games</p>
          </button>
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-3 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-lg text-gray-900 truncate">{user.teamName || 'None'}</p>
            <p className="text-xs text-gray-600">Team</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Skill Level</h3>
            <div className="flex items-center gap-2">
              <Badge className={`${getSkillBadgeColor(userSkillLevel)}`}>
                {userSkillLevel}
              </Badge>
              <button
                onClick={() => {
                  setSelectedSkillLevel(userSkillLevel);
                  setShowEditSkillDialog(true);
                }}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4 text-blue-600" />
              </button>
            </div>
          </div>
          <p className="text-xs text-gray-500">{getSkillDescription(userSkillLevel)}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">More Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Favorite Sports</span>
              <span className="text-gray-900">Basketball, Tennis</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Team</span>
              <span className="text-gray-900">{user.teamName || 'No team yet'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span className="text-gray-900">San Francisco, CA</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onViewAchievements}
          className="w-full bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 hover:shadow-xl transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              Badges & Achievements
            </h3>
            <span className="text-xs text-blue-600">View All →</span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-2 rounded-xl text-center border-2 ${
                  badge.earned
                    ? 'border-blue-200 bg-blue-50'
                    : 'border-gray-200 bg-gray-50 opacity-40'
                }`}
              >
                <div className="text-2xl mb-0.5">{badge.icon}</div>
                <p className="text-xs text-gray-700 leading-tight">{badge.name}</p>
              </div>
            ))}
          </div>
        </button>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
          <h3 className="text-gray-900 mb-3">Points System</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
              <span className="text-gray-700">Game Completed</span>
              <span className="text-green-600">+50 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
              <span className="text-gray-700">Game Won</span>
              <span className="text-green-600">+75 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded-xl">
              <span className="text-gray-700">Host Successful Game</span>
              <span className="text-green-600">+100 pts</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-blue-50 rounded-xl">
              <span className="text-gray-700">Achievement Unlocked</span>
              <span className="text-blue-600">+25-500 pts</span>
            </div>
          </div>
        </div>

        {!user.isVerified && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Upload className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-blue-900 mb-1">Get Verified</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Upload your ID to unlock game creation and earn trust badge
                </p>
                <Button 
                  onClick={() => setShowVerificationDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 rounded-xl"
                >
                  Verify Account
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Skill Level Dialog */}
      <Dialog open={showEditSkillDialog} onOpenChange={setShowEditSkillDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Skill Level</DialogTitle>
            <DialogDescription>
              Choose your current skill level in sports
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              {skillLevelOptions.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setSelectedSkillLevel(skill)}
                  className={`w-full p-4 rounded-2xl border-2 transition-all ${
                    selectedSkillLevel === skill
                      ? `${getSkillBadgeColor(skill)} border-current shadow-md`
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <p className="font-semibold">{skill}</p>
                      <p className="text-sm text-gray-600">{getSkillDescription(skill)}</p>
                    </div>
                    {selectedSkillLevel === skill && (
                      <div className="w-5 h-5 rounded-full bg-current flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowEditSkillDialog(false)}
                variant="outline"
                className="flex-1 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveSkillLevel}
                className="flex-1 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>ID Verification</DialogTitle>
            <DialogDescription>
              Upload a valid government-issued ID to get verified and unlock game creation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-gray-600">Upload a valid government-issued ID with your name and photo to get verified. This helps keep our community safe.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Button 
                onClick={handleVerifyAccount}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Choose File
              </Button>
            </div>
            <p className="text-xs text-gray-500">Accepted: Driver's License, Passport, National ID with name and photo</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showProfilePictureDialog} onOpenChange={setShowProfilePictureDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Upload Profile Picture</DialogTitle>
            <DialogDescription>
              Choose a profile picture to personalize your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-gray-600">Choose a profile picture to personalize your account.</p>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50">
              <Camera className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <Button 
                onClick={handleUploadProfilePicture}
                className="bg-blue-600 hover:bg-blue-700 rounded-xl"
              >
                Choose Photo
              </Button>
            </div>
            <p className="text-xs text-gray-500">Accepted: JPG, PNG (Max 5MB)</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}