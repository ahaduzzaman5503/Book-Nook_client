"use client"
import { authClient } from "../../../lib/auth-client";
import Image from "next/image";
import React from "react";

const page = () => {
      const { data: session } = authClient.useSession();
      const user = session?.user;
      console.log(user);
  return (
    <div>
      <div className="card w-96 bg-base-300 card-xl shadow-sm container mx-auto mt-10 text-center">
        <div className="card-body">
          <div className="avatar">
            <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
              <Image
                width={500}
                height={500}
                alt={user?.name}
                src={user?.image}
              />
            </div>
          </div>
          <div className="text-center">
            <h1 className="font-bold text-2xl ">{user?.name}</h1>
            <p className="py-3">{user?.email}</p>
            <p>Member since</p>
            <p>{user?.createdAt?.getDate}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
