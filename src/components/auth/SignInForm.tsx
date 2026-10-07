import { useState } from "react";
import { useNavigate } from "react-router";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSSOSignIn = async () => {
    setIsLoading(true);
    
    // Simulate SSO authentication process
    try {
      // This would typically integrate with your SSO provider (Azure AD, Google, etc.)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to work list page after successful authentication
      navigate("/work-list");
    } catch (error) {
      console.error("SSO Sign-in failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements for glass effect */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      <div className="w-full max-w-md relative z-10">

        {/* Main Sign-In Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-purple-600/80 to-purple-700/80 backdrop-blur-sm px-8 py-12 text-center border-b border-white/10">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <span className="text-2xl font-bold text-white">CC</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              Cash Collection Bridge
            </h1>
            <p className="text-purple-100 text-sm">
              GE HealthCare · Collections Operations
            </p>
          </div>

          {/* Content Section */}
          <div className="px-8 py-12 bg-white">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your collections dashboard
              </p>
            </div>

            {/* SSO Sign-In Button */}
            <button
              onClick={handleSSOSignIn}
              disabled={isLoading}
              className={`w-full flex items-center justify-center px-6 py-4 rounded-xl font-semibold text-white transition-all duration-200 border border-white/20 ${
                isLoading
                  ? "bg-gray-500/50 backdrop-blur-sm cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600/80 to-purple-700/80 backdrop-blur-sm hover:from-purple-600/90 hover:to-purple-700/90 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl hover:shadow-purple-500/25"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Sign In with SSO
                </>
              )}
            </button>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500">
                By signing in, you agree to our{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-purple-600 hover:text-purple-700 transition-colors">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-300">
            Need help?{" "}
            <a href="#" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Contact IT Support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
