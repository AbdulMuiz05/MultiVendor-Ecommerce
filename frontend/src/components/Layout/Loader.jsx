import React from "react";

const Loader = () => {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-4 border-primary/15" />

        <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
      </div>
    </div>
  );
};

export default Loader;