import { Routes, Route } from "react-router-dom";
import WebsiteLayout from "./layouts/WebsiteLayout/WebsiteLayout";
import Home from "./pages/Home/Home";
import Post from "./pages/Post/Post";
import Signin from "./pages/Signin/Signin";
import Signup from "./pages/Signup/Signup";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
import AddPost from "./pages/Addpost/Addpost";
import Profile from "./pages/Profile/Profile";
import UpdatePost from "./pages/UpdatePost/UpdatePost";

const WebsiteRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<WebsiteLayout />}>
        <Route index element={<Home />} />
        <Route path="post/:id" element={<Post />} />
        <Route path="profile" element={<Profile />} />
        <Route path="addpost" element={<AddPost />} />
        <Route path="updatepost/:id" element={<UpdatePost />} />
      </Route>

      <Route path="signin" element={<Signin />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgotpassword" element={<ForgotPassword />} />
    </Routes>
  );
};

export default WebsiteRoutes;
