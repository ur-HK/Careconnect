import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, LogOut, User } from 'lucide-react';

export const Navbar = () => {
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-card shadow-soft">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
            <Heart className="h-8 w-8 fill-accent text-accent" />
            <span>The Caretaker</span>
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate(userRole === 'caretaker' ? '/caretaker-dashboard' : '/customer-dashboard')}
                >
                  <User className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
                {userRole === 'customer' && (
                  <Button variant="outline" onClick={() => navigate('/browse')}>
                    Find Caretakers
                  </Button>
                )}
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Login
                </Button>
                <Button onClick={() => navigate('/auth?mode=signup')}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
