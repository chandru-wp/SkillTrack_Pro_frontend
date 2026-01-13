import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { createEntry, getOptions } from '../services/api'

// Custom Dropdown Component
const CustomDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false)
  
  const selectedOption = options.find(o => o.value === value)

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-3.5 bg-slate-50 border ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200'} rounded-xl text-left flex justify-between items-center transition-all`}
      >
        <span className={`text-sm font-medium ${selectedOption ? 'text-slate-800' : 'text-slate-400'}`}>
          {selectedOption ? selectedOption.value : placeholder}
        </span>
        <svg className={`w-5 h-5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fade-down">
            {options.map((option) => (
              <button
                key={option.id || option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                className={`w-full px-5 py-3 text-left text-sm font-medium transition-colors hover:bg-slate-50 flex items-center justify-between ${
                  value === option.value ? 'text-blue-600 bg-blue-50/50' : 'text-slate-600'
                }`}
              >
                {option.value}
                {value === option.value && (
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-5 py-3 text-sm text-slate-400 italic">No options available</div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

const AddEntry = () => {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [skillOptions, setSkillOptions] = useState([])
  const [resultOptions, setResultOptions] = useState([])
  const [practiceTypes, setPracticeTypes] = useState([])
  const [formData, setFormData] = useState({
    skill: '',
    hoursSpent: '',
    dateRange: { start: '', end: '' },
    practiceType: [],
    projectName: '', // New field
    otherPracticeType: '', // New field
    resultAchieved: '',
    notes: ''
  })

  useEffect(() => {
    fetchOptions()
  }, [])

  const fetchOptions = async () => {
    try {
      const options = await getOptions()
      setSkillOptions(options.filter(o => o.type === 'skill'))
      setResultOptions(options.filter(o => o.type === 'result'))
      
      const fetchedPracticeTypes = options.filter(o => o.type === 'practiceType')
      setPracticeTypes(fetchedPracticeTypes.map(o => ({
           value: o.value, 
           icon: o.label || '📌',
           image: o.image || null
      })))
    } catch (error) {
      console.error('Failed to fetch options:', error)
    }
  }

  const togglePracticeType = (type) => {
    setFormData(prev => {
      const types = prev.practiceType.includes(type)
        ? prev.practiceType.filter(t => t !== type)
        : [...prev.practiceType, type]
      return { ...prev, practiceType: types }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      const userId = user?.id || 'test123'

      const entryData = {
        userId: userId,
        skills: [formData.skill],
        hoursSpent: parseInt(formData.hoursSpent),
        startDate: formData.dateRange.start,
        endDate: formData.dateRange.end,
        practiceType: formData.practiceType, // Send array directly
        projectName: formData.practiceType.includes('Work on a Project') ? formData.projectName : null,
        otherPracticeType: formData.practiceType.includes('Other') ? formData.otherPracticeType : null,
        result: formData.resultAchieved ? [formData.resultAchieved] : [],
        notes: formData.notes
      }
      
      await createEntry(entryData)
      setShowSuccess(true)
      
      // Reset form fields
      setFormData({
        skill: '',
        hoursSpent: '',
        dateRange: { start: '', end: '' },
        practiceType: [],
        projectName: '',
        otherPracticeType: '',
        resultAchieved: '',
        notes: ''
      })

      // Hide success message after 4 seconds
      setTimeout(() => setShowSuccess(false), 4000)
      
    } catch (error) {
       console.error('Failed to create entry:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-12 flex justify-center p-4 md:p-8">
        <div className="relative w-full max-w-3xl">
          
          <div className="card-clean p-8 md:p-10 animate-fade-up border border-slate-100 shadow-xl bg-white rounded-2xl">
             {/* Header */}
            <div className="text-center mb-10">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Log Practice Session
              </h1>
              <p className="text-slate-500 font-medium">Record your learning activities and track your growth.</p>
            </div>

            {showSuccess && (
              <div className="mb-8 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 font-bold animate-fade-down">
                <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span>Log Saved Successfully! All fields have been cleared.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Skill & Time */}
              <div className="space-y-6">
                <div className="space-y-3 relative z-20">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                    Skill Focus <span className="text-red-500">*</span>
                  </label>
                  <CustomDropdown
                    options={skillOptions}
                    value={formData.skill}
                    onChange={(val) => setFormData({...formData, skill: val})}
                    placeholder="Select a skill"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                    Time Spent (Hours) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    step="0.5"
                    placeholder="e.g. 2.5"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm placeholder-slate-400"
                    value={formData.hoursSpent}
                    onChange={(e) => setFormData({...formData, hoursSpent: e.target.value})}
                    required
                  />
                </div>
              </div>

               {/* Date Range */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                  Date Range <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="date"
                    className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                    value={formData.dateRange.start}
                    onChange={(e) => setFormData({...formData, dateRange: { ...formData.dateRange, start: e.target.value }})}
                    required
                  />
                  <input
                    type="date"
                    className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm"
                    value={formData.dateRange.end}
                    onChange={(e) => setFormData({...formData, dateRange: { ...formData.dateRange, end: e.target.value }})}
                    required
                  />
                </div>
              </div>

              {/* Skill Selection (PRACTICE TYPE) */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                  Session Type (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {practiceTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => togglePracticeType(type.value)}
                      className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold transition-all border ${
                        formData.practiceType.includes(type.value)
                           ? 'bg-slate-800 text-white border-slate-800 shadow-md ring-2 ring-slate-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}

                    >
                      {type.image ? (
                        <img src={type.image} alt={type.value} className="w-8 h-8 object-cover rounded-md mb-1" />
                      ) : (
                        <span className="text-xl">{type.icon}</span>
                      )}
                      <span className="text-xs text-center">{type.value}</span>
                    </button>
                  ))}
                </div>

                {/* Conditional Fields */}
                <div className="space-y-4 pt-2">
                  {formData.practiceType.includes('Work on a Project') && (
                    <div className="animate-fade-up">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                        Project Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Portfolio Website, Task Manager App..."
                        value={formData.projectName}
                        onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                        className="w-full mt-2 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm placeholder-slate-400"
                        required
                      />
                    </div>
                  )}

                  {formData.practiceType.includes('Other') && (
                    <div className="animate-fade-up">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                        Specify "Other" <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Please specify..."
                        value={formData.otherPracticeType}
                        onChange={(e) => setFormData({...formData, otherPracticeType: e.target.value})}
                        className="w-full mt-2 px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-sm placeholder-slate-400"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>

               {/* Result Achieved */}
              <div className="space-y-3 relative z-10">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                  Result / Outcome
                </label>
                <CustomDropdown
                    options={[...resultOptions, { id: 'other', value: 'Other' }]}
                    value={formData.resultAchieved}
                    onChange={(val) => setFormData({...formData, resultAchieved: val})}
                    placeholder="Select result (optional)"
                  />
              </div>

              {/* Notes */}
              <div className="space-y-3 relative z-0">
                <label className="text-sm font-bold text-slate-700 uppercase tracking-wide ml-1">
                  Session Notes
                </label>
                <textarea
                  rows="4"
                  placeholder="What did you learn? Any challenges faced?"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm resize-none placeholder-slate-400"
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex gap-4">
                 <button
                  type="button"
                  onClick={() => navigate('/entries')}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800 rounded-xl font-bold text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {isSubmitting ? 'Saving...' : 'Save Practice Log'}
                  {!isSubmitting && (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default AddEntry
