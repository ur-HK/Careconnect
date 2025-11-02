import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/Navbar';
import { CaretakerCard } from '@/components/CaretakerCard';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  profile_image_url: string | null;
  average_rating: number;
  total_reviews: number;
  total_completed_jobs: number;
  city: string | null;
  state: string | null;
  is_verified: boolean;
  languages_spoken: string[] | null;
}

const Browse = () => {
  const [caretakers, setCaretakers] = useState<CaretakerProfile[]>([]);
  const [filteredCaretakers, setFilteredCaretakers] = useState<CaretakerProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCaretakers();
  }, [verifiedOnly, locationFilter]);

  useEffect(() => {
    let filtered = caretakers;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.specializations?.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
          c.city?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredCaretakers(filtered);
  }, [searchTerm, caretakers]);

  const fetchCaretakers = async () => {
    try {
      let query = supabase
        .from('caretaker_profiles')
        .select('*');

      if (verifiedOnly) {
        query = query.eq('is_verified', true);
      }

      if (locationFilter) {
        query = query.or(`city.ilike.%${locationFilter}%,state.ilike.%${locationFilter}%`);
      }

      const { data, error } = await query.order('average_rating', { ascending: false });

      if (error) throw error;
      setCaretakers(data || []);
      setFilteredCaretakers(data || []);
    } catch (error) {
      console.error('Error fetching caretakers:', error);
      toast.error('Failed to load caretakers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Find Your Perfect Caretaker</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Browse our verified professionals and find the right match for your needs
          </p>
          
          <div className="grid gap-4 md:grid-cols-3 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search by name, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Filter by location..."
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Badge 
                variant={verifiedOnly ? "default" : "outline"}
                className="cursor-pointer px-4 py-2"
                onClick={() => setVerifiedOnly(!verifiedOnly)}
              >
                {verifiedOnly ? "✓ Verified Only" : "Show All"}
              </Badge>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading caretakers...</p>
          </div>
        ) : filteredCaretakers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No caretakers found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCaretakers.map((caretaker) => (
              <CaretakerCard key={caretaker.id} caretaker={caretaker} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
