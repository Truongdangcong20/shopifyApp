import info from 'assets/info.json';

export function HomePageFallback() {
  const {
    homepage: {
      fallback: {
        text: {first, last},
      },
    },
  } = info;
  return (
    <div className="w-full min-h-screen grid place-items-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold">
          <span className="text-gray-600">{first}</span>
          <span className="text-blue-400"> {last}</span>
        </h1>
      </div>
    </div>
  );
}
