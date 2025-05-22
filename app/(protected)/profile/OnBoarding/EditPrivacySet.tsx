import React from 'react';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';

const EditPrivacySet = () => {
  const currentProfile = useCurrentProfile();
  const { updatePrivacySettings } = useProfileStore();
  
  if (!currentProfile || !currentProfile.privacySettings) {
    return <div>Loading...</div>;
  }
  
  const handleVisibilityChange = (value: 'public' | 'friends' | 'private') => {
    if (currentProfile.id) {
      updatePrivacySettings(
        currentProfile.id, 
        { profileVisibility: value }
      );
    }
  };
  
  const handleToggle = (setting: 'locationSharing' | 'dataSharingWithPartners') => {
    if (currentProfile.id) {
      updatePrivacySettings(
        currentProfile.id, 
        { [setting]: !currentProfile.privacySettings[setting] }
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Privacy Settings</h2>
      <p className="text-gray-600 mb-6">
        Control who can see your profile and how your data is used
      </p>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Profile Visibility</h3>
        <p className="text-gray-500 text-sm mb-3">
          Choose who can see your profile information
        </p>
        
        <div className="space-y-2">
          <RadioOption
            id="visibility-public"
            name="visibility"
            value="public"
            label="Public"
            description="Anyone can view your profile"
            checked={currentProfile.privacySettings.profileVisibility === 'public'}
            onChange={() => handleVisibilityChange('public')}
          />
          
          <RadioOption
            id="visibility-friends"
            name="visibility"
            value="friends"
            label="Friends Only"
            description="Only your connections can view your profile"
            checked={currentProfile.privacySettings.profileVisibility === 'friends'}
            onChange={() => handleVisibilityChange('friends')}
          />
          
          <RadioOption
            id="visibility-private"
            name="visibility"
            value="private"
            label="Private"
            description="Your profile is hidden from everyone"
            checked={currentProfile.privacySettings.profileVisibility === 'private'}
            onChange={() => handleVisibilityChange('private')}
          />
        </div>
      </div>
      
      <div className="space-y-4 mb-6">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="location-sharing"
              type="checkbox"
              checked={currentProfile.privacySettings.locationSharing}
              onChange={() => handleToggle('locationSharing')}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="location-sharing" className="font-medium text-gray-700">
              Location Sharing
            </label>
            <p className="text-gray-500">Allow friends to see your current location when traveling</p>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="data-sharing"
              type="checkbox"
              checked={currentProfile.privacySettings.dataSharingWithPartners}
              onChange={() => handleToggle('dataSharingWithPartners')}
              className="h-4 w-4 text-green-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="data-sharing" className="font-medium text-gray-700">
              Data Sharing with Partners
            </label>
            <p className="text-gray-500">Allow us to share your data with trusted travel partners for personalized offers</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <button 
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

interface RadioOptionProps {
  id: string;
  name: string;
  value: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const RadioOption = ({ id, name, value, label, description, checked, onChange }: RadioOptionProps) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={id}
          name={name}
          type="radio"
          value={value}
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-green-600 border-gray-300"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={id} className="font-medium text-gray-700">
          {label}
        </label>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default EditPrivacySet;