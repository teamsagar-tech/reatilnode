import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const ImpersonateAuth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    const userStr = searchParams.get('user');

    if (token && userStr) {
      // Store in sessionStorage to isolate this session to this tab only.
      // This prevents overwriting the Superadmin's token in localStorage.
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('user', decodeURIComponent(userStr));
      sessionStorage.setItem('isImpersonating', 'true');
      
      // Navigate to dashboard
      navigate('/dashboard', { replace: true });
    } else {
      // Fallback if missing params
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <>
      <Helmet>
        <title>Loading Session... - RetailNode</title>
      </Helmet>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800">Initializing Session...</h2>
          <p className="text-gray-500 mt-2">Please wait while we log you in.</p>
        </div>
      </div>
    </>
  );
};

export default ImpersonateAuth;
