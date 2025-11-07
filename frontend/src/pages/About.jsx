import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const About = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          ABOUT <span className="text-fuchsia-700 font-medium">US</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.about_image}
          alt="About Us"
        />

        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-500">
          <p>
            Welcome to Therapy Co, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Therapy Co, we
            understand the challenges individuals face when it comes to
            scheduling therapist appointments and managing their records.
          </p>
          <p>
            Therapy Co is committed to excellence in mental healthcare
            technology. We continuously strive to enhance our platform,
            integrating the latest advancements to improve user experience and
            deliver superior service. Whether you're booking your first therapy
            session or managing ongoing care, Therapy Co is here to support you
            every step of the way.
          </p>
          <b className="text-fuchsia-700 text-lg">Our Vision</b>
          <p>
            Our vision at Therapy Co is to create a seamless mental healthcare
            experience for every user. We aim to bridge the gap between patients
            and mental className="text-gray-500 hover:text-white"healthcare
            providers, making it easier for you to access the care you need,
            when you need it.
          </p>
        </div>
      </div>

      <div className="text-xl my-4">
        <p className="text-gray-500">
          WHY <span className="text-fuchsia-700 font-semibold">CHOOSE US</span>
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 p-4">
        <div class="rounded-2xl p-6 sm:p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 hover:border-fuchsia-400 group">
          <h3 class="text-2xl md:text-3xl text-fuchsia-700 mb-4 group-hover:text-fuchsia-800 transition-colors duration-300">
            Efficiency
          </h3>

          <p class="text-base md:text-lg text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Streamlined appointment scheduling that fits into your busy
            lifestyle.
          </p>
        </div>

        <div class="rounded-2xl p-6 sm:p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 hover:border-fuchsia-400 group">
          <h3 class="text-2xl md:text-3xl text-fuchsia-700 mb-4 group-hover:text-fuchsia-800 transition-colors duration-300">
            Convenience
          </h3>

          <p class="text-base md:text-lg text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Access to a network of trusted healthcare professionals in your
            area.
          </p>
        </div>

        <div class="rounded-2xl p-6 sm:p-8 bg-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-purple-100 hover:border-fuchsia-400 group">
          <h3 class="text-2xl md:text-3xl text-fuchsia-700 mb-4 group-hover:text-fuchsia-800 transition-colors duration-300">
            Personalization
          </h3>

          <p class="text-base md:text-lg text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
            Tailored recommendations and reminders to help you stay on top of
            your health.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
