
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/courses");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">CodeCast</h1>
        <p className="text-xl text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  );
};

export default Index;
