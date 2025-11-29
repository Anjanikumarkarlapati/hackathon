import React, { useState, useEffect } from 'react';

// --- Custom Styles (Injected automatically) ---
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #f1f5f9; margin: 0; }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
  `}</style>
);

// --- Icons ---
const Icons = {
  User: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Admin: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Plus: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>,
  Alert: () => <svg width="20" height="20" fill="none" stroke="#EF4444" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/></svg>,
  Check: () => <svg width="20" height="20" fill="none" stroke="#10B981" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>,
  Trash: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>,
  ChevronLeft: () => <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>,
  Edit: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  List: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>,
  Lock: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Message: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  Mail: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>,
  Eye: () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>,
  Clock: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
  Filter: () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
};

// --- Data & Constants ---
const RDA_GUIDELINES = {
  child: { calories: 1600, protein: 34, iron: 10, calcium: 1000, vitaminD: 15 },
  adolescent: { calories: 2200, protein: 52, iron: 15, calcium: 1300, vitaminD: 15 },
};

const INITIAL_FOOD_DB = [
  { id: 101, name: "Carrot (100g)", calories: 41, protein: 0.9, iron: 0.3, calcium: 33, vitaminD: 0 },
  { id: 102, name: "Potato (Boiled, 100g)", calories: 87, protein: 1.9, iron: 0.8, calcium: 10, vitaminD: 0 },
  { id: 103, name: "Tomato (100g)", calories: 18, protein: 0.9, iron: 0.3, calcium: 10, vitaminD: 0 },
  { id: 104, name: "Spinach (100g)", calories: 23, protein: 2.9, iron: 2.7, calcium: 99, vitaminD: 0 },
  { id: 105, name: "Broccoli (100g)", calories: 34, protein: 2.8, iron: 0.7, calcium: 47, vitaminD: 0 },
  { id: 106, name: "Beans (100g)", calories: 31, protein: 1.8, iron: 1.0, calcium: 37, vitaminD: 0 },
  { id: 107, name: "Beetroot (100g)", calories: 43, protein: 1.6, iron: 0.8, calcium: 16, vitaminD: 0 },
  { id: 108, name: "Cauliflower (100g)", calories: 25, protein: 1.9, iron: 0.4, calcium: 22, vitaminD: 0 },
  { id: 109, name: "Brinjal/Eggplant (100g)", calories: 25, protein: 1.0, iron: 0.2, calcium: 9, vitaminD: 0 },
  { id: 110, name: "Cabbage (100g)", calories: 25, protein: 1.3, iron: 0.5, calcium: 40, vitaminD: 0 },
  { id: 201, name: "Roti (1 medium)", calories: 80, protein: 3.0, iron: 0.8, calcium: 10, vitaminD: 0 },
  { id: 202, name: "Rice (Cooked, 150g)", calories: 180, protein: 3.5, iron: 0.2, calcium: 10, vitaminD: 0 },
  { id: 203, name: "Dal Tadka (150g)", calories: 180, protein: 9.0, iron: 3.0, calcium: 40, vitaminD: 0 },
  { id: 204, name: "Chole (150g)", calories: 215, protein: 10.0, iron: 4.0, calcium: 80, vitaminD: 0 },
  { id: 205, name: "Paneer Curry (1 bowl)", calories: 265, protein: 18.0, iron: 0.5, calcium: 200, vitaminD: 0 },
  { id: 206, name: "Aloo Paratha (1 pc)", calories: 290, protein: 6.0, iron: 1.5, calcium: 30, vitaminD: 0 },
  { id: 207, name: "Rajma (1 bowl)", calories: 240, protein: 15.0, iron: 5.0, calcium: 60, vitaminD: 0 },
  { id: 208, name: "Veg Pulao (1 plate)", calories: 180, protein: 4.0, iron: 1.0, calcium: 20, vitaminD: 0 },
  { id: 209, name: "Matar Paneer (1 bowl)", calories: 300, protein: 14.0, iron: 1.5, calcium: 150, vitaminD: 0 },
  { id: 210, name: "Curd (100g)", calories: 60, protein: 3.5, iron: 0.1, calcium: 120, vitaminD: 0.1 },
  { id: 301, name: "Idli (2 pieces)", calories: 140, protein: 4.0, iron: 1.0, calcium: 20, vitaminD: 0 },
  { id: 302, name: "Dosa (1 medium)", calories: 168, protein: 3.0, iron: 0.8, calcium: 15, vitaminD: 0 },
  { id: 303, name: "Upma (1 bowl)", calories: 220, protein: 4.0, iron: 1.2, calcium: 20, vitaminD: 0 },
  { id: 304, name: "Sambar (150g)", calories: 80, protein: 3.0, iron: 1.0, calcium: 30, vitaminD: 0 },
  { id: 305, name: "Rasam (1 bowl)", calories: 40, protein: 1.0, iron: 0.5, calcium: 15, vitaminD: 0 },
  { id: 306, name: "Pongal (1 bowl)", calories: 250, protein: 5.0, iron: 1.0, calcium: 25, vitaminD: 0 },
  { id: 307, name: "Curd Rice (1 bowl)", calories: 220, protein: 6.0, iron: 0.5, calcium: 180, vitaminD: 0.2 },
  { id: 308, name: "Lemon Rice (1 bowl)", calories: 200, protein: 3.0, iron: 1.0, calcium: 20, vitaminD: 0 },
  { id: 309, name: "Pesarattu (1 pc)", calories: 154, protein: 7.0, iron: 2.0, calcium: 30, vitaminD: 0 },
  { id: 310, name: "Veg Kurma (1 bowl)", calories: 150, protein: 4.0, iron: 1.0, calcium: 40, vitaminD: 0 },
  { id: 401, name: "Apple (1 medium)", calories: 52, protein: 0.3, iron: 0.1, calcium: 6, vitaminD: 0 },
  { id: 402, name: "Banana (1 medium)", calories: 89, protein: 1.1, iron: 0.3, calcium: 5, vitaminD: 0 },
  { id: 403, name: "Orange (1 medium)", calories: 47, protein: 0.9, iron: 0.1, calcium: 40, vitaminD: 0 },
  { id: 404, name: "Mango (1 medium)", calories: 60, protein: 0.8, iron: 0.2, calcium: 10, vitaminD: 0 },
  { id: 405, name: "Grapes (1 cup)", calories: 69, protein: 0.7, iron: 0.3, calcium: 10, vitaminD: 0 },
  { id: 406, name: "Watermelon (1 wedge)", calories: 30, protein: 0.6, iron: 0.2, calcium: 7, vitaminD: 0 },
  { id: 407, name: "Papaya (1 cup)", calories: 43, protein: 0.5, iron: 0.1, calcium: 20, vitaminD: 0 },
  { id: 408, name: "Pineapple (1 cup)", calories: 50, protein: 0.5, iron: 0.3, calcium: 13, vitaminD: 0 },
  { id: 409, name: "Strawberry (1 cup)", calories: 32, protein: 0.7, iron: 0.4, calcium: 16, vitaminD: 0 },
  { id: 410, name: "Pomegranate (1 medium)", calories: 83, protein: 1.7, iron: 0.3, calcium: 10, vitaminD: 0 },
];

// --- Helpers ---
const calculateLogTotals = (log, foodDB) => {
  let totals = { calories: 0, protein: 0, iron: 0, calcium: 0, vitaminD: 0 };
  if (!log || !log.meals) return totals;

  log.meals.forEach(m => {
    let food = m.isCustom ? m : foodDB.find(f => f.id === parseInt(m.foodId));
    let mult = m.isCustom ? 1 : m.servings;
    if (food) {
      totals.calories += (food.calories || 0) * mult;
      totals.protein += (food.protein || 0) * mult;
      totals.iron += (food.iron || 0) * mult;
      totals.calcium += (food.calcium || 0) * mult;
      totals.vitaminD += (food.vitaminD || 0) * mult;
    }
  });
  return totals;
};

// --- AUTH COMPONENTS ---

const LoginPage = ({ onLoginVerify, onLoginSuccess, onSwitchToSignUp }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const isValid = onLoginVerify(email, password);
      if (isValid) {
        onLoginSuccess();
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4 font-sans">
      <Styles />
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-blue-200 shadow-lg">
              <Icons.Check />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Back</h1>
            <p className="text-slate-500 text-sm mt-1">Sign in to JuniorHealthMate</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Mail /></div>
                <input type="email" className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Lock /></div>
                <input type="password" className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            {error && <div className="text-red-500 text-xs flex items-center gap-1 bg-red-50 p-2 rounded-lg"><Icons.Alert /> {error}</div>}
            <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">{isLoading ? 'Signing In...' : 'Sign In'}</button>
          </form>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
           <p className="text-xs text-slate-400">Don't have an account? <span onClick={onSwitchToSignUp} className="text-blue-600 font-semibold cursor-pointer hover:underline">Sign up</span></p>
        </div>
      </div>
    </div>
  );
};

const SignUpPage = ({ onRegister, onSignUpSuccess, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (email === '' || password === '' || confirmPassword === '') {
        setError('All fields are required.');
        setIsLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setIsLoading(false);
        return;
      }
      const success = onRegister(email, password);
      if (success) {
         onSignUpSuccess();
      } else {
         setError('User already exists.');
         setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4 font-sans">
      <Styles />
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-slide-up">
        <div className="p-8">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-emerald-200 shadow-lg">
              <Icons.Plus />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Create Account</h1>
            <p className="text-slate-500 text-sm mt-1">Join JuniorHealthMate today</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Mail /></div>
                <input type="email" className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="user@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Lock /></div>
                <input type="password" className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-sm" placeholder="Create password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400"><Icons.Lock /></div>
                <input type="password" className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 outline-none text-sm ${error.includes('match') ? 'border-red-500' : 'border-slate-200 focus:ring-emerald-500'}`} placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
            {error && <div className="text-red-500 text-xs flex items-center gap-1 bg-red-50 p-2 rounded-lg font-medium animate-fade-in"><Icons.Alert /> {error}</div>}
            <button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70">{isLoading ? 'Creating...' : 'Sign Up'}</button>
          </form>
        </div>
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
           <p className="text-xs text-slate-400">Already have an account? <span onClick={onSwitchToLogin} className="text-emerald-600 font-semibold cursor-pointer hover:underline">Log in</span></p>
        </div>
      </div>
    </div>
  );
};

