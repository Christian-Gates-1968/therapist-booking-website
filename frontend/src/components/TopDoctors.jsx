import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);
  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-500 md:mx-10">
      <h1 className="text-3xl font-medium text-fuchsia-700">
        Top Doctors to Book
      </h1>
      <p className="sm:w-1/3 text-center text-sm">
        Simply browse through our extensive list of trusted doctors.
      </p>
      <div className="w-full grid grid-cols-auto gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {doctors.slice(0, 10).map((items, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${items._id}`);
              scrollTo(0, 0);
            }}
            className="border border-fuchsia-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            key={index}
          >
            <img className="bg-fuchsia-100" src={items.image} alt="doc image" />

            <div className="p-4">
              <div
                className={`flex items-center gap-2 text-sm text-center ${
                  items.available ? "text-green-500" : "text-gray-500"
                }`}
              >
                {" "}
                <p
                  className={`w-2 h-2 ${
                    items.available ? "bg-green-500" : "bg-gray-500"
                  }  rounded-full`}
                >
                  {" "}
                </p>
                <p>{items.available ? "Available" : "Not Available"}</p>
              </div>
              <p className="font-medium text-lg text-fuchsia-900">
                {items.name}
              </p>
              <p className="text-fuchsia-700 text-sm">{items.speciality}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-fuchsia-200 text-gray-800 px-12 py-3 rounded-full mt-10 hover:scale-105 transition-all"
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;
