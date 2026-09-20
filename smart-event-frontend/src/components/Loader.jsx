import './Loader.css';

export default function Loader({ small = false }) {
  if (small) {
    return <span className="loader-spinner sm" />;
  }

  return (
    <div className="loader-overlay">
      <div className="loader-spinner" />
    </div>
  );
}
