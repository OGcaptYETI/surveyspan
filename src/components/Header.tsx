import Link from 'next/link';

export default function Header() {

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex justify-start">
            <Link href="/" className="font-stainless text-2xl font-bold text-itg-black">
              SurveySpan
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/auth/login"
              className="font-stainless text-itg-black hover:text-itg-red px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="font-stainless bg-itg-red text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}