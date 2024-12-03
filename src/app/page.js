// app/page.js (Home Page)

import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to the Home Page</h1>

      {/* Link to Sign In page */}
      <Link href="/sigin">
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Go to Sign In
        </button>
      </Link>

      {/* Link to Message Board */}
      <Link href="/message-board">
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Go to Message Board
        </button>
      </Link>
    </div>
  );
};

export default HomePage;
