import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 overflow-hidden">
      {/* soft floating blobs */}
      <div className="absolute inset-0">
        <div className="absolute w-[500px] h-[500px] bg-blue-200/40 blur-[120px] rounded-full top-[-200px] left-[-150px]" />
        <div className="absolute w-[450px] h-[450px] bg-indigo-200/40 blur-[120px] rounded-full bottom-[-200px] right-[-150px]" />
        <div className="absolute w-[400px] h-[400px] bg-purple-200/30 blur-[120px] rounded-full top-[40%] left-[60%]" />
      </div>

      {/* subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(circle_at_1px_1px,#000_1px,transparent_0)] [background-size:28px_28px]" />

      {/* auth container */}
      <div className="relative w-full max-w-md px-6">
        {/* header */}
        <div className="text-center mb-6">
          <div className="text-slate-800 text-2xl font-semibold">
            Account Access
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Sign in to continue securely
          </p>
        </div>

        {/* card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-6 shadow-xl">
          {children}
        </div>

        {/* footer */}
        <div className="text-center mt-6 text-xs text-slate-500">
          Secure authentication powered by JWT
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
