import cmtiLogo from "../../images/logos/CMTILogo.png"
import mhiLogo from "../../images/logos/MHI3.png"

 const Header = ({ sidebarOpen, setSidebarOpen }) => {
  return (
    <header
      className={`relative z-10 bg-black/80 border-b border-gray-800 shadow-2xl flex-1 transition-all duration-300 ease-in-out ${sidebarOpen ? "lg:ml-80" : "lg:ml-20"
        }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Left Logo */}
          <div className="flex-shrink-0 group">
            <img
              src={cmtiLogo}
              alt="CMTI Logo"
              className="w-32 h-24 drop-shadow-md"
            />
          </div>

          {/* Center Content */}
          <div className="text-center flex-grow mx-8">
            {/* Institute Name */}
            <h1
              className="text-2xl lg:text-5xl font-extrabold mb-2 
              bg-gradient-to-r from-gray-200 via-gray-400 to-gray-100 
              bg-clip-text text-transparent drop-shadow-lg"
            >
              Central Manufacturing Technology Institute
            </h1>

            {/* Sub Heading */}
            <p className="text-lg text-gray-300 mb-3 opacity-90 italic">
              (An autonomous R&amp;D Institute under the Ministry of Heavy
              Industries, Govt. of India)
            </p>
          </div>

          {/* Right Logo */}
          <div className="flex-shrink-0 group">
            <img src={mhiLogo} alt="MHI Logo" className="w-32 h-32" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;