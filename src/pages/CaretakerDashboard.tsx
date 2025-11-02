import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, DollarSign, Star, User, Bell } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  customer_id: string;
  status: string;
  booking_type: string;
  start_date: string;
  hours: number | null;
  total_amount: number;
  special_requirements: string | null;
}

interface Profile {
  full_name: string;
  bio: string | null;
  experience_years: number;
  hourly_rate: number;
  daily_rate: number | null;
  certifications: string[] | null;
  specializations: string[] | null;
  average_rating: number;
  total_reviews: number;
  total_completed_jobs: number;
}

const CaretakerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [dailyRate, setDailyRate] = useState('');

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchBookings();
      subscribeToBookings();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('caretaker_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFullName(data.full_name);
      setBio(data.bio || '');
      setExperienceYears(data.experience_years.toString());
      setHourlyRate(data.hourly_rate.toString());
      setDailyRate(data.daily_rate?.toString() || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('caretaker_id', user?.id)
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
      .channel('caretaker-bookings')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bookings',
          filter: `caretaker_id=eq.${user?.id}`
        },
        (payload) => {
          toast.info('New booking request received!', {
            description: 'Check your pending bookings',
            duration: 5000,
            action: {
              label: 'View',
              onClick: () => fetchBookings()
            }
          });
          fetchBookings();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleUpdateProfile = async () => {
    try {
      const { error } = await supabase
        .from('caretaker_profiles')
        .update({
          full_name: fullName,
          bio,
          experience_years: parseInt(experienceYears),
          hourly_rate: parseFloat(hourlyRate),
          daily_rate: dailyRate ? parseFloat(dailyRate) : null,
        })
        .eq('user_id', user?.id);

      if (error) throw error;
      toast.success('Profile updated successfully');
      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleBookingAction = async (bookingId: string, status: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId);

      if (error) throw error;
      toast.success(`Booking ${status}!`);
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking');
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
        <h1 className="text-4xl font-bold mb-8">Caretaker Dashboard</h1>
        
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-4">
            <Card className="shadow-soft mb-4">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Booking Requests</CardTitle>
                  {bookings.filter(b => b.status === 'pending').length > 0 && (
                    <Badge variant="default" className="bg-accent">
                      <Bell className="h-3 w-3 mr-1" />
                      {bookings.filter(b => b.status === 'pending').length} New
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>

            {bookings.length === 0 ? (
              <Card className="shadow-soft">
                <CardContent className="p-12 text-center">
                  <p className="text-muted-foreground">No bookings yet</p>
                </CardContent>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="shadow-soft">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle>Booking Request</CardTitle>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">${booking.total_amount}</p>
                        <Badge>{booking.status}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
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
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{booking.booking_type}</p>
                        </div>
                      </div>
                    </div>
                    {booking.special_requirements && (
                      <div className="mb-4 p-4 bg-secondary/30 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">Special Requirements</p>
                        <p>{booking.special_requirements}</p>
                      </div>
                    )}
                    {booking.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button onClick={() => handleBookingAction(booking.id, 'accepted')}>
                          Accept
                        </Button>
                        <Button variant="outline" onClick={() => handleBookingAction(booking.id, 'rejected')}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="profile">
            <Card className="shadow-soft">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
                  <Button variant="outline" onClick={() => setEditMode(!editMode)}>
                    {editMode ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {editMode ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experience">Experience (years)</Label>
                        <Input
                          id="experience"
                          type="number"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          step="0.01"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                        <Input
                          id="dailyRate"
                          type="number"
                          step="0.01"
                          value={dailyRate}
                          onChange={(e) => setDailyRate(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Full Name</Label>
                      <p className="text-lg font-medium">{profile?.full_name}</p>
                    </div>
                    <div>
                      <Label>Bio</Label>
                      <p className="text-muted-foreground">{profile?.bio || 'No bio yet'}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label>Experience</Label>
                        <p className="text-lg font-medium">{profile?.experience_years} years</p>
                      </div>
                      <div>
                        <Label>Hourly Rate</Label>
                        <p className="text-lg font-medium">${profile?.hourly_rate}</p>
                      </div>
                      <div>
                        <Label>Daily Rate</Label>
                        <p className="text-lg font-medium">${profile?.daily_rate || 'N/A'}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Average Rating</p>
                      <p className="text-2xl font-bold">{profile?.average_rating.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Reviews</p>
                      <p className="text-2xl font-bold">{profile?.total_reviews}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-soft">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Jobs</p>
                      <p className="text-2xl font-bold">{profile?.total_completed_jobs}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CaretakerDashboard;
