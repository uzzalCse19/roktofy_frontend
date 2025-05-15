import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();


  useEffect(() => {
    axios.get('/profile/', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      },
    })
    .then(res => {
      setProfile(res.data);
      for (const key in res.data) {
        setValue(key, res.data[key]);
      }
      if (res.data.avatar) setAvatarPreview(res.data.avatar);
    })
    .catch(err => console.error(err));
  }, [setValue]);

  const onSubmit = async (data) => {
    const formData = new FormData();

    for (const key in data) {
      if (key === "avatar" && data.avatar instanceof FileList && data.avatar.length > 0) {
        formData.append("avatar", data.avatar[0]);
      } else {
        formData.append(key, data[key]);
      }
    }

    try {
      const res = await axios.patch(`/profile/${profile.id}/`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access')}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      alert("Profile updated successfully");
      setProfile(res.data);
      if (res.data.avatar) setAvatarPreview(res.data.avatar);
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      {profile ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Email (read-only):</label>
            <input disabled {...register("email")} className="input input-bordered w-full" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>First Name</label>
              <input {...register("first_name")} className="input input-bordered w-full" />
            </div>
            <div>
              <label>Last Name</label>
              <input {...register("last_name")} className="input input-bordered w-full" />
            </div>
            <div>
              <label>Phone</label>
              <input {...register("phone")} className="input input-bordered w-full" />
            </div>
            <div>
              <label>User Type</label>
              <select {...register("user_type")} className="select select-bordered w-full">
                <option value="donor">Donor</option>
                <option value="recipient">Recipient</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label>Age</label>
              <input type="number" {...register("age")} className="input input-bordered w-full" />
            </div>
            <div>
              <label>Last Donation Date</label>
              <input type="date" {...register("last_donation_date")} className="input input-bordered w-full" />
            </div>
            <div>
              <label>Blood Type</label>
              <input {...register("blood_type")} className="input input-bordered w-full" />
            </div>
            <div>
              <label>Available to Donate?</label>
              <select {...register("is_available")} className="select select-bordered w-full">
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
          </div>

          <div>
            <label>Health Conditions</label>
            <textarea {...register("health_conditions")} className="textarea textarea-bordered w-full" />
          </div>

          <div>
            <label>Avatar</label>
            <input type="file" {...register("avatar")} className="file-input file-input-bordered w-full" />
            {avatarPreview && (
              <img src={avatarPreview} alt="Avatar" className="mt-2 w-24 h-24 rounded-full object-cover" />
            )}
          </div>

          <button disabled={isSubmitting} type="submit" className="btn btn-primary w-full">
            {isSubmitting ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ProfilePage;
