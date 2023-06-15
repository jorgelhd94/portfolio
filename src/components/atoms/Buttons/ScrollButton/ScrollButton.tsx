import {
  faCircleArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';

const ScrollButton = () => {
  useEffect(() => {
    const handleScrollButtonVisibility = () => {
      window.scrollY > 300 ? setShowButton(true) : setShowButton(false);
    };

    window.addEventListener('scroll', handleScrollButtonVisibility);

    return () => {
      window.removeEventListener('scroll', handleScrollButtonVisibility);
    };
  }, []);

  const [showButton, setShowButton] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return showButton ? (
    <div className="scrollToTop">
      <button
        className="fixed bottom-5 right-7 z-50 cursor-pointer rounded-full border-2 bg-slate-100"
        onClick={handleScrollToTop}
      >
        <FontAwesomeIcon
          icon={faCircleArrowUp}
          width="36px"
          className="text-slate-800 "
        />
      </button>
    </div>
  ) : (
    <div></div>
  );
};

export default ScrollButton;
