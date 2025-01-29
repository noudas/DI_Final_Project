import { Link } from 'react-router-dom';

const UserNavbar: React.FC = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/login-user">Login</Link>
        </li>
        <li>
          <Link to="/register-user">Register</Link>
        </li>
      </ul>
    </nav>
  );
};

export default UserNavbar;
