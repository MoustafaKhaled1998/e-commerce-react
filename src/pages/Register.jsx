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

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasNumber && hasSpecialChar;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.includes(" ")) {
      newErrors.username = "Username cannot contain spaces";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!validatePassword(formData.password)) {
      newErrors.password = "Password must contain at least 1 uppercase letter, 1 number, and 1 special character";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }

    if (name === "password" && errors.confirmPassword) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: ""
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        const userData = {
          username: formData.username,
          email: formData.email,
          address: formData.address,
          id: Date.now()
        };
        setIsSubmitting(false);
        setIsDirty(false);
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in with your credentials.',
            registeredEmail: formData.email 
          } 
        });
      }, 1000);
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
    setIsDirty(false);
    if (pendingNavigation) {
      navigate(pendingNavigation.pathname);
    }
  };

  const handleCancelNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
    blocker.reset?.();
  };

  return (
    <>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body p-4">
                <h2 className="text-center mb-4">Register</h2>
                {from !== "/" && (
                  <div className="alert alert-info mb-3">
                    <small>Please register to access the requested page.</small>
                  </div>
                )}
                {isDirty && (
                  <div className="alert alert-warning alert-dismissible fade show" role="alert">
                    <small>
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      You have unsaved changes. Please save your form or confirm navigation.
                    </small>
                  </div>
                )}
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
                  <div className="text-center">
                    <small className="text-muted">
                      Already have an account? <Link to="/login" className="text-decoration-none">Login here</Link>
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showConfirmDialog && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Unsaved Changes</h5>
                <button type="button" className="btn-close" onClick={handleCancelNavigation}></button>
              </div>
              <div className="modal-body">
                <p>You have unsaved changes. Are you sure you want to leave this page?</p>
                <p className="text-muted small">Your form data will be lost if you continue.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCancelNavigation}>
                  Stay on Page
                </button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmNavigation}>
                  Leave Page
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 