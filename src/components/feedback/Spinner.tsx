interface SpinnerProps {
  size?: number;
}

const Spinner = ({ size = 32 }: SpinnerProps) => {
  return (
    <div
      className="inline-block animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"
      style={{
        width: size,
        height: size,
      }}
    />
  );
};

export default Spinner;