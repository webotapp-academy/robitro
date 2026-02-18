import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden">
      {/* Main Footer */}
      <div className="bg-robitro-navy text-white relative">
        {/* Floating Elements in Footer */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <div className="absolute top-20 left-10 text-3xl animate-pulse">🔧</div>
          <div className="absolute top-40 right-20 text-2xl animate-pulse" style={{ animationDelay: '0.5s' }}>💻</div>
          <div className="absolute bottom-32 left-1/3 text-2xl animate-pulse" style={{ animationDelay: '1s' }}>🎮</div>
          <div className="absolute top-1/2 right-1/4 text-xl animate-pulse" style={{ animationDelay: '1.5s' }}>📡</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          {/* Main Footer Content */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="mb-6">
                <img
                  src="/robitro-logo.png"
                  alt="Robitro - Minds in Motion"
                  className="h-20 w-auto"
                />
              </div>
              <p className="text-white text-base mb-6 leading-relaxed font-medium">
                Empowering young innovators with cutting-edge technology education in Robotics, AI, IoT, Electronics, and Coding.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-robitro-yellow hover:text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20v-7.21h-2.04V9.42h2.04V7.36c0-2.05 1.23-3.17 3.09-3.17.88 0 1.64.07 1.86.1v2.16h-1.27c-1 0-1.19.48-1.19 1.18V9.42h2.39l-.31 2.37h-2.08V20" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-robitro-yellow hover:text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-robitro-yellow hover:text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 hover:bg-robitro-yellow hover:text-gray-900 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.544 2.914 1.19.092-.926.35-1.546.636-1.9-2.22-.252-4.555-1.112-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Courses */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-robitro-yellow">🎓 Courses</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/courses?category=Robotics" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Robotics
                  </Link>
                </li>
                <li>
                  <Link to="/courses?category=AI" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> AI & Machine Learning
                  </Link>
                </li>
                <li>
                  <Link to="/courses?category=IoT" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> IoT & Electronics
                  </Link>
                </li>
                <li>
                  <Link to="/courses?category=Coding" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Advanced Coding
                  </Link>
                </li>
                <li>
                  <Link to="/courses?category=AppDev" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> App Development
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-robitro-yellow">👥 Community</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/community" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Forum
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Projects
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Events
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Competitions
                  </Link>
                </li>
                <li>
                  <Link to="/community" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Mentorship
                  </Link>
                </li>
              </ul>
            </div>

            {/* Partners */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-robitro-yellow">🤝 Partners</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/partner-signup" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Become a Partner
                  </Link>
                </li>
                <li>
                  <Link to="/partner-signup" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> School Programme
                  </Link>
                </li>
                <li>
                  <Link to="/partner-signup" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Franchise Opportunity
                  </Link>
                </li>
                <li>
                  <Link to="/partner-signup" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Institute Tie-up
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold mb-6 text-robitro-yellow">💬 Support</h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Help Center
                  </a>
                </li>
                <li>
                  <Link to="/privacy" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/cookies" className="text-white/80 hover:text-robitro-yellow transition-colors flex items-center gap-2">
                    <span className="text-sm">→</span> Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/20 pt-8">
            {/* Bottom Footer */}
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/70 text-sm mb-4 md:mb-0">
                © {currentYear} Robitro - Minds in Motion. All rights reserved. 🤖
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <Link to="/privacy" className="text-white/70 hover:text-robitro-yellow transition-colors">
                  Privacy
                </Link>
                <Link to="/terms" className="text-white/70 hover:text-robitro-yellow transition-colors">
                  Terms
                </Link>
                <Link to="/cookies" className="text-white/70 hover:text-robitro-yellow transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
