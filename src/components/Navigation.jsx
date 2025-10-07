import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react';
import { Menu, Globe, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useUser();
  const menuRef = useRef(null);


 

  return (
    <nav className="z-50 bg-black backdrop-blur-md flex items-center justify-between px-4 sm:px-6 text-white py-3 rounded-full mx-4 my-3 relative">
      <div className="flex items-center space-x-8">
        <a href="/" className="text-xl font-bold">
          SmartLodge
        </a>
        <div className="hidden md:flex space-x-6">
          <a href={`/`} className="transition-colors text-sm">
            Home
          </a>

         
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-xs hidden md:flex">
          <Globe className="h-4 w-4 mr-2" />
          EN
        </Button>
      
        <SignedOut>
          <SignInButton mode="modal">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs hidden md:flex"
            >
              Log In
            </Button>
          </SignInButton>
          <Link to="/sign-up">
            <Button
              size="sm"
              className="bg-white text-black hover:bg-gray-200 text-xs hidden md:flex"
            >
              Sign Up
            </Button>
          </Link>
        </SignedOut>
        <SignedIn>
          <span className="text-white text-sm mr-2 hidden md:block">
            Welcome, {user?.firstName || 'User'}!
          </span>
          <UserButton 
            appearance={{
              elements: {
                avatarBox: "w-8 h-8"
              }
            }}
          />
        </SignedIn>
        
        <div className="relative md:hidden">
          <Button
            // ref={buttonRef}
            variant="ghost"
            size="icon"
            className="relative z-20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">
              {isMenuOpen ? "Close menu" : "Open menu"}
            </span>
          </Button>

          {/* Dropdown Menu */}
          {isMenuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 mt-2 w-56 rounded-xl bg-black border border-gray-800 shadow-lg py-2 px-3 animate-in fade-in slide-in-from-top-5 duration-200 z-50"
              style={{ top: "calc(100% + 8px)" }}
            >
              <div className="flex flex-col space-y-3 py-2">
                <a
                  href="/"
                  className="text-sm font-medium hover:text-gray-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </a>
                {user?.publicMetadata?.role === "admin" && (
                  <a
                    href="/hotels/create"
                    className="text-sm font-medium hover:text-gray-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Create Hotel
                  </a>
                )}
                <div className="h-px bg-white/20 my-1"></div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="justify-start h-8 px-2"
                >
                  <Globe className="h-4 w-4 mr-2" />
                  EN
                </Button>
                
                <SignedOut>
                  <SignInButton mode="modal">
                    <button
                      className="text-sm font-medium hover:text-gray-300 transition-colors text-left"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Log In
                    </button>
                  </SignInButton>
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-gray-200 w-full mt-2"
                    asChild
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Link to="/sign-up">Sign Up</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <div className="flex items-center space-x-2 px-2 py-1">
                    <UserButton 
                      appearance={{
                        elements: {
                          avatarBox: "w-6 h-6"
                        }
                      }}
                    />
                    <span className="text-sm">
                      {user?.firstName || 'User'}
                    </span>
                  </div>
                  <Link
                    to="/dashboard"
                    className="text-sm font-medium hover:text-gray-300 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                </SignedIn>
           
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;