type SpinnerProps = {
  classnames?: string;
};

export default function Spinner({ classnames = "h-10 w-10" }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center h-full">
      <div
        className={`animate-spin rounded-full ${classnames} border-4 border-gray-300 border-t-black`}
      ></div>
    </div>
  );
}
