import React, {useState, useEffect} from 'react'
import {Form, Button, Row, Col } from 'react-bootstrap'
import {Link, useParams} from 'react-router-dom'
import {useNavigate} from 'react-router-dom'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { getUserDetails, updateUser } from '../actions/userActions'
import { USER_UPDATE_RESET } from '../constants/userConstants'

function UserEditScreen() {
    const userId = useParams()['id']
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [admin, setAdmin] = useState(false)

    const userDetails = useSelector(state => state.userDetails)
    const {error, loading, user} = userDetails

    const userUpdate = useSelector(state => state.userUpdate)
    const {error:errorUpdate, loading:loadingUpdate, success} = userUpdate

    useEffect(() => {
        if (success) {
            dispatch({type: USER_UPDATE_RESET})
            navigate('/admin/userlist')
        } else {
            if(!user.name || user._id !== Number(userId)) {
                dispatch(getUserDetails(userId))
            } else {
                setName(user.name)
                setEmail(user.email)
                setAdmin(user.isAdmin)
            }
        }
    }, [user, dispatch, userId, navigate, success])
    
    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(updateUser({_id: user.id, name, email, admin}))
    }

    return (
        <div>
            <Link to='/admin/userlist'>
                Go Back
            </Link>

            <FormContainer>
                <h1>Edit User </h1>
                {loadingUpdate && <Loader />}
                {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                
                {loading ? <Loader/> : error ? <Message variant='danger'>{error} </Message> : (
                <Form onSubmit={submitHandler}>
                    <Form.Group controlId='name'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            required
                            type='name'
                            placeholder='Enter name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='email'>
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            required
                            type='email'
                            placeholder='Enter Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        >
                        </Form.Control>
                    </Form.Group>

                    <Form.Group controlId='isadmin'>
                        <Form.Check 
                            type='checkbox' 
                            label='Is Admin' 
                            checked={admin}
                            onChange={(e) => setAdmin(e.target.checked)}
                        >
                        </Form.Check>
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

export default UserEditScreen

