import { AlertTriangle, Upload, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useState } from 'react';

interface ReportScreenProps {
  onBack: () => void;
  onSubmit: () => void;
}

const reportReasons = [
  'No-show to game',
  'Inappropriate behavior',
  'Fake profile',
  'Harassment',
  'Spam',
  'Other',
];

export function ReportScreen({ onBack, onSubmit }: ReportScreenProps) {
  const [formData, setFormData] = useState({
    playerId: '',
    reason: '',
    details: '',
  });
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-orange-600 pt-8 pb-12 px-6">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div className="flex items-center gap-3">
          <div className="bg-white rounded-2xl p-3">
            <AlertTriangle className="w-7 h-7 text-red-600" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-white text-2xl">Report Player</h1>
            <p className="text-white/80 text-sm">Help keep our community safe</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 -mt-6 pb-24">
        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-yellow-800">
              Reports are reviewed by our admin team. False reports may affect your reliability score.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="playerId" className="text-gray-700">Player ID or Username</Label>
              <Input
                id="playerId"
                value={formData.playerId}
                onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                placeholder="Enter player ID or @username"
                className="h-12 rounded-xl border-gray-200 bg-gray-50"
                required
              />
              <p className="text-xs text-gray-500">You can find this on their profile</p>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Reason for Report</Label>
              <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
                <SelectTrigger className="h-12 rounded-xl border-gray-200 bg-gray-50">
                  <SelectValue placeholder="Select a reason" />
                </SelectTrigger>
                <SelectContent>
                  {reportReasons.map((reason) => (
                    <SelectItem key={reason} value={reason}>
                      {reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="details" className="text-gray-700">Additional Details</Label>
              <Textarea
                id="details"
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                placeholder="Provide more context about the incident..."
                className="min-h-[120px] rounded-xl border-gray-200 bg-gray-50 resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700">Evidence (Optional)</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center bg-gray-50">
                {!photoUploaded ? (
                  <>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Upload screenshot or photo</p>
                    <p className="text-xs text-gray-500">Helps us review your report faster</p>
                    <Button
                      type="button"
                      onClick={() => setPhotoUploaded(true)}
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

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full h-14 bg-red-600 hover:bg-red-700 rounded-2xl"
              >
                Submit Report
              </Button>
              <p className="text-xs text-center text-gray-500 mt-3">
                Your report will be reviewed within 24-48 hours
              </p>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-5 mt-4">
          <h3 className="text-gray-900 mb-3">Safety Tips</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Look for verified players with blue checkmarks</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Check reliability scores before joining games</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Meet in public, well-lit locations</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">✓</span>
              <span>Trust your instincts and stay safe</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
