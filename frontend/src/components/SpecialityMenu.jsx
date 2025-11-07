import React from 'react'
import { specialityData } from '../assets/assets_frontend/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-500' id='speciality' >
        
        <h1 className='text-3xl font-medium text-fuchsia-700'>Find by Speciality</h1>

        <p className='sm:w-1/3 text-center text-sm'>
          Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.
        </p>

        <div className='flex sm:justify-center gap-6 pt-5 w-full overflow-x-auto show-scrollbar'>

          {specialityData.map((item, index) => (
            <Link
              key={index}
              to={`/doctors/${item.speciality}`}
              onClick={() => scrollTo(0,0)}
              className='flex flex-col items-center text-xs w-20 text-center break-words cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500'
            >

              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white border border-fuchsia-200 flex items-center justify-center shadow">
                <img
                  src={item.image}
                  alt="speciality"
                  className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                />
              </div>

              {/* Text */}
              <p className='mt-2'>{item.speciality}</p>

            </Link>
          ))}

        </div>
    </div>
  )
}

export default SpecialityMenu
