import { useState, useEffect } from 'react';
import { Input } from '../../generics/Input';
import { Label } from '../../generics/Label';
import { useDispatch, useSelector } from 'react-redux';
import { loginWorker } from '../../../features/worker/workerSlicer';
import { useNavigate } from 'react-router-dom';  // Import the useNavigate hook
import { RootState } from '../../../app/store'


const LoginWorker = () => {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state: RootState) => state.workers);

  // Use navigate hook to programmatically navigate
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Dispatch the login action
    dispatch(
      loginWorker({ email: loginEmail, password: loginPass })
    );
  };

  // If the login is successful, store the token in localStorage, show alert, and redirect
  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
      alert('Login successful!');
      // Navigate to the list-templates page after successful login
      navigate('/template-manager');
    }
  }, [token, navigate]);

  return (
    <div>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <div>
          <Label text="Email" htmlFor="email" />
          <Input
            label="Email"
            name="email"
            value={loginEmail}
            onChange={(_name, value) => setLoginEmail(value)}
          />
        </div>
        <div>
          <Label text="Password" htmlFor="password" />
          <Input
            label="Password"
            name="password"
            type="password"
            value={loginPass}
            onChange={(_name, value) => setLoginPass(value)}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      {token && !error && <p style={{ color: 'green' }}>You are logged in!</p>}
    </div>
  );
};

export default LoginWorker;
