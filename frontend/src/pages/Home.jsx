import { Button } from "../components/Button";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import PrismaticBurst from "../components/PrismaticBurst";

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-950 relative overflow-hidden text-white">
      {/* Floating Hearts Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-pink-400 opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 24 + 12}px`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Hero Section with PrismaticBurst */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-8">
        {/* Background */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at center, #0a0a0a 0%, #000 100%)",
          }}
        >
          <PrismaticBurst
            animationType="rotate3d"
            intensity={1.1}
            speed={0.3}
            distort={0.7}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.2}
            rayCount={26}
            mixBlendMode="screen"
            colors={["#93C5FD", "#E9D5FF", "#FDE68A", "#FCA5A5"]}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl w-full mt-20">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            <span className="block">Swipe Into</span>
            <span className="block bg-gradient-to-r from-sky-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              The Spectrum
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Where memes meet hearts. Discover, rate, and fall in love with the
            most hilarious content on the internet.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-14">
            {isAuthenticated ? (
              <Link to="/dashboard">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg"
                >
                  Start Swiping
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-8 py-4 rounded-full text-lg shadow-lg"
                  >
                    Get Started
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-600 text-white font-semibold px-8 py-4 rounded-full text-lg backdrop-blur-sm"
                  >
                    Learn More
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Welcome Message */}
          {isAuthenticated && (
            <div className="mb-10">
              <p className="text-lg text-gray-300">
                Welcome back,{" "}
                <span className="text-pink-400 font-semibold">
                  {user?.username}
                </span>
                . Ready for more memes?
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-24 bg-[#FFF5F5] text-gray-900 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-12 text-pink-600">
            Why You’ll Love It
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              {
                icon: "👆",
                title: "Intuitive Swiping",
                desc: "Swipe right to like, left to pass. It’s that simple.",
              },
              {
                icon: "❤️",
                title: "Save Favorites",
                desc: "Keep your favorite memes in one place for instant laughs.",
              },
              {
                icon: "⚡",
                title: "Fast & Smooth",
                desc: "Lightning-fast performance and seamless transitions.",
              },
              {
                icon: "🧠",
                title: "Smart Recommendations",
                desc: "AI learns your humor and shows memes that match your vibe.",
              },
              {
                icon: "🌈",
                title: "Personalized Feed",
                desc: "Explore a curated meme world designed just for you.",
              },
              {
                icon: "🔥",
                title: "Trending Memes",
                desc: "Catch what’s viral right now before it’s old news.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-white border border-pink-100 shadow-md p-10 rounded-2xl backdrop-blur-md"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meme Preview Section */}
      <section className="relative z-10 py-24 bg-[#FFF0F0] text-gray-900 border-t border-pink-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-pink-600">
            Endless Laughter Awaits
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto mb-16">
            Dive into a universe of memes curated just for you. Every swipe
            brings a new smile.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-pink-100 p-10 rounded-2xl text-center shadow-md"
              >
                <div className="text-6xl mb-5">🎭</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Meme #{i}
                </h3>
                <p className="text-gray-600 text-sm">
                  Fresh humor waiting for you to discover.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 bg-gradient-to-r from-pink-200 via-rose-100 to-sky-100 text-gray-900 border-t border-pink-200 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-pink-700">
            Ready to Join the Fun?
          </h2>
          <p className="text-lg text-gray-700 mb-10">
            Create your account and start swiping through the funniest memes
            today.
          </p>
          <Link to={isAuthenticated ? "/dashboard" : "/register"}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold px-10 py-4 rounded-full text-lg shadow-lg"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Now"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Floating heart animation style */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) scale(1); opacity: 0.8; }
          50% { transform: translateY(-30px) scale(1.1); opacity: 1; }
          100% { transform: translateY(0px) scale(1); opacity: 0.8; }
        }
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
      `}</style>
    </div>
  );
}
