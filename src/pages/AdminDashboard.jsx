import { useState, useEffect } from 'react'
import { getAllUsers, updateUser, getOptions, createOption, deleteOption, createUser, updateOption, deleteUser } from '../services/api'
import Navbar from '../components/Navbar'

const AdminDashboard = () => {
    const [users, setUsers] = useState([])
    const [options, setOptions] = useState([])
    const [activeTab, setActiveTab] = useState('users') // 'users' or 'options'
    const [loading, setLoading] = useState(true)
    
    // User Management State
    const [editingUser, setEditingUser] = useState(null)
    const [creatingUser, setCreatingUser] = useState(false)
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        role: 'user',
        password: '',
        name: ''
    })
    
    // Options form state
    const [optionForm, setOptionForm] = useState({
        type: 'skill', // 'skill', 'result', or 'practiceType'
        value: '',
        label: '', // Used for icon in practiceType
        image: ''
    })

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setOptionForm(prev => ({ ...prev, image: reader.result }))
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [usersData, optionsData] = await Promise.all([
                getAllUsers(),
                getOptions()
            ])
            setUsers(usersData)
            setOptions(optionsData)
        } catch (error) {
            console.error('Failed to fetch data:', error)
        } finally {
            setLoading(false)
        }
    }

    // User Handlers
    const handleEdit = (user) => {
        setEditingUser(user)
        setFormData({
            username: user.username,
            email: user.email,
            role: user.role,
            password: '',
            name: user.name || ''
        })
    }

    const openCreateUserInModal = () => {
        setCreatingUser(true)
        setFormData({
            username: '',
            email: '',
            role: 'user',
            password: '',
            name: ''
        })
    }

    const handleSaveUser = async (e) => {
        e.preventDefault()
        try {
            if (editingUser) {
                await updateUser(editingUser.id, formData)
            } else {
                await createUser(formData)
            }
            setEditingUser(null)
            setCreatingUser(false)
            fetchData() 
        } catch (error) {
            console.error('Failed to save user:', error)
            const message = error.response?.data?.message || 'Failed to save user'
            alert(message)
        }
    }

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Are you sure you want to delete user "${user.username}"?`)) return
        
        try {
            await deleteUser(user.id)
            fetchData() 
        } catch (error) {
            console.error('Failed to delete user:', error)
            const message = error.response?.data?.message || 'Failed to delete user'
            alert(message)
        }
    }

    // Option Handlers
    const handleEditOption = (option) => {
        setOptionForm({
            id: option.id,
            type: option.type,
            value: option.value,
            label: option.label || '',
            image: option.image || ''
        })
    }

    const handleAddOption = async (e) => {
        e.preventDefault()
        if (!optionForm.value.trim()) return

        try {
            if (optionForm.id) {
                await updateOption(optionForm.id, optionForm)
            } else {
                await createOption(optionForm)
            }
            setOptionForm({ type: 'skill', value: '', label: '', image: '' }) 
            fetchData()
        } catch (error) {
            console.error('Failed to save option:', error)
        }
    }

    const handleDeleteOption = async (id) => {
        if (!window.confirm('Are you sure you want to delete this option?')) return
        try {
            await deleteOption(id)
            fetchData()
        } catch (error) {
            console.error('Failed to delete option:', error)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Dashboard</h1>
                        <p className="text-slate-500 mt-2">Manage users and system configurations</p>
                    </div>
                    
                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'users' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('options')}
                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                                activeTab === 'options' 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            System Options
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="space-y-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                        <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                                        Regular Users
                                    </h2>
                                    <button 
                                        onClick={openCreateUserInModal}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg shadow-lg shadow-blue-500/30 transition-all flex items-center gap-2"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        Create New User
                                    </button>
                                </div>

                                {/* Regular Users Table */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-up">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Joined</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {users.filter(u => u.role === 'user').map((user) => (
                                                    <tr key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center">
                                                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3">
                                                                    {user.username.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <div className="font-bold text-slate-900">{user.username}</div>
                                                                    <div className="text-xs text-slate-500">ID: {user.id.slice(-6)}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                                        <td className="px-6 py-4 text-sm text-slate-500">
                                                            {new Date(user.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 text-right">
                                                            <div className="flex justify-end gap-3">
                                                                <button 
                                                                    onClick={() => handleEdit(user)}
                                                                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleDeleteUser(user)}
                                                                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {users.filter(u => u.role === 'user').length === 0 && (
                                                    <tr><td colSpan="4" className="px-6 py-10 text-center text-slate-400 italic">No regular users found.</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 mb-6">
                                        <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                                        Administrators
                                    </h2>
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-fade-up">
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50 border-b border-slate-200">
                                                    <tr>
                                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Admin</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-100">
                                                    {users.filter(u => u.role === 'admin' || u.role === 'super_admin').map((user) => (
                                                        <tr key={user.id} className={`hover:bg-slate-50/50 transition-colors ${user.role === 'super_admin' ? 'bg-amber-50/30' : ''}`}>
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold mr-3 ${
                                                                        user.role === 'super_admin' ? 'bg-amber-100 text-amber-700' : 'bg-purple-100 text-purple-700'
                                                                    }`}>
                                                                        {user.username.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-900">{user.username}</div>
                                                                        <div className="text-xs text-slate-500">ID: {user.id.slice(-6)}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                                                    user.role === 'super_admin' 
                                                                    ? 'bg-amber-100 text-amber-800 border border-amber-200 shadow-sm' 
                                                                    : 'bg-purple-100 text-purple-800 border border-purple-200'
                                                                }`}>
                                                                    {user.role.replace('_', ' ')}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-slate-600">{user.email}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                {user.role !== 'super_admin' ? (
                                                                    <div className="flex justify-end gap-3">
                                                                        <button 
                                                                            onClick={() => handleEdit(user)}
                                                                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                                                                        >
                                                                            Edit
                                                                        </button>
                                                                        <button 
                                                                            onClick={() => handleDeleteUser(user)}
                                                                            className="text-red-500 hover:text-red-700 font-medium text-sm"
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-xs text-amber-600 font-bold tracking-tight uppercase px-2 py-1 bg-amber-50 rounded">🔥 Main Admin</span>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Options Tab */}
                        {activeTab === 'options' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-up">
                                {/* Add Option Form */}
                                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-fit">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">{optionForm.id ? 'Edit Option' : 'Add New Option'}</h3>
                                    <form onSubmit={handleAddOption} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Type</label>
                                            <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-200">
                                                <button type="button" onClick={() => setOptionForm({ ...optionForm, type: 'skill' })} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${optionForm.type === 'skill' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Skill</button>
                                                <button type="button" onClick={() => setOptionForm({ ...optionForm, type: 'result' })} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${optionForm.type === 'result' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Result</button>
                                                <button type="button" onClick={() => setOptionForm({ ...optionForm, type: 'practiceType' })} className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${optionForm.type === 'practiceType' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Session</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Value / Name</label>
                                            <input
                                                type="text"
                                                value={optionForm.value}
                                                onChange={(e) => setOptionForm({ ...optionForm, value: e.target.value })}
                                                placeholder={`e.g., ${optionForm.type === 'skill' ? 'React.js' : 'Attend Training'}`}
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                required
                                            />
                                        </div>
                                        {optionForm.type === 'practiceType' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-down">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1">Icon (Emoji)</label>
                                                    <input
                                                        type="text"
                                                        value={optionForm.label}
                                                        onChange={(e) => setOptionForm({ ...optionForm, label: e.target.value })}
                                                        placeholder="e.g., 🎓"
                                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1">Image (Optional)</label>
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={handleImageChange}
                                                            className="hidden"
                                                            id="option-image-upload"
                                                        />
                                                        <label 
                                                            htmlFor="option-image-upload"
                                                            className="flex items-center justify-center w-full px-4 py-3 bg-slate-50 border border-slate-200 border-dashed rounded-xl cursor-pointer hover:bg-slate-100 transition-colors text-sm text-slate-500 font-medium overflow-hidden"
                                                        >
                                                            {optionForm.image ? (
                                                                <div className="flex items-center gap-2">
                                                                     <img src={optionForm.image} alt="Preview" className="w-6 h-6 object-cover rounded" />
                                                                     <span className="text-blue-600">Change Image</span>
                                                                </div>
                                                            ) : (
                                                                <span className="flex items-center gap-2">
                                                                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                                    Upload Image
                                                                </span>
                                                            )}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            {optionForm.id && (
                                                <button
                                                    type="button"
                                                    onClick={() => setOptionForm({ type: 'skill', value: '', label: '' })}
                                                    className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                type="submit"
                                                className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                            >
                                                {optionForm.id ? 'Update Option' : 'Add Option'}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Options List */}
                                <div className="space-y-6">
                                    {/* Skills List */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span>Available Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {options.filter(o => o.type === 'skill').map(option => (
                                                <div key={option.id} className="group relative">
                                                    <span className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors"
                                                          onClick={() => handleEditOption(option)}>
                                                        {option.value}
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteOption(option.id); }} className="ml-2 text-blue-400 hover:text-red-500">×</button>
                                                    </span>
                                                </div>
                                            ))}
                                            {options.filter(o => o.type === 'skill').length === 0 && <p className="text-slate-400 text-sm italic">No skills added yet.</p>}
                                        </div>
                                    </div>

                                    {/* Results List */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span>Available Results</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {options.filter(o => o.type === 'result').map(option => (
                                                <div key={option.id} className="group relative">
                                                    <span className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 transition-colors"
                                                          onClick={() => handleEditOption(option)}>
                                                        {option.value}
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteOption(option.id); }} className="ml-2 text-green-400 hover:text-red-500">×</button>
                                                    </span>
                                                </div>
                                            ))}
                                            {options.filter(o => o.type === 'result').length === 0 && <p className="text-slate-400 text-sm italic">No results added yet.</p>}
                                        </div>
                                    </div>

                                     {/* Practice Type List */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span>Session Types</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {options.filter(o => o.type === 'practiceType').map(option => (
                                                <div key={option.id} className="group relative">
                                                    <span className="cursor-pointer inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-50 text-purple-700 border border-purple-100 hover:bg-purple-100 transition-colors"
                                                          onClick={() => handleEditOption(option)}>
                                                        <span className="mr-1">{option.label || '📌'}</span> {option.value}
                                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteOption(option.id); }} className="ml-2 text-purple-400 hover:text-red-500">×</button>
                                                    </span>
                                                </div>
                                            ))}
                                            {options.filter(o => o.type === 'practiceType').length === 0 && <p className="text-slate-400 text-sm italic">No session types added yet. Default hardcoded list currently used.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Create/Edit User Modal */}
            {(editingUser || creatingUser) && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-fade-up">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-slate-900">{creatingUser ? 'Create New User' : 'Edit User'}</h2>
                            <button onClick={() => { setEditingUser(null); setCreatingUser(false); }} className="text-slate-400 hover:text-slate-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSaveUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    value={formData.username}
                                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {creatingUser ? 'Password' : 'New Password (Optional)'}
                                </label>
                                <input
                                    type="password"
                                    placeholder={creatingUser ? "Enter password" : "Leave blank to keep current"}
                                    value={formData.password}
                                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    required={creatingUser}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => { setEditingUser(null); setCreatingUser(false); }}
                                    className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30"
                                >
                                    {creatingUser ? 'Create User' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminDashboard
