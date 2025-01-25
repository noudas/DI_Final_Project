import { useRef } from 'react';

/**
 * A generic input component that provides a reusable way to render input fields.
 * 
 * This component supports various input types and utilizes React's `useRef`
 * for efficient access to the DOM element. It ensures better organization and 
 * separation of logic for handling input changes.
 *
 * - template T - The shape of the form object, ensuring type safety for the input's `name` and `value`.
 *
 * - param {Object} props - The props for the Input component.
 * - param {string} props.label - The label text displayed for the input field.
 * - param {keyof T} props.name - The unique name identifier for the input, tied to the parent form's state.
 * - param {string} [props.type='text'] - The type of the input field (e.g., text, email, password).
 * - param {string} [props.placeholder] - Placeholder text for the input field.
 * - param {T[keyof T]} props.value - The current value of the input, tied to the parent form's state.
 * - param {Function} props.onChange - A callback triggered when the input value changes.
 *                                     It receives the `name` and updated `value` as arguments.
 * - param {boolean} [props.required=false] - Whether the input field is required for form submission.
 *
 * - returns {JSX.Element} - A reusable and type-safe input component.
 */

interface InputProps<T> {
  label: string;
  name: keyof T;
  type?: string;
  placeholder?: string;
  value: T[keyof T];
  onChange: (name: keyof T, value: T[keyof T]) => void;
  required?: boolean;
}

export const Input = <T extends Record<string, any>>({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}: InputProps<T>) => {
  // Create a ref to the input element, allowing direct access to the DOM element for advanced use cases.
  const inputRef = useRef<HTMLInputElement>(null);


  /**
   * Handles the input's change event by accessing the current value via the ref.
   * 
   * This function is called whenever the user types into the input. Instead of relying 
   * on the event object, it uses `useRef` to access the input's current value, ensuring
   * efficient updates and reduced re-renders.
   */

  const handleChange = () => {
    if (inputRef.current) {
      onChange(name, inputRef.current.value as T[keyof T]);
    }
  };

  return (
    <div>
      <label htmlFor={name as string}>{label}</label>

      <input
        ref={inputRef}
        id={name as string}
        name={name as string}
        type={type}
        placeholder={placeholder}
        value={value as string}
        onChange={handleChange}
        required={required}
      />
    </div>
  );
};
