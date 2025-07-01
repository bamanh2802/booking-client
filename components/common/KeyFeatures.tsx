import { Card, CardBody } from "@heroui/card";
import {
  Award,
  RefreshCcw,
  Clock,
  Star,
  Shield,
  DollarSign,
} from "lucide-react";

const features = [
  {
    icon: <Award size={36} />,
    title: "Xe Chất Lượng Cao",
    description:
      "Xe bus đời mới, ghế ngồi thoải mái, máy lạnh mát, đảm bảo hành trình dễ chịu.",
  },
  {
    icon: <RefreshCcw size={36} />,
    title: "Hoàn Tiền Dễ Dàng",
    description:
      "Hủy vé miễn phí trước 2 tiếng khởi hành. Hoàn tiền 100% khi xe bị delay.",
  },
  {
    icon: <Star size={36} />,
    title: "Dịch Vụ Tốt",
    description:
      "Tài xế nhiệt tình, xe sạch sẽ, wifi miễn phí và hỗ trợ hành lý.",
  },
  {
    icon: <Shield size={36} />,
    title: "An Toàn Đáng Tin",
    description:
      "Tài xế có bằng lái chuyên nghiệp, xe được bảo dưỡng định kỳ, bảo hiểm đầy đủ.",
  },
];

export default function KeyFeatures() {
  return (
    <section className="py-20 bg-gradient-to-br">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Tại Sao Chọn Xe Bus Của Chúng Tôi?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Chất lượng tốt, giá cả hợp lý, dịch vụ chu đáo
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
            >
              <CardBody className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300" />
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </CardBody>

              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-md">
            <DollarSign size={20} className="text-green-500" />
            <span className="font-semibold text-gray-700">
              Minh bạch giá cả • Không phí ẩn
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
