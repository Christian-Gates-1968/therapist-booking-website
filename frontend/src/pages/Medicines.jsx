import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  medicines,
  medicineCategories,
} from "../assets/assets_frontend/medicineData";
import { CartContext } from "../context/CartContext";

const Medicines = () => {
  const navigate = useNavigate();
  const { addToCart, cartCount } = useContext(CartContext);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMedicines = medicines.filter((med) => {
    const matchesCategory =
      selectedCategory === "All" || med.category === selectedCategory;
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      med.shortDesc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 mt-4">
        <div>
          <h1 className="text-2xl font-semibold text-fuchsia-900">
            Medicines & Supplements
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse common psychological medicines and wellness supplements
          </p>
        </div>
        <button
          onClick={() => navigate("/cart")}
          className="relative flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"
            />
          </svg>
          Cart
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search medicines, supplements, categories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-96 border border-fuchsia-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {medicineCategories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm border transition-all ${
              selectedCategory === cat
                ? "bg-primary text-white border-primary"
                : "border-fuchsia-300 text-fuchsia-700 hover:bg-fuchsia-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Info Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-8 flex items-start gap-3">
        <span className="text-xl">⚠️</span>
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Prescription Required</p>
          <p>
            Some medicines require a valid prescription from a licensed
            healthcare professional. Items marked with{" "}
            <span className="font-semibold text-red-600">Rx</span> will be
            verified before dispatch.
          </p>
        </div>
      </div>

      {/* Medicines Grid */}
      {filteredMedicines.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg">No medicines found matching your search.</p>
          <p className="text-sm mt-1">Try a different keyword or category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredMedicines.map((med) => (
            <div
              key={med._id}
              className="bg-white border border-fuchsia-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              {/* Card Top */}
              <div
                onClick={() => navigate(`/medicine/${med._id}`)}
                className="cursor-pointer"
              >
                <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 p-6 flex items-center justify-center relative">
                  <span className="text-5xl">{med.image}</span>
                  {med.requiresPrescription && (
                    <span className="absolute top-3 right-3 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Rx
                    </span>
                  )}
                  <span className="absolute top-3 left-3 bg-fuchsia-100 text-fuchsia-700 text-[10px] font-medium px-2 py-0.5 rounded-full">
                    {med.category}
                  </span>
                </div>
                <div className="p-4 pb-2">
                  <h3 className="font-semibold text-fuchsia-900 text-sm leading-tight">
                    {med.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {med.shortDesc}
                  </p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <span>{med.dosage}</span>
                    <span>•</span>
                    <span>{med.quantity}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <span className="text-yellow-500 text-xs">★</span>
                    <span className="text-xs text-gray-600 font-medium">
                      {med.rating}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({med.reviews.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Bottom */}
              <div className="p-4 pt-2 mt-auto border-t border-fuchsia-50 flex items-center justify-between">
                <p className="text-lg font-bold text-fuchsia-800">
                  ${med.price.toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(med)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Medicines;
