import React from 'react';

export default function Pagination({ currentPage, totalPages, handlePageChange, getVisiblePages, message, setError }) {
  return (
    <>
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center align-items-center text-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <span aria-hidden="true">&laquo;</span>
              <span className="sr-only">Previous</span>
            </button>
          </li>

          {getVisiblePages().map(page => (
            <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
              <button
                onClick={() => handlePageChange(page)}
                className="page-link"
                aria-label={`Page ${page}`}
              >
                {page}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <span aria-hidden="true">&raquo;</span>
              <span className="sr-only">Next</span>
            </button>
          </li>
        </ul>
      </nav>

      {message && <p>{message}</p>}
      {setError && <p className="text-danger">{setError}</p>}
    </>
  );
};