import React, { useState, useEffect } from "react";
import supabase from "../services/supabase";
import { toast } from "react-toastify";
import { Icon } from "@iconify/react";

const verifyAdmin = (password) => {
  alert(process.env.REACT_APP_ADMIN_PASSWORD);
  const adminPassword = process.env.REACT_APP_ADMIN_PASSWORD;
  alert(password);
  return password == adminPassword;
};

function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokais, setTokais] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchTokais = async () => {
        const { data, error } = await supabase
          .from("unapproved_tokais")
          .select("*");
        if (error) {
          console.error(error);
        } else {
          setTokais(data);
        }
      };

      fetchTokais();
    }
  }, [isAuthenticated]);

  const approveTokai = async (tokai) => {
    try {
      const { data, error } = await supabase
        .from("tokais")
        .insert([{ ...tokai }])
        .single();

      if (error) {
        console.error(error);
        toast.error("Failed to approve Tokai. Please try again.");
      } else {
        await supabase.from("unapproved_tokais").delete().eq("id", tokai.id);
        setTokais(tokais.filter((t) => t.id !== tokai.id));
        toast.success("Tokai approved successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve Tokai. Please try again.");
    }
  };

  const deleteTokai = async (tokai) => {
    try {
      const { error } = await supabase
        .from("unapproved_tokais")
        .delete()
        .eq("id", tokai.id);

      if (error) {
        console.error(error);
        toast.error("Failed to delete Tokai. Please try again.");
      } else {
        setTokais(tokais.filter((t) => t.id !== tokai.id));
        toast.success("Tokai deleted successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete Tokai. Please try again.");
    }
  };

  const handleLogin = () => {
    if (verifyAdmin(password)) {
      setIsAuthenticated(true);
      toast.success("Logged in successfully!");
    } else {
      toast.error("Incorrect password. Please try again.");
    }
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-4xl font-bold mb-4 text-center'>Admin Dashboard</h1>
      {!isAuthenticated ? (
        <div className='flex flex-col items-center'>
          <input
            type='password'
            placeholder='Enter Admin Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='block w-full p-4 mb-4 bg-[#32373b] rounded-2xl max-w-md'
          />
          <button
            onClick={handleLogin}
            className='bg-blue-500 rounded-2xl px-8 py-3 mt-4'
          >
            Login
          </button>
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          {tokais.length === 0 ? (
            <p className='text-center col-span-full'>No Tokais to approve</p>
          ) : (
            tokais.map((tokai) => (
              <div key={tokai.id} className='bg-[#1f2224] rounded-2xl p-4'>
                <h2 className='text-2xl font-semibold text-white mb-2'>
                  {tokai.name}
                </h2>
                <p className='text-gray-400 mb-2'>
                  {tokai.department} - {tokai.batch}
                </p>
                {tokai.image && (
                  <img
                    src={tokai.image}
                    alt={tokai.name}
                    className='rounded-xl w-auto max-h-80 object-contain mb-4 mx-auto'
                  />
                )}
                <p className='text-gray-300'>{tokai.additional_info}</p>
                <div className='mt-4 flex justify-between'>
                  <button
                    onClick={() => approveTokai(tokai)}
                    className='bg-green-500 rounded-2xl px-4 py-2'
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => deleteTokai(tokai)}
                    className='bg-red-500 rounded-2xl px-4 py-2'
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
