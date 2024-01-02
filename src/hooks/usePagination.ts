import { useState } from 'react';

function usePagination(defaultPage = 1, defaultItemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(defaultPage);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);

  const handlePageChange = (pageNumber:number) => {
    setCurrentPage(pageNumber);
  };

  const setItemsPerPageAndResetPage = (perPage:number) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  return {
    currentPage,
    itemsPerPage,
    handlePageChange,
    setItemsPerPageAndResetPage,
  };
}

export default usePagination;
