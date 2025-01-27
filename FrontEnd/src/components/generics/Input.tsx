/**
 * A reusable and type-safe input component for handling form inputs.
 *
 * template T - Represents the shape of the form object to ensure strong typing.
 *
 * Props:
 * - `label`: A string representing the label text displayed above the input field.
 * - `name`: A unique identifier for the input, tied to the parent form's state.
 * - `type`: An optional string specifying the type of input (e.g., 'text', 'password', 'email'). Defaults to 'text'.
 * - `placeholder`: Optional placeholder text displayed when the input is empty.
 * - `value`: The current value of the input field, tied to the parent form's state.
 * - `onChange`: A callback triggered when the input value changes, passing `name` and the updated `value`.
 * - `required`: A boolean indicating whether the input is required for form submission. Defaults to false.
 *
 * Example Usage:
 * ```
 * <Input<MyFormType>
 *   label="Username"
 *   name="username"
 *   value={formState.username}
 *   onChange={(name, value) => setFormState({ ...formState, [name]: value })}
 * />
 * ```
 */
interface InputProps<T extends Record<string, any>> {
  label: string;
  name: keyof T;
  type?: string;
  placeholder?: string;
  value: T[keyof T];
  onChange: (name: keyof T, value: T[keyof T]) => void;
  required?: boolean;
}

/**
 * A flexible input component designed to integrate seamlessly into forms with diverse data types.
 *
 * template T - Enforces strong typing for the input's `name` and `value`.
 */
export const Input = <T extends Record<string, any>>({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
}: InputProps<T>) => {
  return (
    <div>
      <label htmlFor={name as string}>{label}</label>
      <input
        id={name as string}
        name={name as string}
        type={type}
        placeholder={placeholder}
        value={value as string}
        onChange={(e) => onChange(name, e.target.value as T[keyof T])}
        required={required}
      />
    </div>
  );
};
