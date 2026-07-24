import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { persistAuthToken } from "../utils/apiHeaders";

const useSocialRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");
    if (token) {
      persistAuthToken(token);
      navigate("/profile-basic-info");
    }
  }, [navigate]);
};

export default useSocialRedirect;
