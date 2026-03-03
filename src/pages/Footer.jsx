const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col items-center text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400 space-y-3">

        <p>
          © {new Date().getFullYear()} Short.ly · v1.0.0
        </p>
        <a
          href="https://opensource.org/licenses/MIT"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition-colors duration-200"
        >
          MIT License
        </a>
        <a
          href="https://github.com/PawanKumar2001/Short.ly_front_end"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-500 transition-colors duration-200"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
};

export default Footer;