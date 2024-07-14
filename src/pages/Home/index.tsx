import { NavLink, Outlet } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <NavLink to="/sign-up">Sign Up</NavLink>
        <NavLink to="/sign-in">Sign In</NavLink>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
