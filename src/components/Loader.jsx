import "./Loader.css";

export default function Loader() {
  return (
    <div className="loader-overlay">
      <div className="loader">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    </div>
  );
} 