import React, { useState } from 'react';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const CreateBloodEvent = ({ onEventCreated }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        blood_type: '',
        message: '',
        required_date: '',
        location: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('/blood-events/', formData);
            onEventCreated(response.data);
            setFormData({
                blood_type: '',
                message: '',
                required_date: '',
                location: '',
            });
        } catch (err) {
            setError(err.response?.data || 'Failed to create event');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Create Blood Donation Event</h2>
            
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                    {typeof error === 'object' ? JSON.stringify(error) : error}
                </div>
            )}
            
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="blood_type">
                            Blood Type Needed
                        </label>
                        <select
                            id="blood_type"
                            name="blood_type"
                            value={formData.blood_type}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        >
                            <option value="">Select Blood Type</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                        </select>
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2" htmlFor="required_date">
                            Required Date
                        </label>
                        <input
                            type="date"
                            id="required_date"
                            name="required_date"
                            value={formData.required_date}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    
                    <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 mb-2" htmlFor="location">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Hospital or donation center address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            required
                        />
                    </div>
                    
                    <div className="mb-4 md:col-span-2">
                        <label className="block text-gray-700 mb-2" htmlFor="message">
                            Additional Information
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Any special requirements or details..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        ></textarea>
                    </div>
                </div>
                
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition duration-300 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Event'}
                </button>
            </form>
        </div>
    );
};

export default CreateBloodEvent;