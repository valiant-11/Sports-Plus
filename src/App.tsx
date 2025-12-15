import { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingScreen } from './components/OnboardingScreen';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { ForgotPasswordScreen } from './components/ForgotPasswordScreen';
import { HomeScreen } from './components/HomeScreen';
import { CreateGameScreen } from './components/CreateGameScreen';
import { GameHistoryScreen } from './components/GameHistoryScreen';
import { TeamsScreen } from './components/TeamsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { PointsBadgesScreen } from './components/PointsBadgesScreen';
import { ReportScreen } from './components/ReportScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { TermsAndConditionsScreen } from './components/TermsAndConditionsScreen';
import { PrivacyPolicyScreen } from './components/PrivacyPolicyScreen';
import { AppFeedbackScreen } from './components/AppFeedbackScreen';
import { ChatScreen } from './components/ChatScreen';
import { GameManagementScreen } from './components/GameManagementScreen';
import { TeamMembersScreen } from './components/TeamMembersScreen';
import { TeamAchievementsScreen } from './components/TeamAchievementsScreen';
import { LeaderboardScreen } from './components/EnhancedLeaderboardScreen';
import { QueueScreen } from './components/QueueScreen';
import { CreatorGameViewScreen } from './components/CreatorGameViewScreen';
import { PostGameSummaryScreen } from './components/PostGameSummaryScreen';
import { ParticipantFeedbackScreen } from './components/ParticipantFeedbackScreen';
import { BottomNavigation } from './components/BottomNavigation';
import { Toaster, toast } from 'sonner';
import { ActiveGameScreen } from './components/ActiveGameScreen';

