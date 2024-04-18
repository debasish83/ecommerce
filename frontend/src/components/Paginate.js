import React from 'react'
import {Pagination, Nav} from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import {Link} from 'react-router-dom'
function Paginate({pages, page, keyword='', isAdmin = false}) {
    if (keyword) {
        keyword = keyword.split('?keyword=')[1].split('&')[0]
    }
    console.log('Keyword: ', keyword)

    return (pages > 1 && (
        <Pagination>
            {[...Array(pages).keys().map((x) => (
                <Nav.Link as={Link}
                key={x+1}
                to={!isAdmin ? `/?keyword=${keyword}&page=${x+1}` 
                    : `/admin/productlist/?keyword=${keyword}&page=${x+1}`}
                >
                    <Pagination.Item active={x+1 === page}>{x+1}</Pagination.Item>
                </Nav.Link>
            ))]}
        </Pagination>
    ))
}

export default Paginate
