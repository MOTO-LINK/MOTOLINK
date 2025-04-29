import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ResponsiveAppBar from './components/Navbar';
import GalacticFooter from './components/Footer';
import ScrollToTopButton from './components/Animation/ScrollToTopButton';
import { FloatingDust } from './components/Animation/FloatingDust';
import { FireParticles } from './components/Animation/FireParticles';
import AnimatedBackgroundElements from './components/Animation/AnimatedBackgroundElements';
import Cosmicgrid from './components/Animation/Cosmicgrid';
import Floatingplanets from './components/Animation/Floatingplanets';

const Layout: React.FC = () => {
    const location = useLocation();
    const hideFooterPaths = ['/Chats'];
    const shouldHideFooter = hideFooterPaths.includes(location.pathname);

  return (
    <div className="min-h-screen flex flex-col">
        <ResponsiveAppBar/>
        <FloatingDust/>
        <FireParticles/>
      <main className="flex-grow p-4">
        <Outlet /> 
      </main>

       {!shouldHideFooter && <GalacticFooter />}
       {!shouldHideFooter && <ScrollToTopButton/>}
       
    </div>
  );
};

export default Layout;
