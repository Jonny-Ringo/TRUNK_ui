import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800">
      <div className="container px-5 py-8 mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div className="md:col-span-1 flex justify-center md:justify-start">
          <Link to={"/"}>
            <img className='w-48' src="Trunk Logo.svg" alt="Logo" />
          </Link>
        </div>
        <div className="md:col-span-2">
          <h2 className="title-font font-semibold text-gray-900 text-lg mb-3 text-center md:text-left">Have Some Fun!</h2>
          <nav className="flex justify-center md:justify-start flex-wrap">
          
            <Link to={"https://bark.arweave.dev/#/"} className="mr-5 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              <div className="flex items-center">
                <img src="bark_logo.png" alt="Bark Logo" className="w-4 h-4 mr-2" />
                Swap TRUNK
              </div>
            </Link>

            <Link to={"/vote/"} className="mr-5 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              <div className="flex items-center">
              <img src="vote_icon.png" alt="Vote Icon" className="w-4 h-4 mr-2" />
                Vote
              </div>
            </Link>

            <a href="https://github.com/Jonny-Ringo/TRUNK_ui" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out">
              <div className="flex items-center">
              <img src="github_icon.png" alt="Github Logo" className="w-4 h-4 mr-2" />
                Contribute
              </div>
            </a>
          </nav>
        </div>
      </div>
    </footer>

  );
};

export default Footer;