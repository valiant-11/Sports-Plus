import { useState } from 'react';
import { Bell, CheckCircle2, Trophy, Users, Star, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface Notification {
  id: string;
  type: 'game_invite' | 'team_update' | 'match_complete' | 'rating_received';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'game_invite',
    title: 'Game Invitation',
    message: 'Alex Chen invited you to Morning Basketball',
    time: '5 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'match_complete',
    title: 'Match Completed',
    message: 'Beach Volleyball match finished. Rate your teammates!',
    time: '2 hours ago',
    read: false,
  },
  {
    id: '3',
    type: 'rating_received',
    title: 'New Rating',
    message: 'Sarah Miller rated you 5 stars ⭐',
    time: '5 hours ago',
    read: false,
  },
  {
    id: '4',
    type: 'team_update',
    title: 'Team Update',
    message: 'Thunder Squad reached rank #3!',
    time: '1 day ago',
    read: true,
  },
];

interface NotificationSystemProps {
  unreadCount?: number;
}

export function NotificationSystem({ unreadCount = 3 }: NotificationSystemProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'game_invite':
        return <Users className="w-5 h-5 text-blue-600" />;
      case 'team_update':
        return <Trophy className="w-5 h-5 text-green-600" />;
      case 'match_complete':
        return <CheckCircle2 className="w-5 h-5 text-purple-600" />;
      case 'rating_received':
        return <Star className="w-5 h-5 text-yellow-600" />;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative bg-white/20 backdrop-blur-sm p-2.5 rounded-xl"
      >
        <Bell className="w-5 h-5 text-white" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[90%] rounded-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-600 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              View your recent notifications and updates
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="space-y-2 pt-4">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-xl border-2 transition-colors ${
                    notification.read
                      ? 'border-gray-200 bg-white'
                      : 'border-blue-200 bg-blue-50'
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="text-gray-900">{notification.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          <X className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{notification.message}</p>
                      <p className="text-xs text-gray-500">{notification.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
