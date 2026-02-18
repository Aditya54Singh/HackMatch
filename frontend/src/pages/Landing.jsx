import AuthPanel from "../components/AuthPanel";

const Landing = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* LEFT – Branding & Info */}
      <div className="lg:w-1/2 relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white p-16 flex flex-col justify-center">

        <div className="max-w-lg">

          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Discover. Connect. Build.
          </h1>

          <p className="text-lg opacity-90 mb-8">
            HackMatch is a machine learning-powered hackathon discovery platform
            designed to connect innovators, filter spam events, and promote
            high-quality opportunities.
          </p>

          <div className="space-y-4 text-sm opacity-95">
            <div>🚀 AI-powered spam moderation</div>
            <div>🔥 Smart trending algorithm</div>
            <div>🤝 Developer similarity engine</div>
            <div>📊 Participation analytics</div>
          </div>

        </div>

        {/* Background Image Overlay */}
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
          alt="Hackathon"
          className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
        />

      </div>


      {/* RIGHT – Auth Panel */}
      <div className="lg:w-1/2 flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-12">

        <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl transition-all duration-300">

          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Welcome to HackMatch
          </h2>

          <AuthPanel />

        </div>

      </div>

    </div>
  );
};

export default Landing;
