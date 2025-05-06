
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to dashboard if at root
    navigate("/");
  }, [navigate]);
  
  return null;
};

export default Index;
