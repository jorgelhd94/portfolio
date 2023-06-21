import { useEffect } from "react";

function useDetectOutsideClick(ref: any, onClickOutside: () => void) {
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    }

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref, onClickOutside]);
}

export default useDetectOutsideClick;
