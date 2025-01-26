/**
 * A generic button component to handle various scenarios in your app.
 *
 * This component supports:
 * - Dynamic button types (e.g., `submit`, `reset`, `button`).
 * - Optional click handlers.
 * - Accessibility through ARIA attributes.
 * - Custom class names for styling.
 *
 * param {Object} props - The props for the Button component.
 * param {string} props.text - The visible text on the button.
 * param {"button" | "submit" | "reset"} [props.type="button"] - The button type (default: "button").
 * param {() => void} [props.onClick] - The function to execute on button click (optional).
 * param {boolean} [props.disabled=false] - Whether the button is disabled.
 * param {string} [props.className] - Optional class names for custom styling.
 * param {string} [props.ariaLabel] - ARIA label for better accessibility.
 *
 * returns {JSX.Element} - A reusable button component.
 */

interface ButtonProps {
  text: string; // The visible text on the button.
  type?: 'button' | 'submit' | 'reset'; // The type of the button, default is `button`.
  onClick?: () => void; // Function to handle click events (optional).
  disabled?: boolean; // Indicates whether the button is disabled.
  className?: string; // Optional class names for custom styling.
  ariaLabel?: string; // ARIA label for accessibility (optional).
}

export const Button: React.FC<ButtonProps> = ({
  text,
  type = 'button', // Defaults to a standard button type.
  onClick,
  disabled = false,
  className = '',
  ariaLabel,
}) => {
  return (
    <button
      type={type} // Sets the button's behavior.
      onClick={onClick} // Executes the provided click handler (if any).
      disabled={disabled} // Disables the button if set to true.
      className={className} // Allows custom styling via class names.
      aria-label={ariaLabel} // Adds an ARIA label for better accessibility (optional).
    >
      {text}
    </button>
  );
};
