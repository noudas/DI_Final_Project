import React, { useState } from 'react';
import { Button } from '../../generics/Button';
import { Input } from '../../generics/Input';
import { Label } from '../../generics/Label';
import { useDispatch, useSelector } from 'react-redux';
import { registerWorker } from '../../../features/worker/workerSlicer';
import { WorkerRole } from '../../../types/types';
import { AppDispatch, RootState } from '../../../app/store'

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    role: WorkerRole;
    specialty: string;
    experienceYears?: number;
  }

  const RegisterUser: React.FC = () => {
    const dispatch: AppDispatch = useDispatch(); 
    const [formData, setFormData] = useState<RegisterFormData>({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      role: WorkerRole.Nutritionist,
      specialty: '',
      experienceYears: undefined,
    });
  
    const { loading, error } = useSelector((state: RootState) => state.workers);
  
    const handleChange = (name: keyof RegisterFormData, value: string | number | undefined) => {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password === formData.confirmPassword) {
          // Dispatch the registerUser action with the form data
          dispatch(registerWorker(formData));
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

        <div>
        <Label htmlFor="role" text="Role" required />
            <select
            name="role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value as WorkerRole)}
            >
            <option value={WorkerRole.Nutritionist}>Nutritionist</option>
            <option value={WorkerRole.Psychologist}>Psychologist</option>
            </select>
        </div>
  
        <div>
          <Label htmlFor="specialty" text="Write your Specialty" required />
          <Input<RegisterFormData>
            label="Specialty"
            name="specialty"
            type="text"
            value={formData.specialty}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label htmlFor="experienceYears" text="Write your Experience Years" required />
          <Input<RegisterFormData>
            label="Experience Years"
            name="experienceYears"
            type="text"
            value={formData.experienceYears}
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