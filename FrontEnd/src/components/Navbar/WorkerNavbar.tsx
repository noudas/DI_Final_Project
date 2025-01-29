import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutWorker } from '../../features/worker/workerSlicer';

const WorkerNavbar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate for navigation in React Router v6
  const token = useSelector((state: any) => state.workers.token); // Assuming token is stored in the Redux state

  const handleLogout = () => {
    dispatch(logoutWorker())
      .then(() => {
        // Redirect to login page after successful logout
        navigate('/login-worker');
      })
      .catch((error) => {
        console.error('Logout failed:', error);
      });
  };

  return (
    <nav>
      <ul>
        {!token ? (
          <>
            <li>
              <Link to="/login-worker">Login</Link>
            </li>
            <li>
              <Link to="/register-worker">Register</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/template-form">Template Form</Link>
            </li>
            <li>
              <Link to="/template-manager">Template Manager</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default WorkerNavbar;