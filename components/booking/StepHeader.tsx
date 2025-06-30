"use client";

import { Card, CardBody } from "@heroui/card";

import { Logo } from "@/components/icons";

interface StepHeaderProps {
  currentStep: number;
}

const steps = [
  { label: "Bắt đầu" },
  { label: "Chọn vé xe" },
  { label: "Hoàn thành" },
];

export default function StepHeader({ currentStep }: StepHeaderProps) {
  return (
    <div className="w-full flex justify-center mb-6">
      <Card className="shadow-md max-w-full w-full">
        <CardBody className="flex flex-col sm:flex-row items-center justify-center gap-4 py-4 px-4">
          <div className="flex items-center gap-2 min-w-[120px] sm:min-w-[120px]">
            <Logo />
          </div>

          <div className="flex items-center justify-center gap-0 w-full max-w-2xl">
            {steps.map((step, idx) => (
              <div key={step.label} className="flex items-center gap-0 flex-1">
                <div className="flex flex-col items-center min-w-[80px] sm:min-w-[100px]">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                      idx + 1 === currentStep
                        ? "bg-danger text-white shadow-lg scale-110"
                        : idx + 1 < currentStep
                          ? "bg-success text-white shadow-md"
                          : "bg-default-200 text-default-500"
                    }`}
                  >
                    {idx + 1 < currentStep ? (
                      <svg
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          clipRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          fillRule="evenodd"
                        />
                      </svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span
                    className={`mt-1 sm:mt-2 text-xs font-semibold transition-colors duration-200 text-center ${
                      idx + 1 === currentStep
                        ? "text-danger"
                        : idx + 1 < currentStep
                          ? "text-success"
                          : "text-default-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-1 flex items-center justify-center mx-1 sm:mx-2">
                    <div
                      className={`h-0.5 sm:h-1 w-full rounded-full transition-all duration-300 ${
                        idx + 1 < currentStep
                          ? "bg-success shadow-sm"
                          : idx + 1 === currentStep
                            ? "bg-danger-200"
                            : "bg-default-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
