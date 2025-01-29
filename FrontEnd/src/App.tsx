import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react';

// Import your components
import LoginUser from './components/pages/User/LoginUser';
import RegisterUser from './components/pages/User/RegisterUser';
import LoginWorker from './components/pages/Worker/LoginWorker';
import RegisterWorker from './components/pages/Worker/RegisterWorker';
import ListTemplate from './components/pages/Worker/template/ListTemplates';
import TemplateManager from './components/pages/Worker/template/TemplateManager';
import { TemplateForm } from './components/pages/Worker/template/TemplateForm';

import UserNavbar from './components/Navbar/UserNavbar';  // Create this component
import WorkerNavbar from './components/Navbar/WorkerNavbar';  // Create this component

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<string | null>(null); // 'user' or 'worker'

  return (
    <Router>
      <div>
        {userRole === 'user' ? (
          <UserNavbar />
        ) : userRole === 'worker' ? (
          <WorkerNavbar />
        ) : null}

        <Routes>
          {/* User routes */}
          <Route path="/login-user" element={<LoginUser />} />
          <Route path="/register-user" element={<RegisterUser />} />

          {/* Worker routes */}
          <Route path="/login-worker" element={<LoginWorker />} />
          <Route path="/register-worker" element={<RegisterWorker />} />
          <Route path="/template-form" element={<TemplateForm />} />
          <Route path="/list-templates" element={<ListTemplate />} />
          <Route path="/template-manager" element={<TemplateManager />} />

          {/* Default route */}
          <Route path="/" element={<h1>Welcome to the Template App!</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
