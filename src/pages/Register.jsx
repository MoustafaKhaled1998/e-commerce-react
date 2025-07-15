import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useBlocker } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register, isAuthenticated } = useApp();
  const from = location.state?.from?.pathname || "/";
  const initialFormData = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: ""
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    try {
      if (!formData.username) {
        setErrors(prev => ({ ...prev, username: "Username is required" }));
        setIsSubmitting(false);
        return;
      }
      if (!formData.email) {
        setErrors(prev => ({ ...prev, email: "Email is required" }));
        setIsSubmitting(false);
        return;
      }
      if (!validateEmail(formData.email)) {
        setErrors(prev => ({ ...prev, email: "Invalid email format" }));
        setIsSubmitting(false);
        return;
      }
      if (!formData.password) {
        setErrors(prev => ({ ...prev, password: "Password is required" }));
        setIsSubmitting(false);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: "Passwords do not match" }));
        setIsSubmitting(false);
        return;
      }
      await register({ username: formData.username, email: formData.email });
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm p-4">
            <h2 className="mb-4 text-center">Register</h2>
            {errors.form && <div className="alert alert-danger">{errors.form}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input 
                  type="text" 
                  name="username"
                  placeholder="Username" 
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <div className="invalid-feedback">
                    {errors.username}
                  </div>
                )}
              </div>
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
                <small className="form-text text-muted">
                  Must contain at least 1 uppercase letter, 1 number, and 1 special character
                </small>
              </div>
              <div className="mb-3">
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm Password" 
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
              <div className="mb-3">
                <textarea 
                  name="address"
                  placeholder="Address (Optional)" 
                  className="form-control"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100 mb-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </button>
            </form>
            <div className="text-center mt-3">
              <span>Already have an account? </span>
              <Link to="/login">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 