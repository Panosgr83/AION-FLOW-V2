import { Routes, Route } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import Overview from '../components/dashboard/Overview';
import Products from '../components/dashboard/Products';
import Categories from '../components/dashboard/Categories';
import Orders from '../components/dashboard/Orders';
import Customers from '../components/dashboard/Customers';
import Analytics from '../components/dashboard/Analytics';
import MediaLibrary from '../components/dashboard/MediaLibrary';
import HeroSlider from '../components/dashboard/HeroSlider';
import PageContent from '../components/dashboard/PageContent';
import Profile from '../components/dashboard/Profile';
import DashboardSettings from '../components/dashboard/DashboardSettings';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-950 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0 pl-[260px] transition-all duration-300">
        <AdminHeader />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="customers" element={<Customers />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="slider" element={<HeroSlider />} />
            <Route path="content" element={<PageContent />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
