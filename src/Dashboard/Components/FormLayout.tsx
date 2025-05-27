import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface FormLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  progressBars: number;
  onSubmit: (e: React.FormEvent) => void;
  showProgressBar?: boolean;
}

export const FormLayout: React.FC<FormLayoutProps> = ({children, title, subtitle,showProgressBar, progressBars, onSubmit}) => {
  const location = useLocation();
  const getHeaderTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard/RestartPasswordPage3') return 'Enter new password';
    if (path.includes('login')) return 'Login';
    if (path.includes('LoginDashboard')) return 'Login';
    if (path.includes('RestartPassword')) return 'Reset Password';
    if (path.includes('signup')) return 'Sign up';
    if (path.includes('SignDriver')) return 'Sign up';
    if (path.includes('SignUpRider')) return 'Sign up';
    return 'Sign up';
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-[38rem] bg-bg m-auto mt-20 mb-20 rounded-xl border border-gold-1 text-white py-3 px-7 shadow-md shadow-gold-1 hover:scale-105 duration-500">
        {/* Header */}
        <div className="grid items-center mt-5 mb-2">
          <p className='text-center text-3xl'>{getHeaderTitle()}</p>
        </div>

        {/* Welcome Section */}
        <div className="grid grid-rows-2 gap-2 mb-3">
          <h1 className='text-3xl font-[isemibold]'>{title}</h1>
          <h1 className='text-beige-3 text-lg'>{subtitle}</h1>
        </div>

        {/* Progress Bar */}
        {
          showProgressBar &&(
            <div className="w-full mt-5 mb-8 grid grid-cols-3 items-center justify-center gap-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <p key={index} className={`w-full h-2 rounded-full ${index < progressBars ? 'bg-gold-1' : 'bg-beige-3'}`} />
              ))}
            </div>
          )
        }

        {/* Form Content */}
        <form onSubmit={onSubmit}>
          {children}
        </form>

        {/* Login Link */}
        <p className='text-lg mb-8 text-center text-white'>

          {location.pathname.includes('login') ? (<>Don't have an account? <Link to="/signup" className='text-gold-1 hover:text-gold-2 transition-colors duration-300'>Sign up</Link></>)
          : location.pathname.includes("LoginDashboard")?(null)
          :location.pathname.includes("RestartPassword")?(null)
          :location.pathname.includes("RestartPasswordPage3")?(null)
          :(<>Already have an account? <Link to="/Login" className='text-gold-1 hover:text-gold-2 transition-colors duration-300'>login</Link></>
          )}
          
        </p>
      </div>
    </div>
  );
}; 