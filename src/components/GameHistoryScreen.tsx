import { Calendar, MapPin, Users, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const mockHistory = [
  {
    id: '1',
    title: 'Morning Basketball',
    sport: '🏀',
    location: 'Brgy. San Pedro',
    date: 'Oct 3, 2025',
    time: '8:00 AM',
    participants: 10,
    status: 'Completed',
    role: 'Organizer',
  },
  {
    id: '2',
    title: 'Beach Volleyball',
    sport: '🏐',
    location: 'Brgy. Tiniguiban',
    date: 'Oct 1, 2025',
    time: '5:00 PM',
    participants: 8,
    status: 'Completed',
    role: 'Player',
  },
  {
    id: '3',
    title: 'Evening Football',
    sport: '⚽',
    location: 'Brgy. Mandaragat',
    date: 'Oct 5, 2025',
    time: '6:30 PM',
    participants: 18,
    status: 'Ongoing',
    role: 'Player',
  },
];

interface GameHistoryScreenProps {
  onBack?: () => void;
}

export function GameHistoryScreen({ onBack }: GameHistoryScreenProps) {
  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <div className="flex items-center gap-4 mb-2">
          {onBack && (
            <button 
              onClick={onBack}
              className="bg-white/20 backdrop-blur-sm p-2 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div>
            <h1 className="text-white text-2xl">Game History</h1>
            <p className="text-white/80 text-sm mt-1">Track your games and activity</p>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-6 flex-1">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full grid grid-cols-3 bg-white rounded-2xl shadow-lg shadow-gray-200/50 h-12 p-1">
            <TabsTrigger value="all" className="rounded-xl">All</TabsTrigger>
            <TabsTrigger value="organized" className="rounded-xl">Organized</TabsTrigger>
            <TabsTrigger value="joined" className="rounded-xl">Joined</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-3 mt-4 overflow-y-auto">
            {mockHistory.map((game) => (
              <div key={game.id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{game.sport}</div>
                    <div>
                      <h3 className="text-gray-900">{game.title}</h3>
                      <Badge className={`mt-1 ${
                        game.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {game.status}
                      </Badge>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {game.role}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{game.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{game.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{game.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{game.participants} players</span>
                  </div>
                </div>

                {game.status === 'Completed' && (
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm text-green-600">Attended (+1 Reliability)</span>
                  </div>
                )}
              </div>
            ))}
          </TabsContent>

          <TabsContent value="organized" className="space-y-3 mt-4">
            {mockHistory.filter(game => game.role === 'Organizer').map((game) => (
              <div key={game.id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{game.sport}</div>
                    <div>
                      <h3 className="text-gray-900">{game.title}</h3>
                      <Badge className={`mt-1 ${
                        game.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {game.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{game.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{game.participants} players</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="joined" className="space-y-3 mt-4">
            {mockHistory.filter(game => game.role === 'Player').map((game) => (
              <div key={game.id} className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{game.sport}</div>
                    <div>
                      <h3 className="text-gray-900">{game.title}</h3>
                      <Badge className={`mt-1 ${
                        game.status === 'Completed' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {game.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{game.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{game.location}</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
