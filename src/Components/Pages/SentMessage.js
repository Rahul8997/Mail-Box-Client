import React from 'react'
import { Accordion } from 'react-bootstrap'

const SentMessage = (props) => {
    return (
        <div>
            <Accordion defaultActiveKey="0" >
                <Accordion.Item eventKey="1">
                    <Accordion.Header>
                        To:{props.message.receiver}
                    </Accordion.Header>
                    <Accordion.Body>
                        <h5>Subject:{props.message.mailSubject}</h5>
                        <div className="Container" dangerouslySetInnerHTML={{ __html: props.message.mailContent }}></div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default SentMessage
