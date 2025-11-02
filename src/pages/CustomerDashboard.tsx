import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  caretaker_id: string;
  status: string;
  booking_type: string;
  start_date: string;
  hours: number | null;
  total_amount: number;
  special_requirements: string | null;
  caretaker_profiles: {
    full_name: string;
    profile_image_url: string | null;
  };
}

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBookings();
      subscribeToBookings();
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          caretaker_profiles (
            full_name,
            profile_image_url
          )
        `)
        .eq('customer_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const subscribeToBookings = () => {
    const channel = supabase
      .channel('customer-bookings')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `customer_id=eq.${user?.id}`
        },
        () => {
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'completed': return 'outline';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Bookings</h1>
        
        {bookings.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground mb-4">You haven't made any bookings yet</p>
              <Button onClick={() => window.location.href = '/browse'}>
                Find a Caretaker
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id} className="shadow-soft">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-xl font-bold overflow-hidden">
                        {booking.caretaker_profiles.profile_image_url ? (
                          <img src={booking.caretaker_profiles.profile_image_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          booking.caretaker_profiles.full_name.charAt(0)
                        )}
                      </div>
                      <div>
                        <CardTitle>{booking.caretaker_profiles.full_name}</CardTitle>
                        <Badge variant={getStatusColor(booking.status)} className="mt-2">
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">${booking.total_amount}</p>
                      <p className="text-sm text-muted-foreground">{booking.booking_type}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-medium">{new Date(booking.start_date).toLocaleString()}</p>
                      </div>
                    </div>
                    {booking.hours && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Duration</p>
                          <p className="font-medium">{booking.hours} hours</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-medium">${booking.total_amount}</p>
                      </div>
                    </div>
                  </div>
                  {booking.special_requirements && (
                    <div className="mt-4 p-4 bg-secondary/30 rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Special Requirements</p>
                      <p>{booking.special_requirements}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
