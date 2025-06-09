'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import NavigationBar from '@/app/components/navigationBar';
import { AppConfig } from '@/types/config';

export default function ProfilePage() {
  const [config, setConfig] = useState<AppConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    occupation: '',
    phone: '',
    imageType: 'medical',
    language: 'en',
    pictureDataUrl: '',
  });
  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
  });
  const [twoFAEnabled, setTwoFAEnabled] = useState(false);

  useEffect(() => {
    fetch('/setup.json')
      .then(r => r.json())
      .then((cfg: AppConfig) => setConfig(cfg))
      .catch(console.error)
      .finally(() => setLoadingConfig(false));
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords(p => ({ ...p, [name]: value }));
  };

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setForm(f => ({ ...f, pictureDataUrl: reader.result! }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLogoutAll = () => {
    console.log('Logging out of all devices');
  };

  if (loadingConfig || !config) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900">
        <p className="text-white">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className={`
        min-h-screen ${config.appBackground}
        flex flex-col items-center pt-16 pb-24 px-4
        relative
      `}
    >
      <h1 className={`text-4xl font-bold mb-8 ${config.textColor}`}>
        User Profile
      </h1>

      <div
        className={`
          w-full max-w-lg
          p-6 border-2 border-solid ${config.borderColor}
          rounded-xl ${config.cardBackground}
        `}
      >
        {/* Profile picture */}
        <div className="flex flex-col items-center mb-6">
          {form.pictureDataUrl ? (
            <img
              src={form.pictureDataUrl}
              alt="Profile"
              className="h-32 w-32 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="h-32 w-32 rounded-full bg-gray-700 mb-2 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          <label
            className={`
              text-sm cursor-pointer underline
              ${config.textColor} hover:text-opacity-75
            `}
          >
            Change Picture
            <input
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
              disabled={!isEditing}
            />
          </label>
        </div>

        {/* Basic info */}
        <div className="space-y-4">
          <label className="block">
            <span className={`${config.textColor} font-medium`}>Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-transparent border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${config.textColor} ${!isEditing && 'opacity-50'}
              `}
            />
          </label>

          <label className="block">
            <span className={`${config.textColor} font-medium`}>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-transparent border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${config.textColor} ${!isEditing && 'opacity-50'}
              `}
            />
          </label>

          <label className="block">
            <span className={`${config.textColor} font-medium`}>Occupation</span>
            <input
              type="text"
              name="occupation"
              value={form.occupation}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-transparent border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${config.textColor} ${!isEditing && 'opacity-50'}
              `}
            />
          </label>

          <label className="block">
            <span className={`${config.textColor} font-medium`}>Phone Number</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-transparent border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${config.textColor} ${!isEditing && 'opacity-50'}
              `}
            />
          </label>

          <label className="block">
            <span className={`${config.textColor} font-medium`}>
              Types of Images
            </span>
            <select
              name="imageType"
              value={form.imageType}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-white text-black border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${!isEditing && 'opacity-50'}
              `}
            >
              <option value="medical">Medical</option>
              <option value="security">Security</option>
              <option value="engineer">Engineer</option>
              <option value="hotel">Hotel</option>
            </select>
          </label>

          <label className="block">
            <span className={`${config.textColor} font-medium`}>Language</span>
            <select
              name="language"
              value={form.language}
              onChange={handleChange}
              disabled={!isEditing}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-white text-black border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${!isEditing && 'opacity-50'}
              `}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </label>
        </div>

        {/* Edit & Save buttons */}
        <div className="mt-6 flex space-x-4">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isEditing}
            className={`
              px-4 py-2 rounded-md border ${config.borderColor}
              ${config.textColor} hover:opacity-90
              ${isEditing && 'opacity-50 cursor-not-allowed'}
            `}
          >
            Edit
          </button>
          <button
            onClick={() => setIsEditing(false)}
            disabled={!isEditing}
            className={`
              px-4 py-2 rounded-md border ${config.borderColor}
              ${config.textColor} hover:opacity-90
              ${!isEditing && 'opacity-50 cursor-not-allowed'}
            `}
          >
            Save
          </button>
        </div>

        {/* Security & Account Settings */}
        <div className="mt-8 border-t pt-6 space-y-4">
          <h2 className={`text-2xl font-semibold ${config.textColor}`}>
            Security & Account Settings
          </h2>

          <label className="block">
            <span className={`${config.textColor} font-medium`}>
              Current Password
            </span>
            <input
              type="password"
              name="currentPassword"
              value={passwords.currentPassword}
              onChange={handlePasswordChange}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-transparent border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${config.textColor}
              `}
            />
          </label>

          <label className="block">
            <span className={`${config.textColor} font-medium`}>
              New Password
            </span>
            <input
              type="password"
              name="newPassword"
              value={passwords.newPassword}
              onChange={handlePasswordChange}
              className={`
                mt-1 block w-full rounded-md px-3 py-2
                bg-transparent border ${config.borderColor}
                focus:outline-none focus:ring-2 focus:ring-indigo-500
                ${config.textColor}
              `}
            />
          </label>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={twoFAEnabled}
              onChange={() => setTwoFAEnabled(!twoFAEnabled)}
              className="h-5 w-5 rounded border-gray-300 focus:ring-2 focus:ring-indigo-500"
            />
            <span className={config.textColor}>
              Enable Two-Factor Authentication
            </span>
          </label>

          <button
            onClick={handleLogoutAll}
            className={`
              mt-4 w-full px-4 py-2 text-center font-semibold
              bg-red-600 text-white rounded-md hover:opacity-90
            `}
          >
            Log out of all devices
          </button>
        </div>
      </div>

      {/* Navigation bar at bottom */}
      <div className="absolute bottom-0 left-0 w-full">
        <NavigationBar />
      </div>
    </div>
  );
}
