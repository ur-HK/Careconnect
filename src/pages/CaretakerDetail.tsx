import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookingDialog } from '@/components/BookingDialog';
import { Star, Clock, DollarSign, Award, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

interface CaretakerProfile {
  id: string;
  user_id: string;
  full_name: string;
  bio: string | null;
  experience_years: number;
  certifications: string[] | null;
  specializations: string[] | null;
  hourly_rate: number;
  daily_rate: number | null;
  availability: string;
  phone: string | null;
  address: string | null;
  profile_image_url: string | null;
  average_rating: number;
  total_reviews: number;
  total_completed_jobs: number;
}

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
}

const CaretakerDetail = () => {
  const { caretakerId } = useParams();
  const [caretaker, setCaretaker] = useState<CaretakerProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaretakerData();
  }, [caretakerId]);

  const fetchCaretakerData = async () => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('caretaker_profiles')
        .select('*')
        .eq('user_id', caretakerId)
        .single();

      if (profileError) throw profileError;
      setCaretaker(profileData);

      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('caretaker_id', caretakerId)
        .order('created_at', { ascending: false })
        .limit(5);

      setReviews(reviewsData || []);
    } catch (error) {
      console.error('Error fetching caretaker:', error);
      toast.error('Failed to load caretaker details');
    } finally {
      setLoading(false);
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

  if (!caretaker) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-muted-foreground">Caretaker not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-medium mb-6">
              <CardHeader>
                <div className="flex items-start gap-6">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-5xl font-bold overflow-hidden">
                    {caretaker.profile_image_url ? (
                      <img src={caretaker.profile_image_url} alt={caretaker.full_name} className="w-full h-full object-cover" />
                    ) : (
                      caretaker.full_name.charAt(0)
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-3xl mb-2">{caretaker.full_name}</CardTitle>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-accent text-accent" />
                        <span className="font-medium text-lg">{caretaker.average_rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({caretaker.total_reviews} reviews)</span>
                      </div>
                      <Badge variant="secondary">{caretaker.availability}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {caretaker.specializations?.map((spec, idx) => (
                        <Badge key={idx}>{spec}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">About</h3>
                    <p className="text-muted-foreground">{caretaker.bio || 'Professional caretaker with years of experience.'}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <Clock className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Experience</p>
                        <p className="text-muted-foreground">{caretaker.experience_years} years</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Completed Jobs</p>
                        <p className="text-muted-foreground">{caretaker.total_completed_jobs} jobs</p>
                      </div>
                    </div>
                  </div>

                  {caretaker.certifications && caretaker.certifications.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Award className="h-5 w-5 text-accent" />
                        Certifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {caretaker.certifications.map((cert, idx) => (
                          <Badge key={idx} variant="outline">{cert}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {reviews.length > 0 && (
              <Card className="shadow-medium">
                <CardHeader>
                  <CardTitle>Reviews</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center gap-2 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-accent text-accent' : 'text-muted'}`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {review.review_text && (
                        <p className="text-muted-foreground">{review.review_text}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="shadow-medium sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-primary">${caretaker.hourly_rate}</p>
                    <p className="text-muted-foreground">per hour</p>
                  </div>
                  {caretaker.daily_rate && (
                    <div>
                      <p className="text-3xl font-bold text-primary">${caretaker.daily_rate}</p>
                      <p className="text-muted-foreground">per day</p>
                    </div>
                  )}
                  <Button className="w-full" size="lg" onClick={() => setBookingDialogOpen(true)}>
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        caretaker={caretaker}
      />
    </div>
  );
};

export default CaretakerDetail;
