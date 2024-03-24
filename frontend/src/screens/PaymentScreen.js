import React, {useState, useEffect} from 'react'
import {useNavigate, useLocation} from 'react-router-dom'
import {Form, Button, Col} from 'react-bootstrap'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import CheckoutSteps from '../components/CheckoutSteps'
import {savePaymentMethod} from '../actions/cartActions'

function PaymentScreen() {
    const cart = useSelector(state => state.cart)
    const { shippingAddress } = cart
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [paymentMethod, setPaymentMethod] = useState('')
    
    const onPaymentMethodChange = ({ target: { value } }) => {
        setPaymentMethod(value);
      };
    
    useEffect(() => {
        if (!shippingAddress.address) {
            navigate('/shipping')
        }
    }, [navigate, shippingAddress])
    
    const submitHandler = (e) => {
        e.preventDefault()
        console.log(`payment Method ${paymentMethod}`)
        dispatch(savePaymentMethod(paymentMethod))
        navigate('/placeorder')
    }

    return (
        <FormContainer>
            <CheckoutSteps step1 step2 step3 />
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as='legend'>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            className="my-3"
                            type="radio"
                            label="PayPal or Credit Card"
                            id="PayPal"
                            name="paymentMethod"
                            value="PayPal"
                            checked={paymentMethod === "PayPal"}
                            onChange={onPaymentMethodChange}
                        />
                    </Col>
                </Form.Group>
                <Button type='submit' variant='primary'>
                    Continue
                </Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen
