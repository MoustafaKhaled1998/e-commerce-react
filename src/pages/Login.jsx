import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useBlocker } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useApp();
  const from = location.state?.from?.pathname || "/";
  const initialFormData = useRef(null);

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    if (!initialFormData.current) {
      initialFormData.current = { ...formData };
    }
  }, []);

  useEffect(() => {
    if (initialFormData.current) {
      const hasChanges = Object.keys(formData).some(
        key => formData[key] !== initialFormData.current[key]
      );
      setIsDirty(hasChanges);
    }
  }, [formData]);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && !isSubmitting && currentLocation.pathname !== nextLocation.pathname
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowConfirmDialog(true);
      setPendingNavigation(blocker.location);
    }
  }, [blocker]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      if (!formData.email) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
        setIsSubmitting(false);
        return;
      }
      if (!formData.password) {
        setErrors(prev => ({ ...prev, password: "Password is required" }));
        setIsSubmitting(false);
        return;
      }
      await login({ email: formData.email });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-center">Login</h2>
            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password}
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </button>
            </form>
            <div className="text-center mt-3">
              <span>Don't have an account? </span>
              <Link to="/register">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 