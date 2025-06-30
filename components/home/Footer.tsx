export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">CarBooking</h3>
            <p className="text-gray-300 mb-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  Airport Transfer
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  City Tours
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  Business Travel
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors"
                  href="#"
                >
                  Wedding Transport
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <address className="not-italic text-gray-300">
              <p>123 Booking Street</p>
              <p>City, Country</p>
              <p className="mt-2">Email: info@carbooking.com</p>
              <p>Phone: +1 234 567 890</p>
            </address>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {currentYear} CarBooking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
