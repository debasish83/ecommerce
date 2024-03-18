import React, {useState, useEffect} from 'react'
import {Link, useParams, useNavigate} from 'react-router-dom'
import {Row, Col, Image, ListGroup, Button, Card, Form} from 'react-bootstrap'
import Rating from '../components/Rating'
import axios from 'axios'
import Loader from '../components/Loader'
import Message from '../components/Message'

function ProductScreen() {
    let {id} = useParams()
    const navigate = useNavigate()
    const [qty, setQty] = useState(1)
    const [product, setProduct] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState()

    useEffect(() => {
        async function fetchProduct(id) {
            setLoading(true)
            setError()

            try {
                const { data } = await axios.get(`/api/products/${id}`)
                setProduct(data)
                setLoading(false)
            } catch(err) {
                console.log(err)
                //There is bug that when API fails we can't display error message
                setLoading(false)
                setError(err.message)
            }
        }
        console.log(`product id ${id}`)
        fetchProduct(id)
    }, [id])

    const addToCartHandler = () => {
        console.log(`Add to cart ${id}`)
        navigate(`/cart/${id}?qty=${qty}`)
    }

    return (
        <div>
            <Link to='/' className='btn btn-light my-3'>Go Back</Link>
            {
                loading ? <Loader/>
                : error ? <Message variant='danger'>error</Message>
                : ( <div>
                        <Row>
                    <Col md={6}>
                        <Image src={product.image} alt={product.name} fluid />
                    </Col>

                    <Col md={3}>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h3>{product.name}</h3>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <Rating 
                                value={product.rating} 
                                text={`${product.numReviews} ratings`} 
                                color={'#f8e825'}
                                />
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Price: ${product.price}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Description: ${product.description}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>

                    <Col md={3}>
                        <Card>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>${product.price}</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col>
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                >
                                                    {
                                                        [...Array(product.countInStock).keys()].map((x) => (
                                                            <option key={x+1} value={x+1}>
                                                                {x+1}
                                                            </option>
                                                        ))
                                                    }
                                            </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}

                                <ListGroup.Item>
                                    <Button 
                                    onClick={addToCartHandler}
                                    className='btn-block' 
                                    disabled={product.countInStock === 0}
                                    type='button'>
                                        Add to Cart
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                        </Row>
                    </div>
                )
            }
        </div>
    )
}

export default ProductScreen
