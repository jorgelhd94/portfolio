import Logo from '../../atoms/Logo/Logo';
import ThemeToggle from '../../molecules/ThemeToggle/ThemeToggle';
// import LanguageToggle from '../../molecules/LanguageToggle/LanguageToggle';

const Navbar = () => {
  return (
    <div className="flex justify-between items-center bg-transparent dark:md:bg-transparent p-4 lg:pt-10 lg:px-4">
      <Logo />
      <div className='flex items-center space-x-3'>
        {/* <LanguageToggle /> */}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Navbar;
