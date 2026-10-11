import React from "react";

const SectionTitle = ({ title, subtitle, action }) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="section-title">{title}</h2>

        {subtitle && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
};

export default SectionTitle;