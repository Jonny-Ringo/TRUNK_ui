import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray text-gray-800 body-font">
      <div className="container px-5 py-8 mx-auto flex items-center sm:flex-row flex-col">
        <div className="flex title-font font-medium items-center md:justify-start justify-center text-gray-900">
        <Link to={"/"}>
          <img className='w-48 md:mr-48' src="logo.png" alt="Logo" />
        </Link>
        </div>
        <div className="flex-grow sm:pl-8 sm:mt-0 mt-8 sm:text-left text-center">
          <h2 className="title-font font-medium text-gray-900 tracking-widest text-sm mb-3">Have Some Fun!</h2>
          <nav className="list-none mb-10">
            <li>
                <Link to={"/meme/"} className="text-gray-600 hover:text-gray-800">
                    <div>Get TRUNK</div>
                </Link>
            </li>
            <li>
            <Link to={"/vote/"} className="text-gray-600 hover:text-gray-800">
                    <div>Vote</div>
                </Link>
            </li>
            <li>
              <a href="https://github.com/Jonny-Ringo/trunk/blob/main/img/trunk_icon.png" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">Contribute</a>
            </li>
          </nav>
        </div>
        <div className="flex-grow sm:pl-8 sm:mt-0 mt-8 sm:text-left text-center">
          
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;