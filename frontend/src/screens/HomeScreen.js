import React, {useState, useEffect} from 'react';
import {Row, Col} from 'react-bootstrap'
import Product from '../components/Product'
import axios from 'axios'
import Loader from '../components/Loader';
import Message from '../components/Message';

function HomeScreen() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    //the API calls for fetchProducts are inside HomeScreen component
    //We may need to share the product list with rest of the application
    //Use Context and Hooks to share the list with rest of the application
    //this logic need to move under hooks
    useEffect(() => {
        async function fetchProducts() {
            setLoading(true)
            setError()
            try {
                const { data } = await axios.get('http://localhost:8000/api/products/')
                setProducts(data)
                setLoading(false)
            } catch(err) {
                console.log(err)
                setLoading(false)
                //There is bug that when API fails we can't display error message
                setError(err)
            }
        }
        fetchProducts()
    }, [])

    return (
        <div>
            <h1>Latest Products</h1>
            {loading ? <Loader />
                : error ? <Message variant='danger'>{error.message}</Message>
                    : (
                    <Row>
                        {products.map(product => (
                            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                <Product product={product} />
                            </Col>
                        ))}
                    </Row>
                    )
            }
        </div>
    )
}

export default HomeScreen
