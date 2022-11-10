import React from 'react';

const About = () => {
  return (
    <div className="pt-12 md:pt-12 md:pb-8 px-2 sm:px-5 md:px-10 lg:px-14">
      <h2 className="title-section after:left-52">About me</h2>

      <div className="grid grid-cols-12 md:gap-10 pt-4 md:pt-[30px] items-center">
        <div className="col-span-12 space-y-2.5">
          <div className="lg:mr-16">
            <p className="text-[#44566c] dark:text-color-910 leading-7">
              I’m a computer engineer with strong passion and interest for
              programming, software develop and the world of technology at
              general.
            </p>
            <p className="text-[#44566c] leading-7 mt-2.5 dark:text-color-910">
              My aim is to create applications and websites that take your
              business to the next level, using the best software development
              tools on the market.
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default About;
