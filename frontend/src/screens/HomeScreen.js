import React, {useState, useEffect} from 'react';
import {Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useLocation } from 'react-router-dom';
import Paginate from '../components/Paginate';
import { listProducts } from '../actions/productActions';
import { useSelector, useDispatch } from 'react-redux';
import ProductCarousel from '../components/ProductCarousel';

function HomeScreen() {
    const productList = useSelector(state => state.productList)
    const {error, loading, products, page, pages} = productList

    const location = useLocation()
    const dispatch = useDispatch()

    //each time keyword is changed the API will be re-triggered since
    //we added it in the dependencies of useEffect
    let keyword = location.search

    //the API calls for fetchProducts are inside HomeScreen component
    //We may need to share the product list with rest of the application
    //Use Context and Hooks to share the list with rest of the application
    //this logic need to move under hooks
    useEffect(() => {
        dispatch(listProducts(keyword))
        // async function fetchProducts() {
        //     setLoading(true)
        //     setError()
        //     try {
        //         const { data } = await axios.get('http://localhost:8000/api/products/')
        //         setProducts(data)
        //         setLoading(false)
        //     } catch(err) {
        //         console.log(err)
        //         setLoading(false)
        //         //There is bug that when API fails we can't display error message
        //         setError(err)
        //     }
        // }
        // fetchProducts()
    }, [dispatch, keyword])

    return (
        <div>
            {!keyword && <ProductCarousel />}

            <h1>Latest Products</h1>
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error.message}</Message>
                    :
                    <div>
                        <Row>
                            {products.map(product => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                        </Row>
                        <Paginate page={page} pages={pages} keyword={keyword} />
                    </div>
            }
        </div>
    )
}

export default HomeScreen
