import { useState, useEffect } from 'react';

const Pagination = (props: any) => {
    const [currentPage, setCurrentPage] = useState(props.currentPage);

    useEffect(() => {

    }, []);

    const handleChanges = () => {

    }
    
    return (
        <nav className="pagination" role="navigation" aria-label="pagination">
  <a href="#" className="pagination-previous">Previous</a>
  <a href="#" className="pagination-next">Next page</a>
  <ul className="pagination-list">
    <li>
      <a href="#" className="pagination-link is-current" aria-label="Goto page 1">1</a>
    </li>
    <li>
      <span className="pagination-ellipsis">&hellip;</span>
    </li>
    <li>
      <a href="#" className="pagination-link" aria-label={`Goto page `}>{ parseInt(currentPage) + 1 }</a>
    </li>
    <li>
      <a
        className="pagination-link"
        aria-label={`Page `}
        aria-current="page"
        >{ parseInt(currentPage) + 2 }</a>
    </li>
    <li>
      <a href="#" className="pagination-link" aria-label={`Goto page `}>{ parseInt(currentPage) + 3 }</a>
    </li>
    <li>
      <span className="pagination-ellipsis">&hellip;</span>
    </li>
    <li>
      <a href="#" className="pagination-link" aria-label={`Goto page `}>{ props.totalRows }</a>
    </li>
  </ul>
</nav>
    );
}

export default Pagination;