import { useState, useContext, useEffect } from "react";
import ReactPaginate from "react-paginate";
export default function Pagination({
  totalItems,
  totalPages,
  currentPage = 1,
  getData,
  search,
  limit,
  loading,
}) {
  useEffect(() => {
    console.log("currentPage in useEffect", currentPage,limit);
  }, [currentPage]);
  const handlePageClick = (event) => {
    const newOffset = ((event.selected + 1) * limit) % totalItems;

    getData({
      page: event.selected + 1,
    });
    // setItemOffset(newOffset);
  };
  return (
    <div className="text-center" >
      <div className="pagination-box pagination-sec d-flex align-items-center flex-wrap pt-3" style={{width:'100%',display:"flex",justifyContent:'space-between'}}>
        {loading ? (
          <div className="numbers-pag me-auto"></div>
        ) : (
          <div className="numbers-pag me-auto">
            Showing {(currentPage - 1) * limit + 1} to{" "}
            {currentPage * limit < totalItems
              ? currentPage * limit
              : totalItems}{" "}
            of {totalItems} entries
          </div>
        )}
        <div className="right-sec">
          <nav aria-label="Page navigation example">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Next"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={totalPages}
              previousLabel="Prev"
              renderOnZeroPageCount={null}
              pageClassName="page-item"
              pageLinkClassName="page-link"
              className="pagination mb-0"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              activeClassName="active"
              initialPage={currentPage - 1}
              forcePage={currentPage - 1}
            />
          </nav>
        </div>
      </div>
    </div>
  );
}
