import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const HomePage = () => {
  return (
    <div>
      <Header />
      <main>
        <h1 className="text-3xl font-bold underline">Hello world!</h1>
      </main>

      <Link to="/sing-up">Sign Up</Link>
      <Footer />
    </div>
  );
};

export default HomePage;
