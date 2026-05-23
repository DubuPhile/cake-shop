type Header = {
  name: String;
};

export default function Header({ name }: Header) {
  return (
    <h1 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
      {name}
    </h1>
  );
}
