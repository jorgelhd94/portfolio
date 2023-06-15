import Navbar from "../../organisms/Navbar/Navbar";
import Profile from '../../organisms/Profile/Profile';
// import Footer from '../../organisms/Footer/Footer';
import ScrollButton from "../../atoms/Buttons/ScrollButton/ScrollButton";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  return (
    <>
      <div
        className='w-full md:pb-16 min-h-screen'
      >
        <div className="container m-auto">
          <Navbar />

          <div className="lg:mt-[220px] flex gap-6 flex-col lg:flex-row">
            <Profile />
            <div className="md:rounded-2xl bg-white dark:bg-[#111111]">
              {props.children}
              {/* <Footer /> */}
            </div>
          </div>
        </div>
        <ScrollButton />
      </div>
    </>
  );
};

export default Layout;
