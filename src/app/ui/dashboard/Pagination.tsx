import { useState } from 'react';

const Pagination = (props: any) => {
    const [currentPage, setCurrentPage] = useState(props.currentPage);
    
    const handleChanges = (page: number) => {
        props.setCurrentPage(page);
        setCurrentPage(page);
        const currentPageElemt = document.getElementById("page"+currentPage);
        currentPageElemt!.className = currentPageElemt!.className.replace("is-current", "");
        const newPageElemt = document.getElementById("page"+page);
        newPageElemt!.className += " is-current";
        if(page === 1)
            props.setPaginationButtons(props.renderPaginationButtons(props.totalPages));
        if(page === props.totalPages)
            props.setPaginationButtons(props.renderPaginationButtonsReverse(props.totalPages));
        const offset = props.limit * (page - 1);
        props.setTable(offset);
    }
    
    return (
        <nav className="pagination is-small" role="navigation" aria-label="pagination">
            <a href="#" className="pagination-previous">Anterior</a>
            <a href="#" className="pagination-next">Siguiente</a>
            <ul className="pagination-list">
                <li>
                    <a 
                        href="#" 
                        id={ `page1` }
                        className="pagination-link is-current" 
                        aria-label="Goto page 1"
                        onClick={() => handleChanges(1)}> 1 
                    </a>
                </li>
                <li>
                    <span className="pagination-ellipsis">&hellip;</span>
                </li>
                {props.paginationButtons.map((page: number) => {
                    return(
                        <li key={page}>
                            <a 
                                href="#" 
                                id={ `page${page}` }
                                className="pagination-link" 
                                aria-label={`Goto page `} 
                                onClick={() => handleChanges(page)}>
                                { page }
                            </a>
                        </li>
                    );
                })}
                <li>
                    <span className="pagination-ellipsis">&hellip;</span>
                </li>
                <li>
                    <a 
                        href="#" 
                        id={ `page${props.totalPages}` }
                        className="pagination-link" 
                        aria-label={`Goto page `}
                        onClick={() => handleChanges(props.totalPages)}>
                        { props.totalPages }
                    </a>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;