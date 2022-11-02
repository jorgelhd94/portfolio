import React from 'react';
import Logo from '../../atoms/Logo/Logo';
import ThemeToogle from '../../molecules/ThemeToogle/ThemeToogle';

const Navbar = () => {
  return (
    <div className='flex pt-[20px] px-8 lg:px-6 bg-white dark:bg-black md:bg-transparent dark:md:bg-transparent md:max-w-screen-xl lg:max-w-screen-2xl justify-between pb-5 mx-auto'>
      <div className='w-full flex justify-between my-5'>
        <Logo />
        <ThemeToogle />
      </div>
    </div>
  );
};

export default Navbar;
