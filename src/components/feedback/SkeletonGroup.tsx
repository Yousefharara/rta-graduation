import Skeleton from "./Skeleton";

interface SkeletonGroupProps {
  count?: number;
  className?: string;
}

const SkeletonGroup = ({
  count = 5,
  className,
}: SkeletonGroupProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <Skeleton
          key={index}
          className={className}
        />
      ))}
    </>
  );
};

export default SkeletonGroup;