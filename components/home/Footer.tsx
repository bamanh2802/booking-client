import { Phone, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h3 className="text-2xl font-bold mb-4">VeXeNay</h3>
            <p className="text-gray-300 text-lg">
              Đặt vé xe khách trực tuyến nhanh chóng, tiện lợi
            </p>
          </div>

          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">Liên Hệ</h4>
            <div className="space-y-3">
              <a
                href="tel:0975918797"
                className="flex items-center justify-center md:justify-end gap-2 text-gray-300 hover:text-white transition-colors group"
              >
                <Phone
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="text-lg font-medium">0975 918 797</span>
              </a>
              <a
                href="mailto:thanhdia1995@gmail.com"
                className="flex items-center justify-center md:justify-end gap-2 text-gray-300 hover:text-white transition-colors group"
              >
                <Mail
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>thanhdia1995@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center">
          <p className="text-gray-400">
            &copy; {currentYear} VeXeRe. Tất cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
}
