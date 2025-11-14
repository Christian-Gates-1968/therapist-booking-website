import React, { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import { toast } from "react-toastify";
import axios from "axios";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const formattedDob = (() => {
  if (!userData?.dob) return "";

  const d = new Date(userData.dob);
  if (isNaN(d.getTime())) return ""; // invalid date -> avoid crash

  return d.toISOString().split("T")[0];
})();


  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      if (image) formData.append("image", image);

      const { data } = await axios.post(
        `${backendUrl}/api/user/update-profile`,
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else toast.error(data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  if (!userData) return null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-8 flex flex-col gap-6 text-gray-700">
      {/* Profile Picture */}
      <div className="flex flex-col items-center gap-3">
        {isEdit ? (
          <label htmlFor="image" className="cursor-pointer relative group">
            <img
              className="w-36 h-36 rounded-full object-cover border-4 border-fuchsia-300 shadow-md opacity-80 group-hover:opacity-60 transition"
              src={image ? URL.createObjectURL(image) : userData.image}
              alt="Profile"
            />
            <div className="absolute bottom-2 right-2 bg-fuchsia-600 text-white p-2 rounded-full shadow-md">
              <img src={assets.upload_icon} className="w-4" alt="Upload" />
            </div>
            <input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        ) : (
          <img
            className="w-36 h-36 rounded-full object-cover border-4 border-fuchsia-300 shadow-md"
            src={userData.image}
            alt="Profile"
          />
        )}

        {isEdit ? (
          <input
            className="text-2xl font-semibold text-center bg-gray-50 border-b-2 border-fuchsia-200 focus:outline-none focus:border-fuchsia-500 transition"
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData({ ...userData, name: e.target.value })
            }
          />
        ) : (
          <p className="text-2xl font-semibold text-fuchsia-900">
            {userData.name}
          </p>
        )}
      </div>

      <hr className="border-t border-gray-300" />

      {/* Contact Info */}
      <div>
        <p className="text-sm font-semibold text-gray-500 tracking-wide mb-3">
          CONTACT INFORMATION
        </p>
        <div className="grid grid-cols-[1fr_2fr] gap-y-3 text-sm">
          <p className="font-medium">Email:</p>
          <p className="text-fuchsia-700">{userData.email}</p>

          <p className="font-medium">Phone:</p>
          {isEdit ? (
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={userData.phone}
              onChange={(e) =>
                setUserData({ ...userData, phone: e.target.value })
              }
            />
          ) : (
            <p className="text-fuchsia-700">{userData.phone}</p>
          )}

          <p className="font-medium">Address:</p>
          {isEdit ? (
            <div className="flex flex-col gap-2">
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { ...userData.address, line1: e.target.value },
                  })
                }
              />
              <input
                type="text"
                className="bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData({
                    ...userData,
                    address: { ...userData.address, line2: e.target.value },
                  })
                }
              />
            </div>
          ) : (
            <p className="text-gray-600">
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>
      </div>

      <hr className="border-t border-gray-300" />

      {/* Basic Info */}
      <div>
        <p className="text-sm font-semibold text-gray-500 tracking-wide mb-3">
          BASIC INFORMATION
        </p>
        <div className="grid grid-cols-[1fr_2fr] gap-y-3 text-sm">
          <p className="font-medium">Gender:</p>
          {isEdit ? (
            <select
              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={userData.gender}
              onChange={(e) =>
                setUserData({ ...userData, gender: e.target.value })
              }
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          ) : (
            <p className="text-gray-600">{userData.gender}</p>
          )}

          <p className="font-medium">Date of Birth:</p>
          {isEdit ? (
            <input
              type="date"
              className="bg-gray-50 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
              value={formattedDob}
              onChange={(e) =>
                setUserData({ ...userData, dob: e.target.value })
              }
            />
          ) : (
            <p className="text-gray-600">{formattedDob}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center mt-8">
        {isEdit ? (
          <button
            onClick={updateUserProfileData}
            className="px-6 py-2 bg-fuchsia-700 text-white rounded-full hover:bg-fuchsia-800 transition-all shadow-sm"
          >
            Save Changes
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="px-6 py-2 border border-fuchsia-700 text-fuchsia-700 rounded-full hover:bg-fuchsia-700 hover:text-white transition-all shadow-sm"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
