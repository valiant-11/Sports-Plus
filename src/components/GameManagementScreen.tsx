import { useState } from 'react';
import { Upload, Star, AlertTriangle, ArrowLeft, CheckCircle2, Clock, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { toast } from 'sonner';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface GameManagementScreenProps {
  gameId: string;
  gameName: string;
  onFinish: () => void;
  onCancel: () => void;
  onBack: () => void;
  verificationStatus?: 'pending' | 'verified' | 'expired';
  confirmations?: number;
}

const mockPlayers = [
  { id: 'P001', name: 'Alex Chen', attended: true, confirmed: true, team: 1 },
  { id: 'P002', name: 'Sarah Miller', attended: true, confirmed: true, team: 1 },
  { id: 'P003', name: 'Mike Johnson', attended: false, confirmed: false, team: 2 },
  { id: 'P004', name: 'Emma Davis', attended: true, confirmed: true, team: 2 },
  { id: 'P005', name: 'David Lee', attended: true, confirmed: false, team: 1 },
  { id: 'P006', name: 'Lisa Wang', attended: true, confirmed: true, team: 2 },
];

export function GameManagementScreen({ 
  gameId, 
  gameName, 
  onFinish, 
  onCancel, 
  onBack,
  verificationStatus = 'pending',
  confirmations = 4
}: GameManagementScreenProps) {
  const [proofUploaded, setProofUploaded] = useState(false);
  const [scores, setScores] = useState({ team1: '', team2: '' });
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reportPlayer, setReportPlayer] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [teamCaptainConfirmed, setTeamCaptainConfirmed] = useState({ team1: false, team2: false });

  const confirmedPlayers = mockPlayers.filter(p => p.confirmed).length;
  const requiredConfirmations = 4;
  const canVerify = confirmedPlayers >= requiredConfirmations && proofUploaded && 
                    (teamCaptainConfirmed.team1 || teamCaptainConfirmed.team2);

  const handleFinish = () => {
    if (!proofUploaded) {
      toast.error('Please upload proof photo to finish the game');
      return;
    }
    if (confirmedPlayers < requiredConfirmations) {
      toast.error(`Need ${requiredConfirmations} player confirmations to verify game`);
      return;
    }
    if (!teamCaptainConfirmed.team1 && !teamCaptainConfirmed.team2) {
      toast.error('At least one team captain must confirm the final score');
      return;
    }
    toast.success('Game completed and submitted for verification!');
    onFinish();
  };

  const handleCancel = () => {
    if (confirm('Are you sure you want to cancel this game? This action cannot be undone.')) {
      toast.info('Game cancelled');
      onCancel();
    }
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <h1 className="text-white text-2xl">{gameName}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Badge className={`${
            verificationStatus === 'verified' ? 'bg-green-500' :
            verificationStatus === 'expired' ? 'bg-red-500' :
            'bg-yellow-500'
          } text-white`}>
            {verificationStatus === 'verified' ? '✅ Verified' :
             verificationStatus === 'expired' ? '❌ Expired' :
             '⏳ Pending Verification'}
          </Badge>
        </div>
      </div>

      <ScrollArea className="flex-1 px-6 -mt-6">
        <div className="space-y-4 mb-6">
          {/* Verification Status Card */}
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className={`size-12 rounded-full flex items-center justify-center ${
                canVerify ? 'bg-green-100' : 'bg-yellow-100'
              }`}>
                {canVerify ? (
                  <CheckCircle2 className="size-6 text-green-600" />
                ) : (
                  <Clock className="size-6 text-yellow-600" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1">Verification Progress</h3>
                <p className="text-sm text-gray-600">
                  {canVerify 
                    ? 'Game ready for verification!' 
                    : 'Complete all requirements to verify game'}
                </p>
              </div>
            </div>

            {/* Verification Checklist */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3">
                <div className={`size-6 rounded-full flex items-center justify-center ${
                  confirmedPlayers >= requiredConfirmations ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {confirmedPlayers >= requiredConfirmations ? (
                    <CheckCircle2 className="size-4 text-green-600" />
                  ) : (
                    <Users className="size-4 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">Player Confirmations</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={(confirmedPlayers / requiredConfirmations) * 100} className="h-1.5 flex-1" />
                    <span className="text-xs text-gray-600">{confirmedPlayers}/{requiredConfirmations}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`size-6 rounded-full flex items-center justify-center ${
                  proofUploaded ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {proofUploaded ? (
                    <CheckCircle2 className="size-4 text-green-600" />
                  ) : (
                    <Upload className="size-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-900">Proof Photo Uploaded</p>
              </div>

              <div className="flex items-center gap-3">
                <div className={`size-6 rounded-full flex items-center justify-center ${
                  (teamCaptainConfirmed.team1 || teamCaptainConfirmed.team2) ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  {(teamCaptainConfirmed.team1 || teamCaptainConfirmed.team2) ? (
                    <CheckCircle2 className="size-4 text-green-600" />
                  ) : (
                    <Star className="size-4 text-gray-400" />
                  )}
                </div>
                <p className="text-sm text-gray-900">Captain Score Confirmation</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs text-blue-800">
                💡 Games need 4-6 player confirmations and proof to be verified. 
                Unverified games expire in 24 hours and give no points.
              </p>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 space-y-4">
            <div>
              <Label className="text-gray-700 mb-3 block">Upload Proof Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                {!proofUploaded ? (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Upload photo of game</p>
                    <p className="text-xs text-gray-500">Required to complete the game</p>
                    <Button
                      type="button"
                      onClick={() => setProofUploaded(true)}
                      variant="outline"
                      className="mt-3 rounded-xl"
                    >
                      Choose File
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">✓</div>
                    <span className="text-sm">Photo Uploaded</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label className="text-gray-700 mb-3 block">Final Scores</Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="team1" className="text-sm text-gray-600">Team 1</Label>
                  <Input
                    id="team1"
                    type="number"
                    value={scores.team1}
                    onChange={(e) => setScores({ ...scores, team1: e.target.value })}
                    placeholder="0"
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 mt-1"
                  />
                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={teamCaptainConfirmed.team1}
                        onChange={(e) => setTeamCaptainConfirmed({ ...teamCaptainConfirmed, team1: e.target.checked })}
                        className="size-4 rounded border-gray-300"
                      />
                      <span>Captain confirms</span>
                    </label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="team2" className="text-sm text-gray-600">Team 2</Label>
                  <Input
                    id="team2"
                    type="number"
                    value={scores.team2}
                    onChange={(e) => setScores({ ...scores, team2: e.target.value })}
                    placeholder="0"
                    className="h-12 rounded-xl border-gray-200 bg-gray-50 mt-1"
                  />
                  <div className="mt-2">
                    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={teamCaptainConfirmed.team2}
                        onChange={(e) => setTeamCaptainConfirmed({ ...teamCaptainConfirmed, team2: e.target.checked })}
                        className="size-4 rounded border-gray-300"
                      />
                      <span>Captain confirms</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
            <h3 className="text-gray-900 mb-4">Player Confirmations & Ratings</h3>
            <div className="space-y-4">
              {mockPlayers.map((player) => (
                <div key={player.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-blue-200 text-blue-700 text-sm">
                        {player.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-900 text-sm">{player.name}</p>
                        {player.confirmed && (
                          <CheckCircle2 className="size-4 text-green-600" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-gray-500">Team {player.team}</p>
                        <span className="text-xs text-gray-400">•</span>
                        {player.attended ? (
                          <span className="text-xs text-green-600">✓ Attended</span>
                        ) : (
                          <span className="text-xs text-red-600">✗ No Show</span>
                        )}
                        {player.confirmed && (
                          <>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-blue-600">✓ Confirmed</span>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setReportPlayer(player.id)}
                      className="text-xs text-red-600 hover:underline flex-shrink-0"
                    >
                      Report
                    </button>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRatings({ ...ratings, [player.id]: star })}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (ratings[player.id] || 0) >= star
                              ? 'fill-yellow-500 text-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {reportPlayer && (
            <div className="bg-red-50 rounded-3xl shadow-xl shadow-gray-200/50 p-6 border-2 border-red-200">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="text-red-900 mb-1">Report Player</h3>
                  <p className="text-sm text-red-700">
                    Reporting: {mockPlayers.find(p => p.id === reportPlayer)?.name}
                  </p>
                </div>
              </div>
              <Textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="Describe the issue..."
                className="min-h-[80px] rounded-xl border-red-300 mb-3"
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    toast.success('Player reported to admin');
                    setReportPlayer(null);
                    setReportReason('');
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 rounded-xl"
                >
                  Submit Report
                </Button>
                <Button
                  onClick={() => {
                    setReportPlayer(null);
                    setReportReason('');
                  }}
                  variant="outline"
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleFinish}
              className="flex-1 h-14 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-2xl shadow-lg shadow-green-500/30"
            >
              Finish Game
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="h-14 rounded-2xl border-red-300 text-red-600 hover:bg-red-50"
            >
              Cancel Game
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}