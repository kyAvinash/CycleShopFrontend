const Footer = () => {
  return (
    <footer
      className="text-light"
      style={{
        backgroundColor: "#1a1a1a",
        borderTop: "3px solid gold",
        padding: "40px 0",
      }}
    >
      <div className="container">
        <div className="row">
          {/* Contact Info */}
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-warning">Contact Us</h4>
            <p>📍 123 Ghazipur, Uttar Pradesh, 233001, India</p>
            <p>📞 +91-9148903040</p>
            <p>📧 info@cyclewalacare.com</p>
          </div>

          {/* Brand Section */}
          <div className="col-md-4 text-center mb-4">
            <h3 className="fw-bold text-warning">
              <span style={{ fontSize: "30px" }}>&#128690;</span> Cycle Wala
            </h3>
            <p>
              "The journey of cycling is a freedom that never fades, bringing
              lasting joy to your soul and the open road."
            </p>
          </div>

          {/* Social Media Links */}
          <div className="col-md-4 text-center mb-4">
            <h4 className="fw-bold text-warning">Follow Us</h4>
            <div className="d-flex justify-content-center">
              <a href="#" className="me-3">
                <img
                  src="https://img.icons8.com/?size=100&id=gRof6ATajUxk&format=png&color=000000"
                  alt="Facebook"
                  style={{ width: "40px", height: "40px" }}
                />
              </a>
              <a href="#" className="me-3">
                <img
                  src="https://img.icons8.com/?size=100&id=nj0Uj45LGUYh&format=png&color=000000"
                  alt="Instagram"
                  style={{ width: "40px", height: "40px" }}
                />
              </a>
              <a href="#" className="me-3">
                <img
                  src="https://img.icons8.com/?size=100&id=kBCrQMzpQDLQ&format=png&color=000000"
                  alt="X"
                  style={{ width: "40px", height: "40px" }}
                />
              </a>
            </div>
          </div>
        </div>

        <hr className="bg-warning" />

        {/* Copyright & Developer Credit */}
        <p className="text-center mt-3 text-warning">
          &copy; 2025 Cycle Wala. All Rights Reserved.
          <br />
          Developed by <strong>Avinash</strong> 🚀
        </p>
      </div>
    </footer>
  );
};

export default Footer;
