import React from "react";
import { assets } from "../assets/assets_frontend/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div className="md:mx-10">
      <div className="mt-5">
        <hr class="border-t-2 border-primary" />
      </div>

      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 text-gray-600 my-10 text-sm">
        {/* ---------- Left Section ---------- */}
        <div>
          <Link to="/"><img className="mb-5 w-40" src={assets.logo} alt="logo" /></Link>
          <p className="w-full md:w-2/3 text-gray-500 leading-6">
            {" "}
            Therapy Co connects individuals with trusted therapists and wellness professionals, making mental health care accessible, personalized, and compassionate.{" "}
          </p>
        </div>

        {/* ---------- Center Section ---------- */}
        <div>
          <p className="text-xl text-fuchsia-700 font-medium mb-5">COMPANY</p>
          <ul className="flex flex-col gap-2 text-gray-500">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/Privacy">Privacy Policy</Link>
            </li>
          </ul>
        </div>

        {/* ---------- Right Section ---------- */}
        <div>
          <p className=" text-xl text-fuchsia-700 font-medium mb-5">
            GET IN TOUCH
          </p>
          <ul className=" flex flex-col gap-2 text-gray-500">
            <li>+91 12345 67891</li>
            <li>info@company.com</li>
          </ul>
        </div>

        {/* ---------- Copyright Text ---------- */}
      </div>
      <div>
        <hr class="border-t-2 border-primary" />
        <p className="py-5 text-fuchsia-700 text-sm text-center">
          © 2025. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
