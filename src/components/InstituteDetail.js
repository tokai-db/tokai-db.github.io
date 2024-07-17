import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../services/supabase";
import AddTokaiModal from "./AddTokaiModal";
import { Icon } from "@iconify/react";

function InstituteDetail() {
  const { id } = useParams();
  const [tokais, setTokais] = useState([]);
  const [institute, setInstitute] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [showProof, setShowProof] = useState(false);
  const [currentProof, setCurrentProof] = useState("");

  useEffect(() => {
    const fetchDetails = async () => {
      const { data: instituteData, error: instituteError } = await supabase
        .from("institutes")
        .select("*")
        .eq("id", id)
        .single();
      const { data: tokaiData, error: tokaiError } = await supabase
        .from("tokais")
        .select("*")
        .eq("institute_id", id);

      if (instituteError) console.error(instituteError);
      if (tokaiError) console.error(tokaiError);
      setInstitute(instituteData ?? {}); // Set to empty object if null
      setTokais(tokaiData ?? []); // Set to empty array if null
      setLoading(false);
    };

    fetchDetails();
  }, [id]);

  const updateTokais = (newTokai) => {
    window.location.reload();
  };

  const filteredTokais = tokais.filter(
    (tokai) =>
      (tokai?.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (tokai?.department ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (tokai?.batch ?? "").toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-[#111111] bg-opacity-80'>
        <div className='text-white text-xl'>Loading...</div>
      </div>
    );
  }

  return (
    <div className='container mx-auto p-4'>
      <a
        href='/'
        className='text-white bg-[#1f2224] rounded-2xl px-5 py-4 fixed top-10 left-10'
      >
        <Icon icon='solar:arrow-left-outline' className='text-2xl' />
      </a>
      <h1 className='text-4xl font-bold mt-10 mb-10 text-center'>
        {institute.name}
      </h1>
      <div className='flex justify-center'>
        <input
          type='text'
          placeholder='Search for Tokais...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='block w-full max-w-4xl p-5 bg-[#1f2224] rounded-2xl m-auto mb-10'
        />
      </div>
      {filteredTokais.length === 0 ? (
        <p className='text-center'>Tokai has not been enlisted yet</p>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {filteredTokais.map((tokai) => (
            <div
              key={tokai.id}
              className='bg-[#1f2224] rounded-2xl p-6 border-1'
            >
              <h2 className='text-2xl font-semibold text-white mb-2'>
                {tokai.name}
              </h2>
              <p className='text-gray-400 mb-2 mb-6'>
                {tokai.department} - {tokai.batch}
              </p>
              {tokai.image && (
                <img
                  src={tokai.image}
                  alt={tokai.name}
                  className='rounded-xl w-auto max-h-80 object-contain mb-6 mx-auto'
                />
              )}
              <p
                className='text-blue-400 mt-6 cursor-pointer underline'
                onClick={() => {
                  setCurrentProof(tokai.additional_info);
                  setShowProof(true);
                }}
              >
                View Proof
              </p>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setShowModal(true)}
        className='fixed bottom-10 right-10 bg-blue-500 rounded-full p-4 text-white hover:bg-blue-600 transition'
      >
        <Icon icon='ic:twotone-plus' className='w-6 h-6' />
      </button>
      {showModal && (
        <AddTokaiModal
          showModal={showModal}
          setShowModal={setShowModal}
          instituteId={id}
          updateTokais={updateTokais}
        />
      )}
      {showProof && (
        <div className='fixed inset-0 flex items-center justify-center bg-[#111111] bg-opacity-80'>
          <div className='bg-[#1f2224] rounded-3xl px-6 py-12 max-w-md mx-auto w-full relative mx-4'>
            <button
              onClick={() => setShowProof(false)}
              className='bg-red-500 rounded-full w-10 h-10 absolute top-4 right-4 flex items-center justify-center'
            >
              <Icon icon='charm:cross' className='text-white text-2xl' />
            </button>
            <h2 className='text-3xl font-semibold mb-5 text-center text-white'>
              Proof
            </h2>
            <p className='text-white'>{currentProof}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default InstituteDetail;
