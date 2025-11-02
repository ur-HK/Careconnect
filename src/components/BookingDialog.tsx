import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  caretaker: {
    user_id: string;
    full_name: string;
    hourly_rate: number;
    daily_rate: number | null;
  };
}

export const BookingDialog = ({ open, onOpenChange, caretaker }: BookingDialogProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingType, setBookingType] = useState<'hourly' | 'daily'>('hourly');
  const [startDate, setStartDate] = useState('');
  const [hours, setHours] = useState('');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please sign in to book a caretaker');
      navigate('/auth');
      return;
    }

    if (!startDate || (bookingType === 'hourly' && !hours)) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const totalAmount = bookingType === 'hourly' 
        ? caretaker.hourly_rate * parseInt(hours)
        : caretaker.daily_rate || 0;

      const { error } = await supabase
        .from('bookings')
        .insert({
          customer_id: user.id,
          caretaker_id: caretaker.user_id,
          booking_type: bookingType,
          start_date: new Date(startDate).toISOString(),
          hours: bookingType === 'hourly' ? parseInt(hours) : null,
          total_amount: totalAmount,
          special_requirements: specialRequirements || null,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Booking request sent successfully!');
      onOpenChange(false);
      navigate('/customer-dashboard');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Book {caretaker.full_name}</DialogTitle>
          <DialogDescription>
            Fill in the details below to request a booking
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Booking Type</Label>
            <RadioGroup value={bookingType} onValueChange={(v) => setBookingType(v as 'hourly' | 'daily')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hourly" id="hourly" />
                <Label htmlFor="hourly">Hourly (${caretaker.hourly_rate}/hr)</Label>
              </div>
              {caretaker.daily_rate && (
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Daily (${caretaker.daily_rate}/day)</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="datetime-local"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          {bookingType === 'hourly' && (
            <div className="space-y-2">
              <Label htmlFor="hours">Number of Hours</Label>
              <Input
                id="hours"
                type="number"
                min="1"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="requirements">Special Requirements (Optional)</Label>
            <Textarea
              id="requirements"
              placeholder="Any special needs or requirements..."
              value={specialRequirements}
              onChange={(e) => setSpecialRequirements(e.target.value)}
              rows={3}
            />
          </div>

          <div className="pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <span className="font-medium">Total Amount:</span>
              <span className="text-2xl font-bold text-primary">
                ${bookingType === 'hourly' && hours
                  ? (caretaker.hourly_rate * parseInt(hours)).toFixed(2)
                  : caretaker.daily_rate?.toFixed(2) || '0.00'}
              </span>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Sending Request...' : 'Send Booking Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
