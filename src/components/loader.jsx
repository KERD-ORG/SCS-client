import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Loader = () => {
  return (
    <>
      <style jsx>{`
        .spinner-border-custom {
          width: 4rem;
          height: 4rem;
          border-width: 0.3rem;
          animation: spinner-border 0.75s linear infinite;
        }

        .spinner-container {
          display: flex;
          justify-content: center;
          position: absolute;
          align-items: center;
          height: 100vh;
          width: 100vw;
          backdrop-filter: blur(2px); 
          background: transparent; 
          z-index: 9999;
        }
      `}</style>
      <div className="spinner-container">
        <div className="spinner-border spinner-border-custom text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Loader;
