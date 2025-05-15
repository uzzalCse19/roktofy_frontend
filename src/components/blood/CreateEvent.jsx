import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import apiClient from '../../services/http';
import { useNavigate } from 'react-router-dom';

const CreateEvent = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/events/', data);
      alert('Event created successfully!');
      navigate('/dashboard/events'); // Redirect to events list or dashboard
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-center mb-6">Create Blood Donation Event</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-lg shadow-md space-y-5">
        <div>
          <label className="block mb-1 font-medium">Blood Type</label>
          <select
            {...register('blood_type', { required: true })}
            className="w-full border border-gray-300 p-2 rounded"
          >
            <option value="">Select blood type</option>
            <option value="A+">A+</option>
            <option value="A−">A−</option>
            <option value="B+">B+</option>
            <option value="B−">B−</option>
            <option value="AB+">AB+</option>
            <option value="AB−">AB−</option>
            <option value="O+">O+</option>
            <option value="O−">O−</option>
          </select>
          {errors.blood_type && <p className="text-red-600 text-sm mt-1">Blood type is required</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Required Date</label>
          <input
            type="date"
            {...register('required_date', { required: true })}
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.required_date && <p className="text-red-600 text-sm mt-1">Date is required</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            {...register('location', { required: true })}
            placeholder="Hospital / Area"
            className="w-full border border-gray-300 p-2 rounded"
          />
          {errors.location && <p className="text-red-600 text-sm mt-1">Location is required</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium">Message (Optional)</label>
          <textarea
            {...register('message')}
            placeholder="Any additional message..."
            className="w-full border border-gray-300 p-2 rounded"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
