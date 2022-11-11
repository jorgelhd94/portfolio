import React from 'react';
import Logo from '../../atoms/Logo/Logo';
import ThemeToogle from '../../molecules/ThemeToogle/ThemeToogle';

const Navbar = () => {
  return (
    <div className="container grid grid-cols-2 m-auto pt-5 md:pt-[40px] pb-5 bg-transparent px-3 md:px-0 
                    dark:md:bg-transparent">
      <div className='flex'>
        <Logo />
      </div>
      <div className='flex justify-end'>
        <ThemeToogle />
      </div>
    </div>
  );
};

export default Navbar;
