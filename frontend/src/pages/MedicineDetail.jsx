import React, { useContext, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { medicines } from "../assets/assets_frontend/medicineData";
import { CartContext } from "../context/CartContext";

const MedicineDetail = () => {
  const { medId } = useParams();
  const navigate = useNavigate();
  const { addToCart, cartCount } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  const medicine = medicines.find((m) => m._id === medId);

  if (!medicine) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-gray-500">Medicine not found.</p>
        <button
          onClick={() => navigate("/medicines")}
          className="mt-4 px-6 py-2 bg-primary text-white rounded-full text-sm"
        >
          Back to Medicines
        </button>
      </div>
    );
  }

  // Find related medicines (same category)
  const related = medicines
    .filter((m) => m.category === medicine.category && m._id !== medicine._id)
    .slice(0, 4);

  return (
    <div className="pb-16 mt-4">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <span
          className="hover:text-primary cursor-pointer"
          onClick={() => navigate("/medicines")}
        >
          Medicines
        </span>
        <span>/</span>
        <span
          className="hover:text-primary cursor-pointer"
          onClick={() => navigate("/medicines")}
        >
          {medicine.category}
        </span>
        <span>/</span>
        <span className="text-fuchsia-800 font-medium">{medicine.name}</span>
      </div>

      {/* Main Product Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-12">
        {/* Left: Image */}
        <div className="w-full lg:w-[400px] bg-gradient-to-br from-fuchsia-50 to-purple-50 rounded-2xl flex items-center justify-center p-12 border border-fuchsia-100 relative shrink-0">
          <span className="text-[100px]">{medicine.image}</span>
          {medicine.requiresPrescription && (
            <span className="absolute top-4 right-4 bg-red-100 text-red-600 text-xs font-bold px-3 py-1 rounded-full">
              Prescription Required
            </span>
          )}
        </div>

        {/* Right: Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-fuchsia-100 text-fuchsia-700 text-xs font-medium px-3 py-1 rounded-full">
              {medicine.category}
            </span>
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
              {medicine.form}
            </span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-bold text-fuchsia-900 mb-2">
            {medicine.name}
          </h1>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < Math.floor(medicine.rating)
                      ? "text-yellow-500"
                      : "text-gray-300"
                  }`}
                >
                  ★
                </span>
              ))}
              <span className="text-sm text-gray-600 ml-1 font-medium">
                {medicine.rating}
              </span>
            </div>
            <span className="text-sm text-gray-400">
              ({medicine.reviews.toLocaleString()} reviews)
            </span>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed mb-6">
            {medicine.shortDesc}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
            <div className="bg-fuchsia-50 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-fuchsia-600 uppercase tracking-wide">
                Dosage
              </p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">
                {medicine.dosage}
              </p>
            </div>
            <div className="bg-fuchsia-50 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-fuchsia-600 uppercase tracking-wide">
                Pack Size
              </p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">
                {medicine.quantity}
              </p>
            </div>
            <div className="bg-fuchsia-50 rounded-lg p-3">
              <p className="text-[10px] font-semibold text-fuchsia-600 uppercase tracking-wide">
                Form
              </p>
              <p className="text-sm font-medium text-gray-800 mt-0.5">
                {medicine.form}
              </p>
            </div>
          </div>

          {/* Price + Cart */}
          <div className="border border-fuchsia-100 rounded-xl p-5 bg-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-3xl font-bold text-fuchsia-800">
                  ${medicine.price.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Price per pack ({medicine.quantity})
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-fuchsia-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-fuchsia-700 hover:bg-fuchsia-50 transition-colors text-lg font-bold"
                >
                  −
                </button>
                <span className="px-4 py-2 text-sm font-medium border-x border-fuchsia-200 min-w-[40px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-fuchsia-700 hover:bg-fuchsia-50 transition-colors text-lg font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => addToCart(medicine, quantity)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
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
                Add to Cart
              </button>

              <button
                onClick={() => {
                  addToCart(medicine, quantity);
                  navigate("/cart");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 border-2 border-primary text-primary rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition-colors"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-fuchsia-200 mb-6">
        <div className="flex gap-6">
          {["description", "usage", "side effects"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? "text-primary border-primary"
                  : "text-gray-500 border-transparent hover:text-fuchsia-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        {activeTab === "description" && (
          <p className="text-sm text-gray-700 leading-relaxed max-w-3xl">
            {medicine.description}
          </p>
        )}

        {activeTab === "usage" && (
          <div className="max-w-3xl">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-blue-800 mb-2">
                How to Use
              </p>
              <p className="text-sm text-blue-700 leading-relaxed">
                {medicine.usage}
              </p>
            </div>
          </div>
        )}

        {activeTab === "side effects" && (
          <div className="max-w-3xl">
            <p className="text-sm text-gray-600 mb-3">
              Common side effects may include:
            </p>
            <div className="flex flex-wrap gap-2">
              {medicine.sideEffects.map((effect, idx) => (
                <span
                  key={idx}
                  className="bg-red-50 text-red-700 text-xs px-3 py-1.5 rounded-full border border-red-100"
                >
                  {effect}
                </span>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">
              This is not a complete list of side effects. Consult your doctor or
              pharmacist for medical advice about side effects.
            </p>
          </div>
        )}
      </div>

      {/* Related Medicines */}
      {related.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-fuchsia-900 mb-4">
            Related in {medicine.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((med) => (
              <div
                key={med._id}
                onClick={() => {
                  navigate(`/medicine/${med._id}`);
                  scrollTo(0, 0);
                }}
                className="bg-white border border-fuchsia-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="bg-gradient-to-br from-fuchsia-50 to-purple-50 p-4 flex items-center justify-center">
                  <span className="text-3xl">{med.image}</span>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-fuchsia-900 text-sm truncate">
                    {med.name}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">{med.dosage} • {med.quantity}</p>
                  <p className="text-sm font-bold text-fuchsia-800 mt-1">
                    ${med.price.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicineDetail;
