import { useState } from 'react';
import { MapPin, Filter, Calendar, Users, CheckCircle2, MessageCircle, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { NotificationSystem } from './NotificationSystem';

interface Game {
  id: string;
  title: string;
  sport: string;
  skillLevel: string;
  location: string;
  date: string;
  time: string;
  slots: { current: number; max: number };
  organizer: { name: string; verified: boolean; rating: number };
  distance: string;
  description: string;
}

const mockGames: Game[] = [
  {
    id: '1',
    title: 'Morning Basketball',
    sport: 'Basketball',
    skillLevel: 'Casual',
    location: 'Brgy. San Pedro',
    date: 'Oct 5, 2025',
    time: '8:00 AM',
    slots: { current: 8, max: 10 },
    organizer: { name: 'Alex Chen', verified: true, rating: 4.8 },
    distance: '0.5 km',
    description: 'Friendly pickup game for all skill levels. Bring water and good vibes!',
  },
  {
    id: '2',
    title: 'Beach Volleyball',
    sport: 'Volleyball',
    skillLevel: 'Novice',
    location: 'Brgy. Tiniguiban',
    date: 'Oct 6, 2025',
    time: '5:00 PM',
    slots: { current: 4, max: 8 },
    organizer: { name: 'Sarah Miller', verified: true, rating: 4.9 },
    distance: '1.2 km',
    description: 'Evening beach volleyball game. Perfect for intermediate players.',
  },
  {
    id: '3',
    title: 'Elite Football Match',
    sport: 'Football',
    skillLevel: 'Elite',
    location: 'Brgy. Mandaragat',
    date: 'Oct 7, 2025',
    time: '6:30 PM',
    slots: { current: 18, max: 22 },
    organizer: { name: 'Mike Johnson', verified: false, rating: 4.2 },
    distance: '2.8 km',
    description: 'Competitive match for experienced players only. Full gear required.',
  },
];

const sportIcons: Record<string, string> = {
  Basketball: '🏀',
  Volleyball: '🏐',
  Football: '⚽',
  Badminton: '🏸',
  Tennis: '🎾',
  Swimming: '🏊',
};

interface HomeScreenProps {
  onOpenChat?: (gameId: string, organizerName: string) => void;
  myGames?: Array<{
    id: string; 
    name: string; 
    date: string; 
    time: string; 
    location: string;
    verificationStatus?: 'pending' | 'verified' | 'expired';
    confirmations?: number;
  }>;
  onManageGame?: (gameId: string) => void;
  onJoinGame?: (gameId: string) => void;
  joinedGames?: string[];
  onOpenQueue?: () => void;
  onOpenMessages?: () => void;
  onRequestLocation?: () => void;
}

export function HomeScreen({ onOpenChat, myGames = [], onManageGame, onJoinGame, joinedGames = [], onOpenQueue, onOpenMessages, onRequestLocation }: HomeScreenProps) {
  const [view, setView] = useState<'map' | 'list'>('list');
  const [selectedSport, setSelectedSport] = useState('all');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const [pendingGameId, setPendingGameId] = useState<string | null>(null);

  const toggleJoinGame = (gameId: string) => {
    // Check if trying to join (not already joined)
    if (!joinedGames.includes(gameId)) {
      setPendingGameId(gameId);
      setShowLocationDialog(true);
    } else {
      // If leaving, just call the handler
      onJoinGame?.(gameId);
    }
  };

  const handleLocationPermission = (granted: boolean) => {
    setShowLocationDialog(false);
    if (granted && pendingGameId) {
      onRequestLocation?.();
      onJoinGame?.(pendingGameId);
    }
    setPendingGameId(null);
  };

  const sortedGames = [...mockGames];

  let filteredGames = (selectedSport === 'all' 
    ? sortedGames 
    : sortedGames.filter(game => game.sport === selectedSport));

  // Apply search filter
  if (searchQuery.trim()) {
    filteredGames = filteredGames.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.sport.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.organizer.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-6 px-6 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-white text-2xl">Discover Games</h1>
            <p className="text-white/80 text-sm">Find players near you</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onOpenMessages}
              className="bg-white/20 backdrop-blur-sm p-2.5 rounded-xl hover:bg-white/30 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-white" />
            </button>
            <NotificationSystem unreadCount={3} />
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-white" />
          <input
            type="text"
            placeholder="Search games, players, sports..."
            className="bg-transparent text-white placeholder-white/60 outline-none flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="px-6 -mt-3">
        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-2 flex gap-2">
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 rounded-xl transition-colors text-center ${
              view === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600'
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setView('map')}
            className={`flex-1 py-2 rounded-xl transition-colors text-center ${
              view === 'map' ? 'bg-blue-600 text-white' : 'text-gray-600'
            }`}
          >
            Map View
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 mt-4 space-y-3 pb-24">
        {view === 'map' && (
          <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 overflow-hidden">
            <div className="relative h-[500px] bg-gradient-to-br from-blue-50 via-green-50 to-blue-50">
              {/* Map Grid Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="grid grid-cols-10 grid-rows-10 h-full">
                  {Array.from({ length: 100 }).map((_, i) => (
                    <div key={i} className="border border-gray-400"></div>
                  ))}
                </div>
              </div>

              {/* Decorative Roads */}
              <div className="absolute top-1/3 left-0 right-0 h-8 bg-gray-300/30 border-y-2 border-dashed border-gray-400/40"></div>
              <div className="absolute left-2/3 top-0 bottom-0 w-8 bg-gray-300/30 border-x-2 border-dashed border-gray-400/40"></div>

              {/* Game Location Pins */}
              {filteredGames.map((game, index) => {
                // Position pins at different locations
                const positions = [
                  { top: '25%', left: '30%' },
                  { top: '45%', left: '60%' },
                  { top: '65%', left: '40%' },
                ];
                const pos = positions[index % positions.length];
                
                return (
                  <div
                    key={game.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
                    style={pos}
                    onClick={() => setSelectedGame(game)}
                  >
                    {/* Pulsing Animation */}
                    <div className="absolute inset-0 -m-4">
                      <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    
                    {/* Pin Icon */}
                    <div className="relative z-10 bg-blue-600 rounded-full p-3 shadow-xl border-4 border-white group-hover:scale-110 transition-transform">
                      <MapPin className="w-6 h-6 text-white fill-white" />
                    </div>
                    
                    {/* Game Info Popup */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-xl shadow-xl p-3 min-w-[180px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{sportIcons[game.sport]}</span>
                        <p className="text-sm text-gray-900 truncate">{game.title}</p>
                      </div>
                      <p className="text-xs text-gray-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {game.location}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">{game.distance} away</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-600">{game.slots.current}/{game.slots.max} players</span>
                        <Badge className="text-xs bg-blue-600 text-white">View</Badge>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Your Location Marker */}
              <div className="absolute bottom-[20%] left-[50%] transform -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                  <div className="absolute -inset-2">
                    <div className="w-8 h-8 bg-green-500 rounded-full animate-pulse opacity-50"></div>
                  </div>
                  <div className="relative z-10 w-4 h-4 bg-green-600 rounded-full border-4 border-white shadow-lg"></div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-green-600 text-white px-2 py-1 rounded-lg text-xs whitespace-nowrap shadow-lg">
                    📍 You are here
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg">
                <p className="text-xs text-gray-900 mb-2">Legend</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Available Games</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <span className="text-xs text-gray-600">Your Location</span>
                  </div>
                </div>
              </div>

              {/* Distance Scale */}
              <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-2 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-16 h-1 bg-gray-600"></div>
                  <span className="text-xs text-gray-600">1 km</span>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-white border-t border-gray-100">
              <p className="text-sm text-gray-600 text-center">
                Tap on pins to view game details • {filteredGames.length} games nearby
              </p>
            </div>
          </div>
        )}

        {view === 'list' && (
          <>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
              <button
                onClick={() => setSelectedSport('all')}
                className={`flex-shrink-0 border-2 rounded-2xl px-4 py-2 flex items-center gap-2 transition-colors ${
                  selectedSport === 'all' 
                    ? 'border-blue-600 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="text-sm">All Sports</span>
              </button>
              {Object.entries(sportIcons).map(([sport, icon]) => (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`flex-shrink-0 border-2 rounded-2xl px-4 py-2 flex items-center gap-2 transition-colors ${
                    selectedSport === sport
                      ? 'border-blue-600 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-sm">{sport}</span>
                </button>
              ))}
            </div>

            {filteredGames.map((game) => (
              <div key={game.id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{sportIcons[game.sport]}</div>
                    <div>
                      <h3 className="text-gray-900">{game.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">{game.organizer.name}</span>
                        {game.organizer.verified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600" />
                        )}
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                          <span className="text-xs text-gray-600">{game.organizer.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${
                    game.skillLevel === 'Casual' ? 'bg-green-100 text-green-700' :
                    game.skillLevel === 'Novice' ? 'bg-blue-100 text-blue-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    {game.skillLevel}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{game.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{game.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span>{game.slots.current}/{game.slots.max} players</span>
                  </div>
                  <div className="text-gray-600">
                    📍 {game.distance}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    onClick={() => toggleJoinGame(game.id)}
                    className={`flex-1 rounded-xl transition-all ${
                      joinedGames.includes(game.id)
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
                    }`}
                  >
                    {joinedGames.includes(game.id) ? 'Joined ✓' : 'Join Game'}
                  </Button>
                  {joinedGames.includes(game.id) && (
                    <Button
                      onClick={() => onOpenChat?.(game.id, game.organizer.name)}
                      variant="outline"
                      className="rounded-xl"
                    >
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  )}
                  <Button
                    onClick={() => setSelectedGame(game)}
                    variant="outline"
                    className="rounded-xl"
                  >
                    Details
                  </Button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Dialog open={!!selectedGame} onOpenChange={() => setSelectedGame(null)}>
        <DialogContent className="max-w-[90%] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-2xl">{selectedGame && sportIcons[selectedGame.sport]}</span>
              {selectedGame?.title}
            </DialogTitle>
            <DialogDescription>
              View game details and join the match
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <h4 className="text-gray-900 mb-2">Game Description</h4>
              <p className="text-gray-600">{selectedGame?.description}</p>
            </div>
            <div>
              <h4 className="text-gray-900 mb-2">Organizer</h4>
              <div className="flex items-center gap-2">
                <span className="text-gray-700">{selectedGame?.organizer.name}</span>
                {selectedGame?.organizer.verified && (
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                )}
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-gray-700">{selectedGame?.organizer.rating}</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="text-gray-900 text-sm mb-1">Location</h4>
                <p className="text-gray-600 text-sm">{selectedGame?.location}</p>
              </div>
              <div>
                <h4 className="text-gray-900 text-sm mb-1">Date & Time</h4>
                <p className="text-gray-600 text-sm">{selectedGame?.date} at {selectedGame?.time}</p>
              </div>
              <div>
                <h4 className="text-gray-900 text-sm mb-1">Skill Level</h4>
                <p className="text-gray-600 text-sm">{selectedGame?.skillLevel}</p>
              </div>
              <div>
                <h4 className="text-gray-900 text-sm mb-1">Available Slots</h4>
                <p className="text-gray-600 text-sm">{selectedGame?.slots.current}/{selectedGame?.slots.max}</p>
              </div>
            </div>
            <Button 
              onClick={() => {
                toggleJoinGame(selectedGame!.id);
                setSelectedGame(null);
              }}
              className={`w-full rounded-xl transition-all ${
                joinedGames.includes(selectedGame?.id || '')
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              }`}
            >
              {joinedGames.includes(selectedGame?.id || '') ? 'Joined ✓' : 'Join Game'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Location Permission Dialog */}
      <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
        <DialogContent className="max-w-[90%] rounded-2xl" aria-describedby="location-permission-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Location Permission
            </DialogTitle>
            <DialogDescription id="location-permission-description">
              SportsPlus needs access to your location to help you find nearby games and connect with players in your area.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-sm text-blue-800">
                <strong>Why we need this:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1 list-disc list-inside">
                <li>Show you games near your location</li>
                <li>Help organizers verify attendance</li>
                <li>Improve matchmaking in your area</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => handleLocationPermission(false)}
                variant="outline"
                className="flex-1 rounded-xl"
              >
                Not Now
              </Button>
              <Button
                onClick={() => handleLocationPermission(true)}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl"
              >
                Allow Location
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}