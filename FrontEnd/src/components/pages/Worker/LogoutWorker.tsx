import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // To handle navigation
import { logoutWorker } from '../../../features/worker/workerSlicer'; // You might need to create this action
import { AppDispatch } from '../../../app/store';

const LogoutWork = () => {
  const dispatch: AppDispatch = useDispatch(); 
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token from localStorage
    localStorage.removeItem('authToken');

    // Dispatch the logout action (if you want to manage the state)
    dispatch(logoutWorker());

    // Redirect user to the login page or any other page
    navigate('/login');
  }, [dispatch, navigate]);

  return (
    <div>
      <p>You are logging out...</p>
    </div>
  );
};

export default LogoutWork;