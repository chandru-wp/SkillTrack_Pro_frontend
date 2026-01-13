import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { getAllEntries } from '../services/api'

const MyEntries = () => {
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [entries, setEntries] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    setCurrentUser(user)

    const fetchAllData = async () => {
      try {
        const data = await getAllEntries() 
        setEntries(data)
      } catch (error) {
        console.error('Error fetching entries:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const userId = currentUser?.id || 'test123'

  // Calculate summary data dynamically from real backend entries
  const yourEntries = entries.filter(e => e.userId === userId)
  const othersEntries = entries.filter(e => e.userId !== userId)

  const summaryData = {
    submittedByYou: {
      count: yourEntries.length,
      totalHours: yourEntries.reduce((sum, e) => sum + e.hoursSpent, 0),
      avgHours: yourEntries.length > 0 ? Math.round(yourEntries.reduce((sum, e) => sum + e.hoursSpent, 0) / yourEntries.length) : 0
    },
    submittedByOthers: {
      count: othersEntries.length,
      totalHours: othersEntries.reduce((sum, e) => sum + e.hoursSpent, 0),
      avgHours: othersEntries.length > 0 ? Math.round(othersEntries.reduce((sum, e) => sum + e.hoursSpent, 0) / othersEntries.length) : 0
    }
  }

  // Row-wise grouping for the table
  const skillSummary = entries.reduce((acc, entry) => {
    entry.skills.forEach(skill => {
      if (!acc[skill]) {
        acc[skill] = { skill, yourHours: 0, othersHours: 0, othersSessions: 0 }
      }
      if (entry.userId === userId) {
        acc[skill].yourHours += entry.hoursSpent
      } else {
        acc[skill].othersHours += entry.hoursSpent
        acc[skill].othersSessions += 1
      }
    })
    return acc
  }, {})

  const skillSummaryArray = Object.values(skillSummary).map(item => ({
    ...item,
    submittedByYou: `${item.yourHours}h`,
    submittedByOthers: `${item.othersSessions > 0 ? (item.othersHours / item.othersSessions).toFixed(1) : 0}h`
  }))

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-12 relative overflow-hidden flex justify-center">
        
        {/* Subtle Background Elements for visual interest */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-100/50 rounded-full mix-blend-multiply filter blur-[80px] opacity-60 animate-blob animation-delay-2000"></div>

        <div className="w-full max-w-7xl px-6 sm:px-8 lg:px-12 relative z-10">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 animate-fade-up gap-6 md:gap-0">
            <div className="text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 tracking-tight mb-2">
                Performance Dashboard
              </h1>
              <p className="text-slate-500 font-medium text-lg">Detailed analysis of your professional growth.</p>
            </div>
            
            {/* Date Filters - refined */}
            <div className="w-full md:w-auto flex justify-center md:justify-end">
              <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200/60 backdrop-blur-sm">
                <div className="px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1 text-center md:text-left">Period</span>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer w-full sm:w-auto"
                    />
                    <span className="text-slate-300 font-light hidden sm:inline">|</span>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="bg-transparent text-sm font-bold text-slate-700 outline-none cursor-pointer w-full sm:w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 animate-fade-up" style={{animationDelay: '0.1s'}}>
            {/* Personal Stats */}
            <div className="card-clean p-8 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-blue-500">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <svg className="w-40 h-40 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-blue-600 text-xs font-bold uppercase tracking-widest mb-1">Your Activity</h3>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">Personal Stats</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                  <div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-5xl font-black text-slate-800 tracking-tighter">{summaryData.submittedByYou.totalHours}</span>
                      <span className="text-sm font-bold text-slate-500 uppercase">hours</span>
                    </div>
                    <p className="text-sm font-medium text-slate-400">Total Investment</p>
                  </div>
                  <div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-5xl font-black text-blue-600 tracking-tighter">{summaryData.submittedByYou.count}</span>
                      <span className="text-sm font-bold text-blue-400 uppercase">logs</span>
                    </div>
                    <p className="text-sm font-medium text-slate-400">Sessions Completed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Stats */}
            <div className="card-clean p-8 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-t-slate-500">
               <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
                <svg className="w-40 h-40 text-slate-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3.5 bg-slate-800 rounded-2xl shadow-lg shadow-slate-800/20 text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                   <div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Network Activity</h3>
                    <p className="text-2xl font-black text-slate-800 tracking-tight">Team Overview</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-6">
                  <div>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-5xl font-black text-slate-800 tracking-tighter">{summaryData.submittedByOthers.avgHours}</span>
                      <span className="text-sm font-bold text-slate-500 uppercase">hours</span>
                    </div>
                    <p className="text-sm font-medium text-slate-400">Avg Time / Member</p>
                  </div>
                  <div>
                     <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="text-5xl font-black text-slate-500 tracking-tighter">{summaryData.submittedByOthers.count}</span>
                      <span className="text-sm font-bold text-slate-400 uppercase">total</span>
                    </div>
                    <p className="text-sm font-medium text-slate-400">Team Entries</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* New Skill Summary Table */}
          <div className="card-clean overflow-hidden mb-10 animate-fade-up shadow-sm hover:shadow-md transition-shadow" style={{animationDelay: '0.2s'}}>
            <div className="px-8 py-6 border-b border-slate-100 bg-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Skill Proficiency Breakdown</h2>
                <p className="text-sm text-slate-500 mt-1">Comparison of your time investment vs team average</p>
              </div>
              <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors">Download Report</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200/60">
                    <th className="text-left px-8 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Skill Focus</th>
                    <th className="text-left px-8 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Your Investment</th>
                    <th className="text-left px-8 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Team Average</th>
                    <th className="text-right px-8 py-4 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {skillSummaryArray.length > 0 ? (
                      skillSummaryArray.map((item, index) => (
                        <tr key={index} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-8 py-5">
                            <span className="text-sm font-bold text-slate-700 group-hover:text-blue-700 transition-colors">{item.skill}</span>
                          </td>
                          <td className="px-8 py-5">
                             <div className="flex items-center gap-3">
                               <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min(item.yourHours / 10 * 100, 100)}%` }}></div>
                               </div>
                               <span className="text-sm font-bold text-slate-800">{item.submittedByYou}</span>
                             </div>
                          </td>
                          <td className="px-8 py-5">
                             <span className="text-sm font-medium text-slate-500">{item.submittedByOthers}</span>
                          </td>
                          <td className="px-8 py-5 text-right">
                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                               On Track
                             </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="px-8 py-16 text-center text-slate-400 italic">
                           Start logging entries to see your skill breakdown.
                        </td>
                      </tr>
                    )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Entries */}
           <div className="animate-fade-up" style={{animationDelay: '0.3s'}}>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Recent Activity</h2>
               <div className="h-px bg-slate-200 flex-1 ml-8"></div>
             </div>
             
             <div className="grid gap-4">
              {isLoading ? (
                 <div className="text-center py-20">
                    <div className="inline-block animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
                    <p className="text-slate-400 font-medium">Loading entries...</p>
                 </div>
              ) : entries.length === 0 ? (
                 <div className="card-clean p-12 text-center border-dashed border-2 border-slate-200 bg-slate-50/50">
                    <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium text-lg mb-2">No activity logged yet</p>
                    <p className="text-slate-400 text-sm">Start by adding your first practice session.</p>
                 </div>
              ) : (
                entries.map((entry) => (
                  <div key={entry.id} className="card-clean p-6 hover:shadow-lg hover:border-blue-200 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 group cursor-pointer">
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                        <span className="text-xl font-bold">{entry.hoursSpent}</span>
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-lg font-bold text-slate-800 group-hover:text-blue-700 transition-colors">{entry.skills.join(', ')}</h3>
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] uppercase font-bold tracking-wider rounded-full">{entry.practiceType.join(', ')}</span>
                         </div>
                         <p className="text-slate-500 text-sm font-medium">
                           {new Date(entry.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} <span className="text-slate-300 mx-1">•</span> {new Date(entry.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                         </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 pl-17 md:pl-0 border-t md:border-0 border-slate-100 pt-4 md:pt-0">
                       <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                          entry.hoursSpent > 4 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'
                       }`}>
                         {entry.hoursSpent > 4 ? 'Deep Work' : 'Session'}
                       </span>
                       <svg className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                       </svg>
                    </div>
                  </div>
                ))
              )}
             </div>
           </div>
        </div>
      </div>
    </>
  )
}

export default MyEntries
