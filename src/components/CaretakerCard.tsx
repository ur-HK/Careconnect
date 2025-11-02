import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, DollarSign, MapPin, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  profile_image_url: string | null;
  average_rating: number;
  total_reviews: number;
  total_completed_jobs: number;
  city: string | null;
  state: string | null;
  is_verified: boolean;
  languages_spoken: string[] | null;
}

interface CaretakerCardProps {
  caretaker: CaretakerProfile;
}

export const CaretakerCard = ({ caretaker }: CaretakerCardProps) => {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-medium transition-shadow cursor-pointer bg-gradient-card" onClick={() => navigate(`/caretaker/${caretaker.user_id}`)}>
      <CardHeader className="p-0">
        <div className="h-48 bg-secondary flex items-center justify-center overflow-hidden">
          {caretaker.profile_image_url ? (
            <img src={caretaker.profile_image_url} alt={caretaker.full_name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center text-primary-foreground text-6xl font-bold">
              {caretaker.full_name.charAt(0)}
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold">{caretaker.full_name}</h3>
            {caretaker.is_verified && (
              <Badge variant="default" className="bg-accent text-accent-foreground">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-accent text-accent" />
            <span className="font-medium">{caretaker.average_rating.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">({caretaker.total_reviews})</span>
          </div>
        </div>
        
        {(caretaker.city || caretaker.state) && (
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <MapPin className="h-3 w-3" />
            <span>{[caretaker.city, caretaker.state].filter(Boolean).join(', ')}</span>
          </div>
        )}
        
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {caretaker.bio || 'Professional caretaker with years of experience'}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {caretaker.specializations?.slice(0, 3).map((spec, idx) => (
            <Badge key={idx} variant="secondary">{spec}</Badge>
          ))}
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{caretaker.experience_years} years experience</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span>${caretaker.hourly_rate}/hr {caretaker.daily_rate && `• $${caretaker.daily_rate}/day`}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" onClick={(e) => {
          e.stopPropagation();
          navigate(`/caretaker/${caretaker.user_id}`);
        }}>
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};
