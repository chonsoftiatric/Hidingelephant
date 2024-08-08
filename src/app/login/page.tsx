import React from "react";
import Login from "@/components/pages/Login";
import { Suspense } from "react";

const Loginpage = () => {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
};

export default Loginpage;
