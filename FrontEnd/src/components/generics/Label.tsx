/**
 * A generic label component to display a descriptive text associated with an input.
 *
 * This component ensures reusability and supports accessibility by associating the label
 * with an input element through the `htmlFor` property.
 *
 * template T - The shape of the form object, ensuring type safety for the `htmlFor` prop.
 *
 * param {Object} props - The props for the Label component.
 * param {string} props.text - The text content of the label.
 * param {keyof T} props.htmlFor - The `id` of the input element that this label is associated with.
 * param {boolean} [props.required=false] - Whether the associated field is required. Appends an asterisk (*) if true.
 * param {string} [props.className] - Optional additional class names for custom styling.
 *
 * returns {JSX.Element} - A reusable and accessible label component.
 */

interface LabelProps<T> {
  text: string; // The text content of the label.
  htmlFor: keyof T; // The `id` of the input element that this label is associated with.
  required?: boolean; // Indicates if the associated field is mandatory. Defaults to `false`.
  className?: string; // Optional additional class names for custom styling.
}

export const Label = <T extends Record<string, any>>({
  text,
  htmlFor,
  required = false,
  className = '',
}: LabelProps<T>) => {
  return (
    <label
      htmlFor={htmlFor as string} // Links the label to the associated input via the `id`.
      className={className} // Allows for additional CSS class names.
    >
      {text} {/* Display the label's main text. */}
      {required && <span aria-hidden="true" style={{ color: 'red' }}> *</span>} {/* Append an asterisk if the field is required. */}
    </label>
  );
};
