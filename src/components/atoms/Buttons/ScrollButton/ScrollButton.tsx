import {
  faArrowUp,
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
      data-theme="winter"
        className="fixed bottom-5 right-7 z-50 btn btn-circle border-2 border-slate-500 text-2xl"
        onClick={handleScrollToTop}
      >
        <FontAwesomeIcon
          icon={faArrowUp}
          className="text-slate-800 "
        />
      </button>
    </div>
  ) : (
    <div></div>
  );
};

export default ScrollButton;
