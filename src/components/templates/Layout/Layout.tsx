import Navbar from "../../organisms/Navbar/Navbar";
import Profile from "../../organisms/Profile/Profile";
import Footer from "../../organisms/Footer/Footer";
import ScrollButton from "../../atoms/Buttons/ScrollButton/ScrollButton";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = (props: LayoutProps) => {
  return (
    <>
      <div className="w-full md:pb-16 min-h-screen">
        <div className="container m-auto">
          <Navbar />

          <div className="lg:mt-[220px] flex gap-6 flex-col lg:flex-row">
            <Profile />
            <div className="card bg-base-200 shadow-xl max-md:rounded-none">
              <div className="card-body px-0 pb-2">
                {props.children}
                <Footer />
              </div>
            </div>
          </div>
        </div>
        <ScrollButton />
      </div>
    </>
  );
};

export default Layout;
