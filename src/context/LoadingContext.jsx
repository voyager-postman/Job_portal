import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import GlobalLoader from "../components/GlobalLoader";
import { setLoadingCallbacks } from "../utils/loadingInterceptor";
import { bindFetchLoaderCallbacks } from "../utils/fetchWithLoader";

const SHOW_DELAY_MS = 250;

const LoadingContext = createContext(null);

export const LoadingProvider = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [visible, setVisible] = useState(false);
  const showTimerRef = useRef(null);

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  }, []);

  const startLoading = useCallback(() => {
    setActiveRequests((prev) => {
      const next = prev + 1;

      if (next === 1) {
        clearShowTimer();
        showTimerRef.current = setTimeout(() => {
          setVisible(true);
          showTimerRef.current = null;
        }, SHOW_DELAY_MS);
      }

      return next;
    });
  }, [clearShowTimer]);

  const stopLoading = useCallback(() => {
    setActiveRequests((prev) => {
      const next = Math.max(0, prev - 1);

      if (next === 0) {
        clearShowTimer();
        setVisible(false);
      }

      return next;
    });
  }, [clearShowTimer]);

  useEffect(() => {
    setLoadingCallbacks(startLoading, stopLoading);
    bindFetchLoaderCallbacks(startLoading, stopLoading);

    return () => {
      clearShowTimer();
      setLoadingCallbacks(() => {}, () => {});
      bindFetchLoaderCallbacks(() => {}, () => {});
    };
  }, [startLoading, stopLoading, clearShowTimer]);

  return (
    <LoadingContext.Provider value={{ startLoading, stopLoading, isLoading: visible }}>
      {children}
      {visible && <GlobalLoader />}
    </LoadingContext.Provider>
  );
};

export const useLoading = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }

  return context;
};
