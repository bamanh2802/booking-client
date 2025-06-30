import { Car, Clock, Shield, Headphones } from "lucide-react";

export default function AboutSection() {
  const features = [
    {
      icon: <Car className="w-12 h-12 text-blue-600 mb-4" />,
      title: "Premium Fleet",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies.",
    },
    {
      icon: <Clock className="w-12 h-12 text-blue-600 mb-4" />,
      title: "On-Time Service",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies.",
    },
    {
      icon: <Shield className="w-12 h-12 text-blue-600 mb-4" />,
      title: "Safe & Secure",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies.",
    },
    {
      icon: <Headphones className="w-12 h-12 text-blue-600 mb-4" />,
      title: "24/7 Support",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, diam quis aliquam ultricies.",
    },
  ];

  return (
    <div className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            About Our Service
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center"
            >
              <div className="flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold mb-4">Why Choose Us</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
            tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
}
