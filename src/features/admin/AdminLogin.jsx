import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin, adminSignup } from "./adminSlice";
import { Link, useNavigate } from "react-router-dom";
import videoSrc from "../../assets/h91d8eec1_4148053.mov";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { status, error } = useSelector((state) => state.admin);

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(adminLogin({ email, password })).unwrap();
        navigate("/admin/dashboard");
      } else {
        await dispatch(adminSignup({ email, password })).unwrap();
        navigate("/admin/login");
      }
    } catch (error) {
      // Error handled in adminSlice
    }
  };

  return (
    <div className="position-relative vh-100 d-flex justify-content-center align-items-center text-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="position-absolute w-100 h-100 object-fit-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="container position-relative z-1">
        {/* Welcome Message */}
        <div className="mb-4 text-center text-black">
          <h1 className="display-5 fw-bold">
            Welcome to CycleWala Admin Panel 🚴‍♂️
          </h1>
          <p className="lead fst-italic fw-bold text-danger">
            "Great things are done by a series of small things brought
            together."
          </p>
        </div>

        {/* Login/Signup Card */}
        <div
          className="card shadow-lg p-4 mx-auto"
          style={{ maxWidth: "400px" }}
        >
          <div className="text-center">
            <img
              src="https://img.icons8.com/?size=100&id=dAlamlyPh1kU&format=png&color=000000"
              alt="Admin Icon"
              className="mb-3"
              style={{ width: "80px", height: "80px" }}
            />
          </div>

          <h4 className="fw-bold text-primary">
            {isLogin ? "Welcome Back, Admin!" : "Join the CycleWala Team!"}
          </h4>
          <p className="text-muted fst-italic">
            "Success is the sum of small efforts, repeated daily."
          </p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleAuth}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={status === "loading"}
            >
              {status === "loading"
                ? isLogin
                  ? "Logging in..."
                  : "Signing up..."
                : isLogin
                ? "Login"
                : "Signup"}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              className="btn btn-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "Don't have an account? Signup"
                : "Already have an account? Login"}
            </button>
          </div>

          <div className="mt-3">
            <Link to="/" className="btn btn-danger w-100">
              Go Back To User Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
