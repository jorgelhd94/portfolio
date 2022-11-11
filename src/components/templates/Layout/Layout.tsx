import React from "react";
import Navbar from "../../organisms/Navbar/Navbar";
import Profile from "../../organisms/Profile/Profile";
import Head from "next/head";
import Footer from "../../organisms/Footer/Footer";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  const gradientLight = "bg-gradient-to-tl from-indigo-600  to-slate-100";

  const gradientDark =
    "dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-600 dark:bg-gradient-to-r";

  const styleBg = "background md:pb-16 w-full";

  return (
    <>
      <Head>
        <title>JCode Portfolio</title>
        <meta name="description" content="This is my portfolio. Enjoy!!" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>

      <div className={`${gradientLight} ${gradientDark} ${styleBg}`}>
        <Navbar />
        <div className="container grid grid-cols-12 md:gap-10 justify-between lg:mt-[220px] m-auto relative">
          <Profile />
          <div className="col-span-12 lg:col-span-8 md:mx-auto">
            <div className="md:rounded-2xl bg-white dark:bg-[#111111]">
                {props.children}
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;
