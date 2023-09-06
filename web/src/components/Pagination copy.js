import { useState, useContext, useEffect } from "react";

export default function Pagination({
  totalItems,
  totalPages,
  currentPage,
  getData,
  search,
}) {
  const [pages, setPages] = useState([1, 2, 3, 4]);

  const pagination_length = (page) => {
    if (totalPages - page <= 4) {
      // console.log("totalPages - page>>>>", totalPages - page);
      if (totalPages - page > 0) {
        return totalPages - page;
      } else {
        return 4;
      }
    } else if (totalPages > 4) {
      return 4;
    }
  };
  const getCustomPages = (page = currentPage) => {
    let startFrom = totalPages - 4;

    let newPages = Array.from({ length: pagination_length() }, (_, i) => {
      return page == totalPages ? i + startFrom : i + 1;
    });
    setPages(newPages);
  };
  useEffect(() => {
    getCustomPages();
  }, [totalPages]);
  const getPageData = (page) => () => {
    let page_length = totalPages - page <= 3 ? totalPages - page : 4;
    page_length = page_length <= 0 ? 3 : page_length;

    getCustomPages(page);

    getData({
      page: page,
    });
  };

  return (
    <div className="text-center">
      <div className="pagination-sec d-flex align-items-center flex-wrap pt-3">
        <div className="numbers-pag me-auto">
          Showing {currentPage * 5 - 5 + 1} to {currentPage * 5} of {totalItems}{" "}
          entries
        </div>
        <div className="right-sec">
          <nav aria-label="Page navigation example">
            <ul className="pagination mb-0">
              <li className="page-item">
                {currentPage > 1 ? (
                  <a
                    className="page-link"
                    href="#"
                    onClick={getPageData(currentPage - 1)}
                  >
                    Prev
                  </a>
                ) : (
                  ""
                )}
              </li>
              {pages.map((p, i) => {
                return (
                  <li
                    className={`page-item ${currentPage == p ? "active" : ""}`}
                  >
                    <a className="page-link" href="#" onClick={getPageData(p)}>
                      {p}
                    </a>
                  </li>
                );
              })}

              <li className="page-item">
                {currentPage == totalPages ? (
                  ""
                ) : (
                  <a
                    className="page-link"
                    href="#"
                    onClick={getPageData(currentPage + 1, true)}
                  >
                    Next
                  </a>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
