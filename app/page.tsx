"use client";
import { createClient } from "@supabase/supabase-js";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const serviceAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Create a single supabase client for interacting with your database
const supabase = createClient(supabaseUrl, serviceAnonKey);

interface FormTypes {
  player_a: string;
  player_b: string;
  contact_number: string;
  address: string;
}

export default function Home() {
  const [saving, setSaving] = useState(false);
  const [registered, setRegistered] = useState(false);

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<FormTypes>({
    mode: "onSubmit",
  });

  const onSubmit = async (formdata: FormTypes) => {
    if (saving) return;

    setSaving(true);

    void handleCreate(formdata);
  };

  const handleCreate = async (formdata: FormTypes) => {
    const params = {
      player_a: formdata.player_a,
      player_b: formdata.player_b,
      contact_number: formdata.contact_number,
      address: formdata.address,
    };

    try {
      const { data, error } = await supabase
        .from("pickle")
        .insert(params)
        .select();

      if (error) throw new Error(error.message);

      setSaving(false);
      setRegistered(true);
    } catch (error) {
      console.error("error", error);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen">
      <Image alt="Pickle" src="/bg2.png" width={500} height={24} />
      <div className="w-full flex flex-col items-center justify-start p-4">
        <div className="bg-white text-gray-900 w-full sm:w-[500px] p-4">
          {registered && (
            <div className="font-mono text-center text-lg">
              You are successfully registered.
            </div>
          )}
          {!registered && (
            <>
              <div className="bg-yellow-100 p-2 mb-4 text-sm font-mono">
                3 winners (gold, silver, and bronze) will be selected in each
                category (Class A and Class B). The organizers will categorize
                each team to ensure a balanced gaming experience.
              </div>
              <div className="font-mono text-center text-lg">
                Register your team below:
              </div>
              <div className="font-mono">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="flex flex-col space-y-4">
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Player A
                      </div>
                      <div>
                        <input
                          {...register("player_a", { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.player_a && (
                          <div className="app__error_message">
                            Player A is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Player B
                      </div>
                      <div>
                        <input
                          {...register("player_b", { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.player_b && (
                          <div className="app__error_message">
                            Player B is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Contact #
                      </div>
                      <div>
                        <input
                          {...register("contact_number", { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.contact_number && (
                          <div className="app__error_message">
                            Mobile No is required
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 font-medium text-sm">
                        Address (City/Municipality)
                      </div>
                      <div>
                        <input
                          {...register("address", { required: true })}
                          type="text"
                          className="w-full text-sm py-1 px-2 text-gray-600 border border-gray-300 rounded-sm focus:ring-0 focus:outline-none"
                        />
                        {errors.address && (
                          <div className="app__error_message">
                            Address is required
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-500 border border-emerald-600 font-bold px-2 py-1 text-lg text-white rounded-sm"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