type AppScreen = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'signup'
  | 'forgot-password'
  | 'home'
  | 'chat'
  | 'create'
  | 'queue'
  | 'active-game'
  | 'teams'
  | 'profile'
  | 'history'
  | 'points-badges'
  | 'report'
  | 'settings'
  | 'terms-and-conditions'
  | 'privacy-policy'
  | 'app-feedback'
  | 'game-management'
  | 'creator-game-view'
  | 'team-members'
  | 'team-achievements'
  | 'leaderboard'
  | 'post-game-summary'
  | 'participant-feedback';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('splash');
  const [activeTab, setActiveTab] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    username: 'johndoe',
    userId: 'SP2025-4521',
    isVerified: false,
    reliabilityScore: 92,
    points: 1250,
    rating: 4.7,
    gamesPlayed: 24,
    teamName: 'Thunder Squad',
    gamesCreatedToday: 0,
    gamesCreatedThisWeek: 2,
  });
  const [myGames, setMyGames] = useState<Array<{
    id: string; 
    name: string; 
    date: string; 
    time: string; 
    location: string;
    verificationStatus: 'pending' | 'verified' | 'expired';
    confirmations: number;
  }>>([]);
  const [joinedGames, setJoinedGames] = useState<string[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [createdGameData, setCreatedGameData] = useState<any>(null);
  const [hasCreatedGame, setHasCreatedGame] = useState(false);
  const [postGameParticipants, setPostGameParticipants] = useState<any[]>([]);
  const [participantFeedbackData, setParticipantFeedbackData] = useState<any>(null);

  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveTab('home');
    toast.success('Welcome back to SportsPlus!');
  };

  const handleSignUp = (signUpData: any) => {
    setUserData({
      name: signUpData.fullName,
      username: signUpData.username,
      userId: 'SP2025-' + Math.floor(Math.random() * 10000),
      isVerified: signUpData.isVerified,
      reliabilityScore: 100,
      points: 0,
      rating: 0,
      gamesPlayed: 0,
      teamName: null,
      gamesCreatedToday: 0,
      gamesCreatedThisWeek: 0,
    });
    setIsAuthenticated(true);
    setCurrentScreen('home');
    setActiveTab('home');
    toast.success('Account created successfully!');
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
    toast.info('Signed out successfully');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    switch (tab) {
      case 'home':
        setCurrentScreen('home');
        break;
      case 'leaderboard':
        setCurrentScreen('leaderboard');
        break;
      case 'chat':
        setCurrentScreen('chat');
        setSelectedChatId(null);
        break;
      case 'create':
        // If user has a game (created or joined), show queue view
        if (createdGameData) {
          setCurrentScreen('queue');
        } else {
          setCurrentScreen('create');
        }
        break;
      case 'teams':
        setCurrentScreen('teams');
        break;
      case 'profile':
        setCurrentScreen('profile');
        break;
    }
  };

  const handleJoinGame = (gameId: string) => {
    if (joinedGames.includes(gameId)) {
      setJoinedGames(prev => prev.filter(id => id !== gameId));
      toast.info('Left game');
    } else {
      // Only allow joining one game at a time
      if (joinedGames.length > 0) {
        toast.error('You can only join one game at a time. Leave your current game first.');
        return;
      }
      setJoinedGames([gameId]);
      
      // Mock game data for the joined game
      const joinedGameData = {
        id: gameId,
        title: 'Morning Basketball',
        sport: '🏀 Basketball',
        location: 'Brgy. San Pedro',
        date: 'Oct 5, 2025',
        time: '8:00 AM',
        maxPlayers: 10,
      };
      setCreatedGameData(joinedGameData);
      setSelectedGameId(gameId);
      
      toast.success('Joined game successfully!');
      // Navigate to QUEUE screen (same as clicking Queue button)
      setCurrentScreen('queue');
      setActiveTab('create');
    }
  };

  const handleCreateGame = (gameData: any) => {
    const newGameId = 'game-' + Date.now();
    const newGame = {
      id: newGameId,
      name: gameData.title,
      date: gameData.date,
      time: gameData.time,
      location: gameData.location,
      verificationStatus: 'pending' as const,
      confirmations: 0,
    };
    setMyGames(prev => [...prev, newGame]);
    setUserData(prev => ({
      ...prev,
      gamesCreatedToday: prev.gamesCreatedToday + 1,
      gamesCreatedThisWeek: prev.gamesCreatedThisWeek + 1,
    }));
    
    // Store created game data and navigate to QUEUE screen
    setCreatedGameData({
      id: newGameId,
      title: gameData.title,
      sport: gameData.sport,
      location: gameData.location,
      date: gameData.date,
      time: gameData.time,
      maxPlayers: parseInt(gameData.maxPlayers) || 10,
    });
    setSelectedGameId(newGameId);
    setHasCreatedGame(true);
    setCurrentScreen('queue');
    setActiveTab('create');
    toast.success('Game created successfully! Get ready to play!');
  };

  const handleManageGame = (gameId: string) => {
    setSelectedGameId(gameId);
    setCurrentScreen('game-management');
  };

  const handleOpenChat = (gameId: string, organizerName: string) => {
    setSelectedChatId(gameId);
    setCurrentScreen('chat');
    setActiveTab('chat');
  };

  const handleGameFinish = () => {
    // Generate mock participants for rating
    const participants = [
      { id: '1', name: 'John Doe', verified: true },
      { id: '2', name: 'Maria Santos', verified: true },
      { id: '3', name: 'Alex Chen', verified: false },
    ];
    setPostGameParticipants(participants);
    setCurrentScreen('post-game-summary');
  };

  const handleGameCancel = () => {
    if (selectedGameId) {
      setMyGames(prev => prev.filter(g => g.id !== selectedGameId));
    }
    setHasCreatedGame(false);
    setCreatedGameData(null);
    setCurrentScreen('home');
    setActiveTab('home');
    toast.info('Game cancelled');
  };

  const handlePostGameComplete = () => {
    if (selectedGameId) {
      setMyGames(prev => prev.filter(g => g.id !== selectedGameId));
    }
    setHasCreatedGame(false);
    setCreatedGameData(null);
    setCurrentScreen('history');
    setActiveTab('home');
    setUserData(prev => ({
      ...prev,
      points: prev.points + 100,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
    toast.success('Game completed! You earned 100 points.');
  };

  const handleParticipantFinishGame = (gameId: string, gameTitle: string, organizer: any) => {
    setParticipantFeedbackData({ gameTitle, organizer });
    setCurrentScreen('participant-feedback');
  };

  const handleParticipantFeedbackComplete = () => {
    // Remove from joined games
    setJoinedGames([]);
    setParticipantFeedbackData(null);
    setCurrentScreen('history');
    setActiveTab('home');
    setUserData(prev => ({
      ...prev,
      points: prev.points + 50,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
    toast.success('Feedback submitted! You earned 50 points.');
  };

  const handleVerifyAccount = () => {
    setUserData(prev => ({ ...prev, isVerified: true }));
    toast.success('Account verified successfully! You can now create games.');
  };

  const handleReportSubmit = () => {
    setCurrentScreen('home');
    setActiveTab('home');
    toast.success('Report submitted. Our team will review it.');
  };

  const handleRequestLocation = () => {
    // Simulate location request
    toast.success('Location access granted');
  };

  const showMainNavigation = isAuthenticated && [
    'home',
    'leaderboard',
    'chat',
    'create',
    'queue',
    'teams',
    'profile',
    'history',
    'creator-game-view',
  ].includes(currentScreen);

  const unreadMessages = 7; // Mock unread count

  return (
    <div className="size-full flex items-center justify-center bg-gray-100">
      {currentScreen === 'splash' && (
        <SplashScreen onComplete={() => setCurrentScreen('onboarding')} />
      )}

      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={() => setCurrentScreen('login')} />
      )}

      {currentScreen === 'login' && (
        <LoginScreen
          onLogin={handleLogin}
          onSignUp={() => setCurrentScreen('signup')}
          onForgotPassword={() => setCurrentScreen('forgot-password')}
        />
      )}

      {currentScreen === 'signup' && (
        <SignUpScreen
          onSignUp={handleSignUp}
          onBack={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen
          onComplete={() => {
            setCurrentScreen('login');
            toast.success('Password reset successful!');
          }}
          onBack={() => setCurrentScreen('login')}
        />
      )}

      {currentScreen === 'home' && (
        <HomeScreen 
          onOpenChat={handleOpenChat} 
          myGames={myGames}
          onManageGame={handleManageGame}
          onJoinGame={handleJoinGame}
          joinedGames={joinedGames}
          onOpenQueue={() => setCurrentScreen('queue')}
          onOpenMessages={() => {
            setCurrentScreen('chat');
            setActiveTab('chat');
          }}
          onRequestLocation={handleRequestLocation}
        />
      )}

      {currentScreen === 'queue' && createdGameData && (
        <QueueScreen 
          gameData={createdGameData}
          isHost={hasCreatedGame}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onLeaveGame={(gameId) => {
            if (hasCreatedGame) {
              // If host, cancel the game
              handleGameCancel();
            } else {
              // If participant, leave the game
              handleJoinGame(gameId); // This toggles the join state
              setCreatedGameData(null);
              setCurrentScreen('home');
              setActiveTab('home');
            }
          }}
          onFinishGame={handleParticipantFinishGame}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen 
          selectedChatId={selectedChatId}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'create' && !hasCreatedGame && (
        <CreateGameScreen 
          onCreateGame={handleCreateGame}
          isVerified={userData.isVerified}
          gamesCreatedToday={userData.gamesCreatedToday}
          gamesCreatedThisWeek={userData.gamesCreatedThisWeek}
        />
      )}

      {currentScreen === 'leaderboard' && <LeaderboardScreen />}

      {currentScreen === 'teams' && <TeamsScreen />}

      {currentScreen === 'profile' && (
        <ProfileScreen 
          onSettings={() => setCurrentScreen('settings')}
          onViewAchievements={() => setCurrentScreen('points-badges')}
          onViewHistory={() => setCurrentScreen('history')}
          userData={userData}
          onVerify={handleVerifyAccount}
        />
      )}

      {currentScreen === 'history' && (
        <GameHistoryScreen 
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'points-badges' && (
        <PointsBadgesScreen 
          onBack={() => {
            setCurrentScreen('profile');
            setActiveTab('profile');
          }}
        />
      )}

      {currentScreen === 'team-members' && (
        <TeamMembersScreen
          onBack={() => {
            setCurrentScreen('teams');
            setActiveTab('teams');
          }}
          teamName={userData.teamName || 'Thunder Squad'}
          isAdmin={true}
        />
      )}

      {currentScreen === 'team-achievements' && (
        <TeamAchievementsScreen
          onBack={() => {
            setCurrentScreen('teams');
            setActiveTab('teams');
          }}
          teamName={userData.teamName || 'Thunder Squad'}
        />
      )}

      {currentScreen === 'report' && (
        <ReportScreen
          onBack={() => setCurrentScreen('home')}
          onSubmit={handleReportSubmit}
        />
      )}

      {currentScreen === 'settings' && (
        <SettingsScreen
          onBack={() => {
            setCurrentScreen('profile');
            setActiveTab('profile');
          }}
          onSignOut={handleSignOut}
          onNavigateToTerms={() => setCurrentScreen('terms-and-conditions')}
          onNavigateToPrivacy={() => setCurrentScreen('privacy-policy')}
          onNavigateToFeedback={() => setCurrentScreen('app-feedback')}
        />
      )}

      {currentScreen === 'terms-and-conditions' && (
        <TermsAndConditionsScreen
          onBack={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'privacy-policy' && (
        <PrivacyPolicyScreen
          onBack={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'app-feedback' && (
        <AppFeedbackScreen
          onBack={() => setCurrentScreen('settings')}
        />
      )}

      {currentScreen === 'game-management' && selectedGameId && (
        <GameManagementScreen
          gameId={selectedGameId}
          gameName="Morning Basketball"
          onFinish={handleGameFinish}
          onCancel={handleGameCancel}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
        />
      )}

      {currentScreen === 'creator-game-view' && createdGameData && (
        <CreatorGameViewScreen
          gameId={createdGameData.id}
          gameData={createdGameData}
          onBack={() => {
            setCurrentScreen('home');
            setActiveTab('home');
          }}
          onCancelGame={handleGameCancel}
          onFinishGame={handleGameFinish}
        />
      )}

      {currentScreen === 'post-game-summary' && createdGameData && (
        <PostGameSummaryScreen
          gameTitle={createdGameData.title}
          participants={postGameParticipants}
          onComplete={handlePostGameComplete}
          onBack={() => {
            setCurrentScreen('creator-game-view');
          }}
        />
      )}

      {currentScreen === 'participant-feedback' && participantFeedbackData && (
        <ParticipantFeedbackScreen
          gameTitle={participantFeedbackData.gameTitle}
          organizer={participantFeedbackData.organizer}
          onComplete={handleParticipantFeedbackComplete}
          onBack={() => {
            setCurrentScreen('queue');
          }}
        />
      )}

      {showMainNavigation && (
        <BottomNavigation 
          activeTab={activeTab} 
          onTabChange={handleTabChange}
          unreadMessages={unreadMessages}
          hasJoinedGames={joinedGames.length > 0}
          hasCreatedGame={hasCreatedGame}
        />
      )}
      
      <Toaster position="top-center" />
    </div>
  );
}