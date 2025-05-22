import React from 'react';
import { useProfileStore, useCurrentProfile } from '~/store/ProfileStore';

const EditNotification = () => {
  const currentProfile = useCurrentProfile();
  const { updateNotificationSettings } = useProfileStore();
  
  if (!currentProfile || !currentProfile.notifications) {
    return <div>Loading...</div>;
  }
  
  const handleToggle = (setting: keyof typeof currentProfile.notifications) => {
    if (currentProfile.id) {
      updateNotificationSettings(
        currentProfile.id, 
        { [setting]: !currentProfile.notifications[setting] }
      );
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">Notification Preferences</h2>
      <p className="text-gray-600 mb-6">
        Choose which notifications you&rsquo;d like to receive
      </p>
      
      <div className="space-y-4">
        <NotificationItem
          label="New Messages"
          description="Get notified when you receive new messages"
          checked={currentProfile.notifications.newMessages}
          onChange={() => handleToggle('newMessages')}
        />
        
        <NotificationItem
          label="Itinerary Updates"
          description="Receive updates about changes to your travel plans"
          checked={currentProfile.notifications.itineraryUpdates}
          onChange={() => handleToggle('itineraryUpdates')}
        />
        
        <NotificationItem
          label="Friend Requests"
          description="Get notified about new friend requests"
          checked={currentProfile.notifications.friendRequests}
          onChange={() => handleToggle('friendRequests')}
        />
        
        <NotificationItem
          label="Travel Deals"
          description="Receive personalized travel offers and deals"
          checked={currentProfile.notifications.travelDeals}
          onChange={() => handleToggle('travelDeals')}
        />
        
        <NotificationItem
          label="Eco Impact Updates"
          description="Get updates about your environmental impact"
          checked={currentProfile.notifications.ecoImpactUpdates}
          onChange={() => handleToggle('ecoImpactUpdates')}
        />
      </div>
      
      <div className="mt-8">
        <button 
          className="w-full py-2 px-4 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};

interface NotificationItemProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

const NotificationItem = ({ label, description, checked, onChange }: NotificationItemProps) => {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          id={label.replace(/\s+/g, '-').toLowerCase()}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 text-green-600 border-gray-300 rounded"
        />
      </div>
      <div className="ml-3 text-sm">
        <label htmlFor={label.replace(/\s+/g, '-').toLowerCase()} className="font-medium text-gray-700">
          {label}
        </label>
        <p className="text-gray-500">{description}</p>
      </div>
    </div>
  );
};

export default EditNotification;