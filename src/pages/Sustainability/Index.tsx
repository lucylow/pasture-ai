import SustainabilityDashboard from "@/components/Sustainability/Dashboard";
import { Link } from "react-router-dom";

const SustainabilityPage = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center text-white font-bold">P</div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">PastureAI <span className="text-green-600">Sustainability</span></h1>
          </div>
          <nav className="flex gap-6 text-sm font-medium text-slate-500">
            <Link to="/" className="hover:text-slate-900 transition-colors">Predictions</Link>
            <span className="text-slate-900 border-b-2 border-green-600 pb-1 cursor-default">Sustainability</span>
            <Link to="/farmer" className="hover:text-slate-900 transition-colors">Farmer Mode</Link>
            <Link to="#" className="hover:text-slate-900 transition-colors">Settings</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6">
        <SustainabilityDashboard farmId={1} />
      </main>
      
      <footer className="max-w-7xl mx-auto mt-12 pb-12 px-6 border-t border-slate-200 pt-8 flex justify-between items-center text-slate-400 text-xs">
          <p>© 2026 PastureAI. All rights reserved.</p>
          <div className="flex gap-4">
              <a href="#" className="hover:text-slate-600">Privacy Policy</a>
              <a href="#" className="hover:text-slate-600">Terms of Service</a>
          </div>
      </footer>
    </div>
  );
};

export default SustainabilityPage;
