import { Outlet } from "react-router";
import { Link } from "react-router-dom";

const BlogPage = () => {
  return (
    <div>
      BlogPage
      <Link to="/">Go Home</Link>
      <Link to="/admin">Go Admin</Link>
      <Outlet />
    </div>
  );
};

export default BlogPage;
