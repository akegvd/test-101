import { NavLink, Route, Routes } from 'react-router';
import { AllFundsPage } from '@/pages/AllFundsPage';
import { BuyFundPage } from '@/pages/BuyFundPage';
import { ConfirmPage } from '@/pages/ConfirmPage';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<BuyFundPage />} />
      <Route path="/confirm" element={<ConfirmPage />} />
      <Route path="/funds" element={<AllFundsPage />} />
    </Routes>
  );
}

export function App() {
  return (
    <div className="app">
      <nav className="app__nav">
        <NavLink to="/">Buy</NavLink>
        <NavLink to="/funds">All funds</NavLink>
      </nav>
      <AppRoutes />
    </div>
  );
}
