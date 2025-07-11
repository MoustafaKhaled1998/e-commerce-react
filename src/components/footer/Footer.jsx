import "./Footer.css";

export default function Footer() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h5>FashionHub</h5>
            <p className="text-muted">Your one-stop destination for fashion and lifestyle products.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="text-muted mb-0">&copy; 2024 FashionHub. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
