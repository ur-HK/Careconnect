import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const Index = () => {
  const { user, userRole, loading } = useAuth();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  // Redirect logged-in users to their dashboard
  if (user && userRole) {
    if (userRole === 'customer') {
      return <Navigate to="/dashboard/customer" replace />;
    } else if (userRole === 'caretaker') {
      return <Navigate to="/dashboard/caretaker" replace />;
    }
  }

  // Show landing page for non-logged-in users
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-gradient-to-r from-teal-400 to-teal-500">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Find Trusted Care for Your Loved Ones
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Connect with verified, experienced caretakers for children, elderly, and
            individuals with special needs. Professional care, peace of mind.
          </p>
          <div className="flex gap-4">
            <Button
              size="lg"
              className="bg-white text-teal-600 hover:bg-gray-100"
              onClick={() => window.location.href = '/auth?tab=signup'}
            >
              Find a Caretaker
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/auth?tab=signup'}
            >
              Become a Caretaker
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-teal-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Verified Professionals</h3>
            <p className="text-gray-600">
              All caretakers are thoroughly vetted with background checks and verified certifications
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-orange-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Rated by Community</h3>
            <p className="text-gray-600">
              Read real reviews from families who've worked with our caretakers
            </p>
          </div>

          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2">Flexible Scheduling</h3>
            <p className="text-gray-600">
              Book by the hour or day, with options that fit your schedule and budget
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-orange-400 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of families who trust The Caretaker for their care needs
          </p>
          <Button
            size="lg"
            className="bg-teal-600 hover:bg-teal-700"
            onClick={() => window.location.href = '/auth?tab=signup'}
          >
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
};