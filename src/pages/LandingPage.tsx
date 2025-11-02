import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Shield, Star, Clock, Heart } from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <section className="relative h-[600px] bg-gradient-hero flex items-center">
        <div className="absolute inset-0 overflow-hidden">
          <img src={heroImage} alt="Professional caretaker" className="w-full h-full object-cover opacity-20" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl text-primary-foreground">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Find Trusted Care for Your Loved Ones
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Connect with verified, experienced caretakers for children, elderly, and individuals with special needs. Professional care, peace of mind.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" variant="secondary" onClick={() => navigate('/browse')}>
                Find a Caretaker
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20" onClick={() => navigate('/auth?mode=signup')}>
                Become a Caretaker
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose The Caretaker?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-soft">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Verified Professionals</h3>
                <p className="text-muted-foreground">
                  All caretakers are thoroughly vetted with background checks and verified certifications
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Rated by Community</h3>
                <p className="text-muted-foreground">
                  Read real reviews from families who've worked with our caretakers
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-soft">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Flexible Scheduling</h3>
                <p className="text-muted-foreground">
                  Book by the hour or day, with options that fit your schedule and budget
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Heart className="h-16 w-16 fill-accent text-accent mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust The Caretaker for their care needs
          </p>
          <Button size="lg" onClick={() => navigate('/auth?mode=signup')}>
            Create Your Account
          </Button>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
