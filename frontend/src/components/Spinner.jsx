// src/components/Spinner.jsx
// Simple centered loading spinner used across pages.

const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5">
      <div
        className="spinner-border text-warning"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-muted mt-3">{message}</p>
    </div>
  );
};

export default Spinner;
