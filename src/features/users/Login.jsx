import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "./userSlice";
import { Link } from "react-router-dom";
import videoSrc from "../../assets/userLogin.mov";
import "bootstrap/dist/css/bootstrap.min.css";

const Login = () => {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { status, error } = useSelector((state) => state.users);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <div className="position-relative min-vh-100 d-flex align-items-center justify-content-center">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="position-absolute w-100 h-100 object-fit-cover"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      {/* Overlay for Readability */}
      <div className="position-absolute w-100 h-100 bg-dark opacity-50"></div>

      <div className="container position-relative z-2">
        <div className="row justify-content-center">
          {/* Quotes Section (Left) */}
          <div className="col-lg-6 text-light text-center mb-4">
            <h1 className="display-5 fw-bold text-warning">
              LARGER NETWORK FOR BETTER CHOICE
            </h1>
            <p className="lead text-light">
              📌With a Manufacturing Unit, Franchises, Outlets, and Main
              Branches spread across Uttar Pradesh, Bangalore, and MG Road📌
            </p>

            <h2 className="mt-4 text-success">🚴‍♂️ THE HEALTHIER LIFESTYLE 🚴‍♂️</h2>
            <p className="lead text-light">
              🔥'Cycle Wala' provides you the Best value for your Bicycle
              purchase. Ride towards a Healthier Life with Us!
            </p>
          </div>

          {/* Login/Register Card (Right) */}
          <div className="col-lg-5">
            <div className="card p-4 shadow-lg text-center">
              <img
                src="https://img.icons8.com/?size=100&id=dAlamlyPh1kU&format=png&color=000000"
                alt="User Icon"
                className="mb-3"
                style={{ width: "80px", height: "80px" }}
              />

              <h4 className="fw-bold text-primary">
                {isRegister ? "Join the CycleWala Community!" : "Welcome Back!"}
              </h4>
              <p className="text-muted fst-italic">
                Eco-Friendly, Comfortable to Ride, and Reliable for Adventure!
              </p>

              {error && <div className="alert alert-danger">{error}</div>}

              <form onSubmit={isRegister ? handleRegister : handleLogin}>
                {isRegister && (
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    placeholder="Enter your email 📩"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="pass">
                    Password
                  </label>
                  <input
                    id="pass"
                    type="password"
                    className="form-control"
                    placeholder="Password 🔐"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  {status === "loading"
                    ? isRegister
                      ? "Signing up..."
                      : "Logging in..."
                    : isRegister
                    ? "Register"
                    : "Login"}
                </button>
              </form>

              <div className="text-center mt-3">
                <button
                  className="btn btn-link"
                  onClick={() => setIsRegister(!isRegister)}
                >
                  {isRegister
                    ? "Already have an account? Log in"
                    : "Don't have an account? Sign up"}
                </button>
              </div>

              <div className="mt-3">
                <Link to="/admin/login" className="btn btn-danger w-100">
                  Admin Login🛠️
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/*  Footer Quote */}
        <div className="text-center text-light mt-5">
          <p className="lead-1 fs-5 text-warning">
            🌟Cycle Wala 🌟 The Largest Cycle Shop in Uttar Pradesh, Dealing
            with the Best Quality Bicycles🌟
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
