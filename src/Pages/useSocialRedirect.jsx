import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useSocialRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const token = query.get("token");   
    if (token) {
      localStorage.setItem("token", token);
      navigate("/profile-basic-info");
    }
  }, []);
};

export default useSocialRedirect;
