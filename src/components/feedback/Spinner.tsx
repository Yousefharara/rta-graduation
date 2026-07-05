interface SpinnerProps {
  size?: number;
  className?: string;
}

const Spinner = ({ size = 32, className }: SpinnerProps) => {
  return (
    <div
      className={`inline-block animate-spin rounded-full border-4 border-gray-300 border-t-blue-600 ${className}`}
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default Spinner;
