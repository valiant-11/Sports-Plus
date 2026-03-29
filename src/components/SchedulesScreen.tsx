import { useState, useMemo } from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { mockSchedules } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

interface SchedulesScreenProps {
  onBack: () => void;
}

const sportIcons: Record<string, string> = {
  Basketball: '🏀',
  Volleyball: '🏐',
  Football: '⚽',
  Badminton: '🏸',
  Tennis: '🎾',
  Swimming: '🏊',
};

const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function SchedulesScreen({ onBack }: SchedulesScreenProps) {
  const { currentUser, updateUser } = useAuth();
  const [selectedDay, setSelectedDay] = useState('All');
  const [localSchedules, setLocalSchedules] = useState(mockSchedules);

  // Filter schedules by day
  const filteredSchedules = useMemo(() => {
    if (selectedDay === 'All') {
      return localSchedules.sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));
    }
    return localSchedules
      .filter(s => s.dayOfWeek === selectedDay)
      .sort((a, b) => dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek));
  }, [selectedDay, localSchedules]);

  const handleBookSlot = (scheduleId: string) => {
    const schedule = localSchedules.find(s => s.id === scheduleId);
    if (!schedule || !currentUser) return;

    // Check if already booked
    if (schedule.bookedBy.includes(currentUser.id)) {
      toast.error('You have already booked this slot');
      return;
    }

    // Check if full
    if (schedule.spotsLeft <= 0) {
      toast.error('This schedule is full');
      return;
    }

    // Update local schedules
    const updatedSchedules = localSchedules.map(s => {
      if (s.id === scheduleId) {
        return {
          ...s,
          spotsLeft: s.spotsLeft - 1,
          bookedBy: [...s.bookedBy, currentUser.id],
        };
      }
      return s;
    });
    setLocalSchedules(updatedSchedules);

    // Update user
    const updatedUser = {
      ...currentUser,
      mySchedules: [...(currentUser.mySchedules || []), scheduleId],
    };
    updateUser({
      mySchedules: updatedUser.mySchedules,
    });

    const dayName = schedule.dayOfWeek;
    toast.success(`Slot booked! See you every ${dayName}.`);
  };

  const getDayAbbreviation = (day: string): string => {
    return day.substring(0, 3);
  };

  const isSlotBooked = (scheduleId: string): boolean => {
    const schedule = localSchedules.find(s => s.id === scheduleId);
    return schedule?.bookedBy.includes(currentUser?.id || '') || false;
  };

  const isSlotFull = (scheduleId: string): boolean => {
    const schedule = localSchedules.find(s => s.id === scheduleId);
    return schedule?.spotsLeft === 0;
  };

  const renderSpotIndicator = (schedule: any) => {
    const filledSpots = schedule.totalSpots - schedule.spotsLeft;
    const spots = [];
    for (let i = 0; i < schedule.totalSpots; i++) {
      spots.push(
        <span
          key={i}
          className={`text-sm ${i < filledSpots ? 'text-blue-600' : 'text-gray-300'}`}
        >
          ●
        </span>
      );
    }
    return <div className="flex gap-0.5">{spots}</div>;
  };

  return (
    <div className="h-screen w-full max-w-md mx-auto bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 pt-8 pb-8 px-6 rounded-b-[2rem]">
        <button onClick={onBack} className="mb-4 text-white/90 hover:text-white flex items-center gap-2">
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <div>
          <h1 className="text-white text-2xl font-bold">Weekly Schedules</h1>
          <p className="text-white/80 text-sm">Book recurring game slots</p>
        </div>
      </div>

      {/* Day Filter */}
      <div className="px-6 mt-6 mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {['All', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm font-medium ${
                selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }`}
            >
              {day === 'All' ? 'All' : getDayAbbreviation(day)}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule List */}
      <div className="flex-1 overflow-y-auto px-6 space-y-3">
        {filteredSchedules.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">No schedules for this day</p>
          </div>
        ) : (
          filteredSchedules.map((schedule) => {
            const booked = isSlotBooked(schedule.id);
            const full = isSlotFull(schedule.id);
            const buttonDisabled = booked || full;

            return (
              <div
                key={schedule.id}
                className="bg-white rounded-2xl shadow-lg shadow-gray-200/50 p-4 border-l-4 border-l-blue-600"
              >
                {/* Header: Day & Time */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-gray-900 font-bold">Every {schedule.dayOfWeek}</h3>
                    <p className="text-sm text-gray-600">· {schedule.time}</p>
                  </div>
                  {booked && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                </div>

                {/* Sport & Venue */}
                <div className="mb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{sportIcons[schedule.sport] || '🎯'}</span>
                    <span className="text-gray-900 font-semibold">{schedule.sport}</span>
                  </div>
                  <p className="text-sm text-gray-600">📍 {schedule.venue}</p>
                </div>

                {/* Spots Indicator */}
                <div className="mb-4 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-600">Available Spots</span>
                    <span className="font-semibold text-gray-900">
                      {schedule.spotsLeft}/{schedule.totalSpots}
                    </span>
                  </div>
                  <div className="flex gap-0.5">{renderSpotIndicator(schedule)}</div>
                </div>

                {/* Button */}
                <Button
                  onClick={() => handleBookSlot(schedule.id)}
                  disabled={buttonDisabled}
                  className={`w-full rounded-xl font-semibold h-10 transition-all ${
                    booked
                      ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                      : full
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed opacity-50'
                      : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white'
                  }`}
                >
                  {booked ? '✓ Booked' : full ? 'Full' : 'Book Slot'}
                </Button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
