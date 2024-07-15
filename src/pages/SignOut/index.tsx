import { useNavigate } from "react-router-dom";
import { useLogout } from "@/hook/loginApi";
import useLoginStore from "@/store/loginStore";

const SignOutPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useLogout();
  const { logOut } = useLoginStore();

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      logOut();
      navigate("/sign-out");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div>
      <h1>Logout</h1>
      <p>Are you sure you want to log out?</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default SignOutPage;
