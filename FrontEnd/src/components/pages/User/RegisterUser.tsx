import React, { useState } from 'react';
import { Button } from '../../generics/Button';  // Importing your generic Button
import { Input } from '../../generics/Input';    // Importing your generic Input
import { Label } from '../../generics/Label';    // Importing your generic Label
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../../../features/user/userSlicer';  // Assuming you have the registerUser action
import { RootState } from '../../../app/store'

// Define the state type for the form
interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }
  
  const RegisterUser: React.FC = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState<RegisterFormData>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
    });
  
    const { loading, error, token } = useSelector((state: RootState) => state.users);
  
    const handleChange = (name: keyof RegisterFormData, value: string) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password === formData.confirmPassword) {
          // Dispatch the registerUser action with the form data
          dispatch(registerUser(formData));
        } else {
          alert('Passwords do not match');
        }
      };
      
  
    return (
      <form onSubmit={handleSubmit}>
        <div>
          <Label htmlFor="firstName" text="First Name" required />
          <Input<RegisterFormData>
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <Label htmlFor="lastName" text="Last Name" required />
          <Input<RegisterFormData>
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <Label htmlFor="username" text="Username" required />
          <Input<RegisterFormData>
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <Label htmlFor="email" text="Email" required />
          <Input<RegisterFormData>
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <Label htmlFor="password" text="Password" required />
          <Input<RegisterFormData>
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
  
        <div>
          <Label htmlFor="confirmPassword" text="Confirm Password" required />
          <Input<RegisterFormData>
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
  
        {error && <div style={{ color: 'red' }}>{error}</div>}
  
        <Button
          text="Register"
          type="submit"
          disabled={loading}
          ariaLabel="Register User"
        />
      </form>
    );
  };
  
  export default RegisterUser;