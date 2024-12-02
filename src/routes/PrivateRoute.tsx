import { useEffect, type ReactElement } from "react";
// import SignIn from '@/features/signIn';
import Home from "@/pages/home";
// import useLoggedInStore from '@/store/useLoggedInStore';
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }) => {
  // const location = useLocation();
  const navigate = useNavigate();
  // TODO: 後續要改成從後端拿資料
  // const { isLoggedIn, userRoutes } = useLoggedInStore();
  const isLoggedIn = true;
  const valid = true;

  useEffect(() => {
    if (!valid) {
      navigate("/");
    }
  }, [valid]);

  return !isLoggedIn ? <Home /> : children;

  return children;
};

export default PrivateRoute;
