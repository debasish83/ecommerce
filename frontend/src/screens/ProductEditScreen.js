import React, {useState, useEffect} from 'react'
import {Form, Button} from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import {listProductDetails, updateProduct} from '../actions/productActions'
import {PRODUCT_UPDATE_RESET} from '../constants/productConstants'
import axios from 'axios'

function ProductEditScreen() {
    const productId = useParams()['id']
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [category, setCategory] = useState('')
    const [countInStock, setCountInStock] = useState('')
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    const productDetails = useSelector(state => state.productDetails)
    const {error, loading, product} = productDetails

    const productUpdate = useSelector(state => state.productUpdate)
    const {error:errorUpdate, loading:loadingUpdate, success:successUpdate} = productUpdate

    console.log('product details')
    console.log(JSON.stringify(product))

    useEffect(() => {
        if(successUpdate) {
            dispatch({type:PRODUCT_UPDATE_RESET})
            navigate('/admin/productlist')
        } else {
            if (!product.name || product._id !== Number(productId)) {
                dispatch(listProductDetails(productId))
            } else {
                setName(product.name)
                setPrice(product.price)
                setImage(product.image)
                setBrand(product.brand)
                setCategory(product.category)
                setCountInStock(product.countInStock)
                setDescription(product.description)
            }
        }
    }, [product, dispatch, navigate, productId, successUpdate])
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateProduct({
            _id:productId,
            name,
            price,
            image,
            brand,
            category,
            countInStock,
            description
        }))
    }

    const uploadFileHandler = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData()
        formData.append('image', file)
        formData.append('product_id', productId)
        setUploading(true)
        console.log('Selected file:', file);
        try {
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                }
            }

            const {data} = await axios.post('http://localhost:8000/api/products/upload/',formData, config)
            // You can do further processing with the selected file here
            // we can use files to upload images, pdf and other documents like audio, video and other inputs
            // captured by our senses - see, taste, smell, hear,  
            setImage(data)
            setUploading(false)
        } catch (error) {
            setUploading(false)
        }
    }

    return (
        <div>
            <Link to='/admin/productlist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit Product </h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}

                {loading ? <Loader/> : error ? <Message variant='danger'>{error} </Message> 
                : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId='price'>
                        <Form.Label>Price</Form.Label>
                        <Form.Control
                            required
                            type='number'
                            placeholder='Enter price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>
                    
                    <Form.Group controlId="formFile">
                    <Form.Label>Image</Form.Label>
                    <Form.Control type="file" onChange={uploadFileHandler} />
                    {uploading && <Loader />}
                    </Form.Group>

                    <Form.Group controlId='brand'>
                        <Form.Label>Brand</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='countInStock'>
                        <Form.Label>Stock</Form.Label>
                        <Form.Control
                            required
                            type='number'
                            placeholder='Enter stock'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='category'>
                        <Form.Label>Category</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='description'>
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            required
                            type='text'
                            placeholder='Enter description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Button type='submit' variant='primary'>
                        Update
                    </Button>
                </Form>
                )}
            </FormContainer>
        </div>
    )
}

export default ProductEditScreen
