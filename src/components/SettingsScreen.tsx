import { useState } from 'react';
import { ArrowLeft, User, Bell, Lock, Globe, HelpCircle, LogOut, Shield, Eye, EyeOff, FileText, MessageSquare } from 'lucide-react';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';
import { toast } from 'sonner';

interface SettingsScreenProps {
  onBack: () => void;
  onSignOut: () => void;
  onNavigateToTerms?: () => void;
  onNavigateToPrivacy?: () => void;
  onNavigateToFeedback?: () => void;
}

export function SettingsScreen({ onBack, onSignOut, onNavigateToTerms, onNavigateToPrivacy, onNavigateToFeedback }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState({
    gameInvites: true,
    teamUpdates: true,
    achievements: true,
    nearbyGames: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    showProfile: true,
    showLocation: true,
    showGameHistory: false,
  });

  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: 'John Doe',
    username: 'johndoe',
    email: 'john@example.com',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
    setEditProfileOpen(false);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters!');
      return;
    }
    toast.success('Password changed successfully!');
    setChangePasswordOpen(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleSavePrivacy = () => {
    toast.success('Privacy settings updated!');
    setPrivacyOpen(false);
  };

  const handleChangeLanguage = (lang: string) => {
    setSelectedLanguage(lang);
    toast.success('Language changed to ' + (lang === 'en' ? 'English' : lang === 'es' ? 'Spanish' : 'French'));
    setLanguageOpen(false);
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-white text-2xl">Settings</h1>
        <p className="text-white/80 text-sm mt-1">Manage your account preferences</p>
      </div>

      <ScrollArea className="flex-1 px-6 -mt-6">
        <div className="space-y-4 mb-6">
          <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 divide-y divide-gray-100">
            <button 
              onClick={() => setEditProfileOpen(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-t-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Edit Profile</p>
                <p className="text-xs text-gray-600">Update your personal information</p>
              </div>
            </button>

            <button 
              onClick={() => setPrivacyOpen(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Privacy & Safety</p>
                <p className="text-xs text-gray-600">Control who can see your profile</p>
              </div>
            </button>

            <button 
              onClick={() => setChangePasswordOpen(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-b-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <Lock className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Change Password</p>
                <p className="text-xs text-gray-600">Update your password</p>
              </div>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 space-y-4">
            <h3 className="text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-600" />
              Notifications
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Game Invites</p>
                  <p className="text-xs text-gray-600">Get notified when invited to games</p>
                </div>
                <Switch 
                  checked={notifications.gameInvites}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, gameInvites: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Team Updates</p>
                  <p className="text-xs text-gray-600">Updates from your teams</p>
                </div>
                <Switch 
                  checked={notifications.teamUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, teamUpdates: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Achievement Unlocked</p>
                  <p className="text-xs text-gray-600">When you earn new badges</p>
                </div>
                <Switch 
                  checked={notifications.achievements}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, achievements: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-900">Nearby Games</p>
                  <p className="text-xs text-gray-600">New games in your area</p>
                </div>
                <Switch 
                  checked={notifications.nearbyGames}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, nearbyGames: checked })}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 divide-y divide-gray-100">
            <button 
              onClick={() => setLanguageOpen(true)}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-t-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Language</p>
                <p className="text-xs text-gray-600">
                  {selectedLanguage === 'en' ? 'English' : selectedLanguage === 'es' ? 'Spanish' : 'French'}
                </p>
              </div>
            </button>

            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">Help & Support</p>
                <p className="text-xs text-gray-600">FAQs and contact us</p>
              </div>
            </button>

            <button 
              onClick={onNavigateToFeedback}
              className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-b-2xl transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-gray-900">App Feedback</p>
                <p className="text-xs text-gray-600">Rate and share your thoughts</p>
              </div>
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="w-full flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-red-600">Sign Out</p>
                    <p className="text-xs text-gray-600">Log out of your account</p>
                  </div>
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-[90%] rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle>Sign Out?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to sign out of your account?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-2 sm:gap-2">
                  <AlertDialogCancel className="flex-1 m-0 rounded-xl">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onSignOut}
                    className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                  >
                    Sign Out
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="text-center text-xs text-gray-500 py-4">
            <p>SportsPlus v1.0.0</p>
            <div className="mt-1 flex items-center justify-center gap-2">
              <button 
                onClick={onNavigateToTerms}
                className="text-blue-600 hover:underline"
              >
                Terms
              </button>
              <span>·</span>
              <button 
                onClick={onNavigateToPrivacy}
                className="text-blue-600 hover:underline"
              >
                Privacy
              </button>
              <span>·</span>
              <span>Support</span>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Edit Profile Dialog */}
      <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your personal information and account details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileData.username}
                onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                className="rounded-xl"
              />
            </div>
            <Button onClick={handleSaveProfile} className="w-full rounded-xl">
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              Update your password to keep your account secure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="rounded-xl pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button onClick={handleChangePassword} className="w-full rounded-xl">
              Change Password
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Settings Dialog */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Privacy & Safety</DialogTitle>
            <DialogDescription>
              Control who can see your profile and information
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Show Profile to Others</p>
                <p className="text-xs text-gray-600">Allow other users to view your profile</p>
              </div>
              <Switch 
                checked={privacySettings.showProfile}
                onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showProfile: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Show Location</p>
                <p className="text-xs text-gray-600">Display your location to find nearby games</p>
              </div>
              <Switch 
                checked={privacySettings.showLocation}
                onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showLocation: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-900">Show Game History</p>
                <p className="text-xs text-gray-600">Let others see your past games</p>
              </div>
              <Switch 
                checked={privacySettings.showGameHistory}
                onCheckedChange={(checked) => setPrivacySettings({ ...privacySettings, showGameHistory: checked })}
              />
            </div>
            <Button onClick={handleSavePrivacy} className="w-full rounded-xl">
              Save Settings
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Language Dialog */}
      <Dialog open={languageOpen} onOpenChange={setLanguageOpen}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle>Select Language</DialogTitle>
            <DialogDescription>
              Choose your preferred language for the app
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 pt-4">
            <button
              onClick={() => handleChangeLanguage('en')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedLanguage === 'en' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              English
            </button>
            <button
              onClick={() => handleChangeLanguage('es')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedLanguage === 'es' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Español
            </button>
            <button
              onClick={() => handleChangeLanguage('fr')}
              className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                selectedLanguage === 'fr' 
                  ? 'border-blue-600 bg-blue-50 text-blue-700' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              Français
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}