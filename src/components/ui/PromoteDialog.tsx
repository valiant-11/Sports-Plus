import { Star, Sparkles, Pin, Eye } from 'lucide-react';
import { Dialog, DialogContent } from './dialog';
import { toast } from 'sonner';

interface PromoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  tournamentName?: string;
}

export function PromoteDialog({ isOpen, onClose, tournamentName = 'Your Tournament' }: PromoteDialogProps) {
  const handlePromote = () => {
    onClose();
    toast.success('Tournament promoted successfully!', {
      description: `"${tournamentName}" is now boosted to the top of the feed.`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[90vw] max-w-[360px] mx-auto bg-white rounded-[2rem] p-6 md:p-8 flex flex-col items-center border-none shadow-2xl outline-none">
        <div className="flex flex-col items-center w-full">
          {/* Icon */}
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-[#f59e0b]" strokeWidth={2.5} />
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-slate-900 text-center mb-1">
            Boost Your Tournament
          </h2>

          {/* Price */}
          <p className="text-2xl font-extrabold text-[#f59e0b] text-center mb-4">
            ₱99.00 <span className="text-sm font-medium text-slate-400"></span>
          </p>

          {/* Perks */}
          <div className="w-full space-y-3 mb-6">
            <div className="flex items-center gap-3 bg-amber-50/60 rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Pin className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <span className="text-sm font-medium text-slate-700">Pin to top of the feed</span>
            </div>
            <div className="flex items-center gap-3 bg-amber-50/60 rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <span className="text-sm font-medium text-slate-700">Highlighted gold border</span>
            </div>
            <div className="flex items-center gap-3 bg-amber-50/60 rounded-xl px-4 py-3">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <span className="text-sm font-medium text-slate-700">Reach 5x more players</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="w-full space-y-3">
          <button
            onClick={handlePromote}
            style={{ backgroundColor: '#f59e0b', color: 'white' }}
            className="w-full !bg-[#f59e0b] hover:!bg-[#d97706] !text-white font-bold py-4 rounded-full shadow-lg transition-colors text-lg"
          >
            Pay & Promote
          </button>

          <button
            onClick={onClose}
            className="mt-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors w-full text-center"
          >
            Maybe Later
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
