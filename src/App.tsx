/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { OfflineBanner } from './components/common/OfflineBanner';
import { NotificationsDrawer } from './components/common/NotificationsDrawer';
import { HomeView } from './components/home/HomeView';
import { CatalogView } from './components/catalog/CatalogView';
import { VirtualTryOnStudio } from './components/tryon/VirtualTryOnStudio';
import { AIStylistAdvisor } from './components/stylist/AIStylistAdvisor';
import { CartView } from './components/cart/CartView';
import { AccountView } from './components/account/AccountView';
import { AdminPortalView } from './components/admin/AdminPortalView';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { LensCustomizerModal } from './components/modals/LensCustomizerModal';
import { PDToolModal } from './components/modals/PDToolModal';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { AuthModal } from './components/auth/AuthModal';

const MainAppContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-stone-900 flex flex-col selection:bg-[#D4AF37]/30 selection:text-stone-950 font-sans antialiased">
      {/* Offline Status Top Banner */}
      <OfflineBanner />

      {/* Global Header */}
      <Header />

      {/* Main Routed View */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'catalog' && <CatalogView />}
        {activeTab === 'tryon' && <VirtualTryOnStudio />}
        {activeTab === 'stylist' && <AIStylistAdvisor />}
        {activeTab === 'cart' && <CartView />}
        {activeTab === 'account' && <AccountView />}
        {activeTab === 'admin' && <AdminPortalView />}
      </main>

      {/* Interactive Global Modals */}
      <ProductDetailModal />
      <LensCustomizerModal />
      <PDToolModal />
      <CheckoutModal />
      <AuthModal />
      <NotificationsDrawer />

      {/* Mobile-First Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
