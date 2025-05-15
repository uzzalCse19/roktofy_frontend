import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import ProfileForm from "./ProfileForm";
import ProfileButtons from "./ProfileButtons";
import PasswordChangeForm from "./PasswordChangeForm";
import useAuthContext from "../../hooks/useAuthContext";
import Alert from "../../components/common/Alert";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const {
    user,
    updateUserProfile,
    changePassword,
    errorMsg,
    isLoading,
    fetchUserProfile
  } = useAuthContext();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      first_name: '',
      last_name: '',
      address: '',
      phone: '',
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  
  useEffect(() => {
    if (user) {
      const fieldsToUpdate = ['first_name', 'last_name', 'email', 'address', 'phone'];
      fieldsToUpdate.forEach((key) => {
        if (user[key] !== undefined) {
          setValue(key, user[key]);
        }
      });
    }
  }, [user, setValue]);

  const handleProfileUpdate = async (data) => {
    try {
 
      const profilePayload = {
        first_name: data.first_name,
        last_name: data.last_name,
        address: data.address,
        phone: data.phone,
      };

      const profileResult = await updateUserProfile(profilePayload);
      if (!profileResult?.success) return;


      if (data.current_password && data.new_password) {
        const passwordResult = await changePassword({
          current_password: data.current_password,
          new_password: data.new_password,
        });
        
        if (passwordResult?.success) {
          reset({
            current_password: '',
            new_password: '',
            confirm_password: ''
          });
        }
      }

      setIsEditing(false);
      await fetchUserProfile(); 
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
        <div className="card-body">
          <Alert error="No user data available. Please try logging in again." />
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full max-w-2xl mx-auto bg-base-100 shadow-xl">
      <div className="card-body space-y-4">
        {errorMsg && <Alert error={errorMsg} />}
        
        <header>
          <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
          <p className="text-gray-600">
            {isEditing ? "Update your information" : "View your profile details"}
          </p>
        </header>

        <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
          <ProfileForm
            register={register}
            errors={errors}
            isEditing={isEditing}
          />

          <PasswordChangeForm
            errors={errors}
            register={register}
            isEditing={isEditing}
            watch={watch}
          />

          <ProfileButtons
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isSubmitting={isSubmitting || isLoading}
          />
        </form>
      </div>
    </div>
  );
};

export default Profile;