import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Doctors = () => {
  const { speciality } = useParams();
  const { doctors } = useContext(AppContext);

  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  return (
    <div>
      <p className="text-gray-600">Browse through the specialist doctors.</p>

      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button
          className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${
            showFilter ? "bg-primary text-white" : ""
          }`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        {/* Filters */}
        <div
          className={`flex-col gap-4 text-sm text-gray-600 ${
            showFilter ? "flex" : "hidden sm:flex"
          }`}
        >

          <p
            onClick={() =>
              speciality === "Clinical Psychologist"
                ? navigate("/doctors")
                : navigate("/doctors/Clinical Psychologist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-fuchsia-300 rounded transition-all cursor-pointer ${
              speciality === "Clinical Psychologist"
                ? "bg-fuchsia-100 text-black"
                : ""
            }`}
          >
            Clinical Psychologist
          </p>

          <p
            onClick={() =>
              speciality === "Psychiatrist"
                ? navigate("/doctors")
                : navigate("/doctors/Psychiatrist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-fuchsia-300 rounded transition-all cursor-pointer ${
              speciality === "Psychiatrist" ? "bg-fuchsia-100 text-black" : ""
            }`}
          >
            Psychiatrist
          </p>

          <p
            onClick={() =>
              speciality === "Relationship and Marriage Counsellor"
                ? navigate("/doctors")
                : navigate("/doctors/Relationship and Marriage Counsellor")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-fuchsia-300 rounded transition-all cursor-pointer ${
              speciality === "Relationship and Marriage Counsellor"
                ? "bg-fuchsia-100 text-black"
                : ""
            }`}
          >
            Relationship and Marriage Counsellor
          </p>

          <p
            onClick={() =>
              speciality === "Child and Adolescent Counsellor"
                ? navigate("/doctors")
                : navigate("/doctors/Child and Adolescent Counsellor")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-fuchsia-300 rounded transition-all cursor-pointer ${
              speciality === "Child and Adolescent Counsellor"
                ? "bg-fuchsia-100 text-black"
                : ""
            }`}
          >
            Child and Adolescent Counsellor
          </p>

          <p
            onClick={() =>
              speciality === "Trauma and Abuse Counsellor"
                ? navigate("/doctors")
                : navigate("/doctors/Trauma and Abuse Counsellor")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-fuchsia-300 rounded transition-all cursor-pointer ${
              speciality === "Trauma and Abuse Counsellor"
                ? "bg-fuchsia-100 text-black"
                : ""
            }`}
          >
            Trauma and Abuse Counsellor
          </p>

          <p
            onClick={() =>
              speciality === "Anxiety and Depression Specialist"
                ? navigate("/doctors")
                : navigate("/doctors/Anxiety and Depression Specialist")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-fuchsia-300 rounded transition-all cursor-pointer ${
              speciality === "Anxiety and Depression Specialist"
                ? "bg-fuchsia-100 text-black"
                : ""
            }`}
          >
            Anxiety and Depression Specialist
          </p>

          <p
            onClick={() =>
              speciality === "Career Counsellor"
                ? navigate("/doctors")
                : navigate("/doctors/Career Counsellor")
            }
            className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-fuchsia-300 rounded transition-all cursor-pointer ${
              speciality === "Career Counsellor"
                ? "bg-fuchsia-100 text-black"
                : ""
            }`}
          >
            Career Counsellor
          </p>
        </div>

        {/* Doctors List */}
        <div className="w-full grid grid-cols-auto gap-4 gap-y-6">
          {filterDoc.map((items, index) => (
            <div
              key={index}
              onClick={() => navigate(`/appointment/${items._id}`)}
              className="border border-fuchsia-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
            >
              <img className="bg-fuchsia-100" src={items.image} alt="doc" />

              <div className="p-4">
                <div
                  className={`flex items-center gap-2 text-sm ${
                    items.available ? "text-green-500" : "text-gray-500"
                  }`}
                >
                  <p
                    className={`w-2 h-2 ${
                      items.available ? "bg-green-500" : "bg-gray-500"
                    } rounded-full`}
                  ></p>
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
      </div>
    </div>
  );
};

export default Doctors;
