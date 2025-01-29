import { Link } from 'react-router-dom';

const WorkerNavbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/login-worker">Login</Link>
        </li>
        <li>
          <Link to="/register-worker">Register</Link>
        </li>

        {/* Show these links only if logged in */}
        <li>
          <Link to="/template-form">Template Form</Link>
        </li>
        <li>
          <Link to="/list-templates">List Templates</Link>
        </li>
        <li>
          <Link to="/categories">Categories</Link>
        </li>
        <li>
          <Link to="/template-manager">Template Manager</Link>
        </li>
      </ul>
    </nav>
  );
};

export default WorkerNavbar;
