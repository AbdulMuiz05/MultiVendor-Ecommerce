import React from "react";

const CheckoutSteps = ({ active = 1 }) => {
  const steps = [
    { id: 1, title: "Shipping" },
    { id: 2, title: "Payment" },
    { id: 3, title: "Confirmation" },
  ];

  return (
    <div className="w-full flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                active >= step.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.id}
            </div>

            <span
              className={`mt-2 text-sm ${
                active >= step.id
                  ? "text-blue-600 font-medium"
                  : "text-gray-500"
              }`}
            >
              {step.title}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`w-16 sm:w-24 h-1 mx-2 ${
                active > step.id ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;