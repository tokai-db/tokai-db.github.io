import React, { useEffect, useState } from "react";
import supabase from "../services/supabase";
import { Link } from "react-router-dom";
import AddInstituteModal from "./AddInstituteModal";

function InstituteList() {
  const [institutes, setInstitutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInstitutes = async () => {
      const { data, error } = await supabase.from("institutes").select("*");
      if (error) console.error(error);
      else setInstitutes(data);
      setLoading(false);
    };

    fetchInstitutes();
  }, []);

  const updateInstitutes = (institute) => {
    window.location.reload();
  };

  const filteredInstitutes = institutes.filter((institute) =>
    institute.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold mt-10 mb-4 text-center'>Tokai DB</h1>
      <h4 className='text-xl font-extralight mb-10 text-center tracking-wide'>
        Let's Spot Those Tokais
      </h4>
      <input
        type='text'
        placeholder='Search for institutes...'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='block w-full max-w-4xl p-5 bg-[#1f2224] rounded-2xl m-auto mb-10'
      />
      {loading ? (
        <p>Loading...</p>
      ) : filteredInstitutes.length === 0 ? (
        <>
          <p className='text-center mt-6'>
            Institute has not been enlisted yet.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className='block p-5 mb-4 bg-blue-500 text-center rounded-2xl m-auto mt-10'
          >
            Add institute
          </button>
        </>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {filteredInstitutes.map((institute) => (
            <Link
              to={`/institute/${institute.id}`}
              key={institute.id}
              className='bg-[#1f2224] rounded-2xl p-3 hover:bg-[#232629] transition'
            >
              <img
                src={institute.profile_image}
                alt={institute.name}
                className='rounded-2xl mt-2 h-64 object-contain w-full'
              />
              <h2 className='mt-10 text-2xl font-semibold text-center p-2 bg-[#32373b] rounded-xl'>
                {institute.name}
              </h2>
            </Link>
          ))}
        </div>
      )}
      {showModal && (
        <AddInstituteModal
          showModal={showModal}
          setShowModal={setShowModal}
          updateInstitutes={updateInstitutes}
        />
      )}
    </div>
  );
}

export default InstituteList;
