/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Showcase from './pages/Showcase';
import Contact from './pages/Contact';
import Vendor from './pages/Vendor';
import ArtistRegistration from './pages/ArtistRegistration';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import TicketPurchase from './pages/TicketPurchase';
import Payment from './pages/Payment';
import { AnimatePresence, motion, useScroll, useTransform } from 'motion/react';
import Gateway from './pages/Gateway';
import SonicChronicles from './pages/SonicChronicles';
import FloatingGateway from './components/FloatingGateway';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
    } else {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [pathname, hash]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        <Route path="/" element={<Gateway />} />
        <Route path="/home" element={<Home />} /> {/* Moved current home to /home */}
        <Route path="/sonic-chronicles" element={<SonicChronicles />} />

        <Route path="/" element={
          <PageWrapper>
            <Home />
          </PageWrapper>
        } />
        <Route path="/showcase" element={
          <PageWrapper>
            <Showcase />
          </PageWrapper>
        } />
        <Route path="/contact" element={
          <PageWrapper>
            <Contact />
          </PageWrapper>
        } />
        <Route path="/vendor" element={
          <PageWrapper>
            <Vendor />
          </PageWrapper>
        } />
        <Route path="/artist-registration" element={
          <PageWrapper>
            <ArtistRegistration />
          </PageWrapper>
        } />
        <Route path="/purchase-tickets" element={
          <PageWrapper>
            <TicketPurchase />
          </PageWrapper>
        } />
        <Route path="/mock-payment" element={
          <PageWrapper>
            <Payment />
          </PageWrapper>
        } />
        <Route path="/access-gateway" element={
          <PageWrapper>
            <AdminLogin />
          </PageWrapper>
        } />
        <Route path="/admin" element={
          <AdminDashboard />
        } />
      </Routes>
      <FloatingGateway />
    </AnimatePresence>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  const { scrollYProgress } = useScroll();
  const background = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ['radial-gradient(circle at 50% 0%, rgba(10,12,15,1) 0%, rgba(0,0,0,1) 100%)', 
     'radial-gradient(circle at 50% 50%, rgba(15,10,12,1) 0%, rgba(5,5,7,1) 100%)', 
     'radial-gradient(circle at 50% 100%, rgba(10,15,12,1) 0%, rgba(0,0,0,1) 100%)']
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ background }}
      className="min-h-screen transition-colors duration-1000"
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen selection:bg-neon-pink selection:text-white bg-black">
        <ConditionalNavbar />
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>
        <ConditionalFooter />
      </div>
    </Router>
  );
}

function ConditionalNavbar() {
  const location = useLocation();
  const hiddenPaths = ['/admin', '/access-gateway', '/mock-payment'];
  if (hiddenPaths.includes(location.pathname)) return null;
  return <Navbar />;
}

function ConditionalFooter() {
  const location = useLocation();
  const hiddenPaths = ['/admin', '/access-gateway', '/mock-payment', '/purchase-tickets'];
  if (hiddenPaths.includes(location.pathname)) return null;
  return <Footer />;
}
