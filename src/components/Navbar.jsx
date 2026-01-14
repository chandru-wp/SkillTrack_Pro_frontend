import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link 
            to={localStorage.getItem('user') 
              ? (JSON.parse(localStorage.getItem('user')).role === 'admin' || JSON.parse(localStorage.getItem('user')).role === 'super_admin' 
                ? '/admin01' 
                : '/add-entry01')
              : '/login'
            } 
            className="flex items-center gap-3 group"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 transform group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <div>
              <span className="text-slate-800 text-lg sm:text-xl font-bold tracking-tight">
                SkillTrack
              </span>
              <span className="text-blue-600 text-lg sm:text-xl font-bold">Pro</span>
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link 
              to="/add-entry01" 
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                isActive('/add-entry01')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <svg className={`w-4 h-4 ${isActive('/add-entry01') ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Entry
            </Link>
            
            <Link 
              to="/entries01" 
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                isActive('/entries01')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
               <svg className={`w-4 h-4 ${isActive('/entries01') ? 'text-blue-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              My Entries
            </Link>

            {/* Admin Dashboard - Only visible to admins */}
            {localStorage.getItem('user') && (JSON.parse(localStorage.getItem('user')).role === 'admin' || JSON.parse(localStorage.getItem('user')).role === 'super_admin') && (
              <Link
                to="/admin01"
                className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all flex items-center gap-2 ${
                  isActive('/admin01')
                    ? 'bg-purple-50 text-purple-700'
                    : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                }`}
              >
                <svg className={`w-4 h-4 ${isActive('/admin01') ? 'text-purple-600' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Admin
              </Link>
            )}

            <div className="w-px h-8 bg-slate-200 mx-3"></div>
            
            <button 
              onClick={handleLogout}
              className="px-5 py-2.5 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100 animate-fade-down">
            <div className="flex flex-col gap-2">
              <Link 
                to="/add-entry01" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${
                  isActive('/add-entry01')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive('/add-entry01') ? 'bg-blue-100' : 'bg-slate-100'}`}>
                  <svg className={`w-5 h-5 ${isActive('/add-entry01') ? 'text-blue-600' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Add Entry
              </Link>
              
              <Link 
                to="/entries01" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${
                  isActive('/entries01')
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                 <div className={`p-1.5 rounded-lg ${isActive('/entries01') ? 'bg-blue-100' : 'bg-slate-100'}`}>
                   <svg className={`w-5 h-5 ${isActive('/entries01') ? 'text-blue-600' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                My Entries
              </Link>

              {localStorage.getItem('user') && (JSON.parse(localStorage.getItem('user')).role === 'admin' || JSON.parse(localStorage.getItem('user')).role === 'super_admin') && (
                <Link
                  to="/admin01"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-semibold rounded-xl transition-all flex items-center gap-3 ${
                    isActive('/admin01')
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-slate-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg ${isActive('/admin01') ? 'bg-purple-100' : 'bg-slate-100'}`}>
                    <svg className={`w-5 h-5 ${isActive('/admin01') ? 'text-purple-600' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Admin Dashboard
                </Link>
              )}

              <button 
                onClick={handleLogout}
                className="px-4 py-3 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-3 w-full text-left"
              >
                <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-red-100">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
