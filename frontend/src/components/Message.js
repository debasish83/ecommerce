import React from 'react'
import {Alert} from 'react-bootstrap'

function Message({variant, children}) {
    console.log(children)
    return (
        <Alert variant={variant}>
            {children}
        </Alert>
    )
}

export default Message
