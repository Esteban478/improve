export const Button = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button data-testid="mock-button" {...props}>
    {children}
  </button>
)

export default Button