// --- Dashboard Components ---
const NutrientCard = ({ label, value, max, unit }) => {
  const percentage = Math.min((value / max) * 100, 100);
  let statusColor = "bg-green-500";
  if (percentage < 50) statusColor = "bg-red-500";
  else if (percentage < 80) statusColor = "bg-yellow-500";

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <span className="text-sm font-semibold text-slate-500">{label}</span>
        <span className="text-lg font-bold text-slate-800">{value} <span className="text-xs font-normal text-slate-400">/ {max}{unit}</span></span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
        <div className={`h-2.5 rounded-full transition-all duration-1000 ease-out ${statusColor}`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};

const DeficiencyAlert = ({ nutrient, gap, recommendation }) => (
  <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm mb-3">
    <div className="flex items-start">
      <div className="flex-shrink-0"><Icons.Alert /></div>
      <div className="ml-3">
        <h3 className="text-sm font-medium text-red-800">Deficiency Detected: {nutrient}</h3>
        <div className="mt-1 text-sm text-red-700"><p>Shortfall of {gap}. {recommendation}</p></div>
      </div>
    </div>
  </div>
);

const UserDashboard = ({ userLogs, foodDB, onAddLog }) => {
  const [selectedIndex, setSelectedIndex] = useState(userLogs.length - 1);
  const [filterName, setFilterName] = useState('All');

  useEffect(() => {
    if (userLogs.length > 0) setSelectedIndex(userLogs.length - 1);
  }, [userLogs]);
  
  if (!userLogs || userLogs.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500"><Icons.Plus /></div>
        <h2 className="text-xl font-bold text-slate-800">No Data Yet</h2>
        <p className="text-slate-500 mb-6">Start by logging your meals.</p>
        <button onClick={onAddLog} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-all">Add Daily Log</button>
      </div>
    );
  }

  const uniqueChildren = ['All', ...new Set(userLogs.map(log => log.name).filter(Boolean))];
  const filteredLogs = filterName === 'All' ? userLogs : userLogs.filter(log => log.name === filterName);
  
  const currentLog = userLogs[selectedIndex] || userLogs[userLogs.length - 1];
  const guidelines = currentLog.age >= 9 ? RDA_GUIDELINES.adolescent : RDA_GUIDELINES.child;
  const totals = calculateLogTotals(currentLog, foodDB);

  const deficiencies = [];
  if (totals.iron < guidelines.iron * 0.8) deficiencies.push({ name: 'Iron', gap: `${(guidelines.iron - totals.iron).toFixed(1)}mg`, rec: "Eat leafy greens/fortified cereals." });
  if (totals.calcium < guidelines.calcium * 0.8) deficiencies.push({ name: 'Calcium', gap: `${Math.round(guidelines.calcium - totals.calcium)}mg`, rec: "Increase milk/yogurt intake." });
  if (totals.vitaminD < guidelines.vitaminD * 0.8) deficiencies.push({ name: 'Vitamin D', gap: `${(guidelines.vitaminD - totals.vitaminD).toFixed(1)}mcg`, rec: "Consider fish/eggs/sunlight." });

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{currentLog.name ? currentLog.name + "'s" : "Daily"} Report</h2>
          <p className="text-slate-500 text-sm">Target: {currentLog.age} y/o {currentLog.gender} • {new Date(currentLog.date).toLocaleDateString()}</p>
        </div>
        <button onClick={onAddLog} className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all shadow-sm">+ Add New Log</button>
      </div>

      {deficiencies.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Intervention Needed</h3>
          {deficiencies.map((d, i) => <DeficiencyAlert key={i} nutrient={d.name} gap={d.gap} recommendation={d.rec} />)}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NutrientCard label="Calories" value={Math.round(totals.calories)} max={guidelines.calories} unit="kcal" />
        <NutrientCard label="Protein" value={totals.protein.toFixed(1)} max={guidelines.protein} unit="g" />
        <NutrientCard label="Iron" value={totals.iron.toFixed(1)} max={guidelines.iron} unit="mg" />
        <NutrientCard label="Calcium" value={Math.round(totals.calcium)} max={guidelines.calcium} unit="mg" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center flex-wrap gap-4">
          <h3 className="font-bold text-slate-700 flex items-center gap-2"><Icons.List /> History & Records</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold uppercase">Filter by Child:</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-300 text-slate-700 py-1 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value={filterName} onChange={(e) => setFilterName(e.target.value)}>
                {uniqueChildren.map(name => <option key={name} value={name}>{name}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500"><Icons.Filter /></div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white text-slate-500 border-b border-slate-100">
              <tr>
                <th className="p-3 font-medium">Date</th>
                <th className="p-3 font-medium">Child Name</th>
                <th className="p-3 font-medium">Age</th>
                <th className="p-3 font-medium">Gender</th>
                <th className="p-3 font-medium">Total Calories</th>
                <th className="p-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.slice().reverse().map((log) => {
                const originalIndex = userLogs.indexOf(log);
                const logTotals = calculateLogTotals(log, foodDB);
                const isSelected = originalIndex === selectedIndex;
                return (
                  <tr key={originalIndex} className={`hover:bg-blue-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}>
                    <td className="p-3 text-slate-600"><div className="flex items-center gap-2"><Icons.Clock /> {new Date(log.date).toLocaleDateString()}</div></td>
                    <td className="p-3 font-medium text-slate-800">{log.name || "Unknown"}</td>
                    <td className="p-3 text-slate-600">{log.age}</td>
                    <td className="p-3 text-slate-600 capitalize">{log.gender}</td>
                    <td className="p-3 text-slate-600 font-medium"><span className={logTotals.calories < 1000 ? "text-red-500" : "text-green-600"}>{Math.round(logTotals.calories)} kcal</span></td>
                    <td className="p-3 text-right">
                      <button onClick={() => setSelectedIndex(originalIndex)} className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all border ${isSelected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'}`}>{isSelected ? 'Viewing' : 'View'}</button>
                    </td>
                  </tr>
                );
              })}
              {filteredLogs.length === 0 && <tr><td colSpan="6" className="p-8 text-center text-slate-400 italic">No records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const LogForm = ({ foodDB, onSave, onCancel }) => {
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'male', meals: [{ isCustom: false, foodId: '', servings: 1 }] });
  const [errors, setErrors] = useState({});

  const handleMealChange = (index, field, value) => {
    const newMeals = [...formData.meals];
    newMeals[index][field] = value;
    setFormData({ ...formData, meals: newMeals });
  };

  const addMealRow = () => setFormData({ ...formData, meals: [...formData.meals, { isCustom: false, foodId: '', servings: 1 }] });
  
  const removeMealRow = (index) => {
    if (formData.meals.length > 1) {
      setFormData({ ...formData, meals: formData.meals.filter((_, i) => i !== index) });
    }
  };

  const toggleMealType = (index) => {
    const newMeals = [...formData.meals];
    newMeals[index].isCustom = !newMeals[index].isCustom;
    newMeals[index].foodId = '';
    newMeals[index].servings = 1;
    newMeals[index].name = '';
    newMeals[index].calories = '';
    setFormData({ ...formData, meals: newMeals });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.age || formData.age < 4 || formData.age > 18) newErrors.age = "Age must be 4-18.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({ ...formData, meals: formData.meals.map(m => ({ ...m })) });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg max-w-2xl mx-auto animate-slide-up relative overflow-hidden flex flex-col h-full">
      <div className="p-6 pb-24 overflow-y-auto"> 
        <div className="flex items-center gap-2 mb-6 cursor-pointer text-slate-500 hover:text-slate-800" onClick={onCancel}><Icons.ChevronLeft /> Back</div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">Log Daily Intake</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
               <label className="block text-sm font-medium text-slate-700 mb-1">Child's Name</label>
               <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="e.g. Sarah" />
               {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Age (4-18)</label>
              <input type="number" className={`w-full p-2 border rounded-lg outline-none ${errors.age ? 'border-red-500' : 'border-slate-200'}`} value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} placeholder="12" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
              <select className="w-full p-2 border border-slate-200 rounded-lg outline-none" value={formData.gender} onChange={(e) => setFormData({...formData, gender: e.target.value})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Meals Eaten</label>
            <div className="space-y-4">
              {formData.meals.map((meal, idx) => (
                <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                  <div className="flex justify-between items-center mb-3">
                    <button type="button" onClick={() => toggleMealType(idx)} className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded bg-white border border-slate-200 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-1">
                      {meal.isCustom ? <Icons.List /> : <Icons.Edit />} {meal.isCustom ? "List" : "Manual"}
                    </button>
                    <button type="button" onClick={() => removeMealRow(idx)} className="text-slate-400 hover:text-red-500"><Icons.Trash /></button>
                  </div>
                  {!meal.isCustom ? (
                    <div className="flex gap-2 items-start">
                      <select className="flex-1 p-2 border rounded-lg bg-white" value={meal.foodId} onChange={(e) => handleMealChange(idx, 'foodId', e.target.value)}>
                        <option value="">Select Food...</option>
                        {foodDB.map(f => <option key={f.id} value={f.id}>{f.name} ({f.calories} cal)</option>)}
                      </select>
                      <input type="number" className="w-24 p-2 border rounded-lg" placeholder="Qty" value={meal.servings} onChange={(e) => handleMealChange(idx, 'servings', e.target.value)} />
                    </div>
                  ) : (
                    <div className="space-y-3 animate-fade-in">
                      <div className="grid grid-cols-2 gap-3">
                         <input placeholder="Food Name" className="col-span-2 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={meal.name} onChange={(e) => handleMealChange(idx, 'name', e.target.value)} />
                         <input type="number" placeholder="Calories (kcal)" className="p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={meal.calories} onChange={(e) => handleMealChange(idx, 'calories', e.target.value)} />
                         <input type="number" placeholder="Protein (g)" className="p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={meal.protein} onChange={(e) => handleMealChange(idx, 'protein', e.target.value)} />
                         <input type="number" placeholder="Iron (mg)" className="p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={meal.iron} onChange={(e) => handleMealChange(idx, 'iron', e.target.value)} />
                         <input type="number" placeholder="Calcium (mg)" className="p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={meal.calcium} onChange={(e) => handleMealChange(idx, 'calcium', e.target.value)} />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addMealRow} className="mt-4 text-sm text-blue-600 flex items-center gap-1"><Icons.Plus /> Add Item</button>
          </div>
        </form>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t p-4 shadow">
        <button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-md">Save Log</button>
      </div>
    </div>
  );
};

const AdminDashboard = ({ foodDB, setFoodDB }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newFood, setNewFood] = useState({ name: '', calories: '', protein: '', iron: '', calcium: '', vitaminD: '' });

  const handleAddFood = (e) => {
    e.preventDefault();
    if (!newFood.name || !newFood.calories) return;
    const item = {
      id: Date.now(),
      name: newFood.name,
      calories: parseFloat(newFood.calories),
      protein: parseFloat(newFood.protein || 0),
      iron: parseFloat(newFood.iron || 0),
      calcium: parseFloat(newFood.calcium || 0),
      vitaminD: parseFloat(newFood.vitaminD || 0)
    };
    setFoodDB([...foodDB, item]);
    setNewFood({ name: '', calories: '', protein: '', iron: '', calcium: '', vitaminD: '' });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Nutritional Database</h2>
        <button onClick={() => setIsEditing(!isEditing)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
          {isEditing ? 'Cancel' : 'Add New Food'}
        </button>
      </div>
      {isEditing && (
        <form onSubmit={handleAddFood} className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 animate-slide-up">
          <h3 className="font-bold text-emerald-800 mb-4">Add New Catalog Item</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <input placeholder="Food Name" className="p-2 rounded border" value={newFood.name} onChange={e => setNewFood({...newFood, name: e.target.value})} required />
            <input type="number" placeholder="Calories" className="p-2 rounded border" value={newFood.calories} onChange={e => setNewFood({...newFood, calories: e.target.value})} required />
            <input type="number" placeholder="Protein (g)" className="p-2 rounded border" value={newFood.protein} onChange={e => setNewFood({...newFood, protein: e.target.value})} />
            <input type="number" placeholder="Iron (mg)" className="p-2 rounded border" value={newFood.iron} onChange={e => setNewFood({...newFood, iron: e.target.value})} />
            <input type="number" placeholder="Calcium (mg)" className="p-2 rounded border" value={newFood.calcium} onChange={e => setNewFood({...newFood, calcium: e.target.value})} />
            <input type="number" placeholder="Vit D (mcg)" className="p-2 rounded border" value={newFood.vitaminD} onChange={e => setNewFood({...newFood, vitaminD: e.target.value})} />
          </div>
          <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded shadow-sm hover:shadow-md">Save Item</button>
        </form>
      )}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold">
            <tr><th className="p-4">Food Item</th><th className="p-4 text-right">Calories</th><th className="p-4 text-right hidden md:table-cell">Protein</th><th className="p-4 text-right hidden md:table-cell">Iron</th></tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {foodDB.map(food => (
              <tr key={food.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-medium text-slate-700">{food.name}</td>
                <td className="p-4 text-right text-slate-600">{food.calories}</td>
                <td className="p-4 text-right text-slate-600 hidden md:table-cell">{food.protein}g</td>
                <td className="p-4 text-right text-slate-600 hidden md:table-cell">{food.iron}mg</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- Main App Logic ---
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [role, setRole] = useState('user');
  const [view, setView] = useState('dashboard');
  const [foodDB, setFoodDB] = useState(INITIAL_FOOD_DB);
  const [userLogs, setUserLogs] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]); // Store users here

  const handleSaveLog = (data) => {
    setUserLogs([...userLogs, { ...data, date: new Date().toISOString() }]);
    setView('dashboard');
  };

  const handleRegister = (email, password) => {
    // Check if user exists
    if (registeredUsers.find(u => u.email === email)) {
      return false; // User exists
    }
    setRegisteredUsers([...registeredUsers, { email, password }]);
    return true; // Success
  };

  const handleLoginAuth = (email, password) => {
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    return !!user;
  };

  // Auth Handling
  if (!isLoggedIn) {
    if (authMode === 'login') {
      return (
        <LoginPage 
          onLoginVerify={handleLoginAuth}
          onLoginSuccess={() => setIsLoggedIn(true)} 
          onSwitchToSignUp={() => setAuthMode('signup')}
        />
      );
    } else {
      return (
        <SignUpPage 
          onRegister={handleRegister}
          onSignUpSuccess={() => {
            setIsLoggedIn(true);
            setAuthMode('login'); // Reset for next time
          }}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Styles />
      <nav className="bg-white border-b sticky top-0 z-10 px-4 py-3 flex justify-between items-center max-w-5xl mx-auto">
        <div className="flex items-center gap-2 font-bold text-xl"><span className="text-blue-600"><Icons.Check /></span> JuniorHealthMate</div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button onClick={() => {setRole('user'); setView('dashboard')}} className={`px-3 py-1 rounded text-sm ${role==='user'?'bg-white shadow':'text-slate-500'}`}>Parent</button>
          <button onClick={() => {setRole('admin'); setView('dashboard')}} className={`px-3 py-1 rounded text-sm ${role==='admin'?'bg-white shadow':'text-slate-500'}`}>Admin</button>
          <button onClick={() => setIsLoggedIn(false)} className="px-3 py-1 text-red-500 text-sm">Logout</button>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {role === 'user' && view === 'dashboard' && <UserDashboard userLogs={userLogs} foodDB={foodDB} onAddLog={() => setView('log')} />}
        {role === 'user' && view === 'log' && <LogForm foodDB={foodDB} onSave={handleSaveLog} onCancel={() => setView('dashboard')} />}
        {role === 'admin' && <AdminDashboard foodDB={foodDB} setFoodDB={setFoodDB} />}
      </main>
    </div>
  );
};

export default App;