import React, { useEffect } from 'react';
import './Inbox'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Accordion, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { messageActions } from '../Store';
import { useHistory } from 'react-router-dom';
import {  Trash3Fill } from 'react-bootstrap-icons';
import useHttp from '../Hooks/use-http';

import emptyimage from '../Images/emptymail.PNG'

function removeSpecialChar(mail) {
  let newMail = "";
  for (let i = 0; i < mail.length; i++) {
    if (mail[i] !== "@" && mail[i] !== ".") {
      newMail += mail[i]
    }
  }
  return newMail;
}



function countUnreadMessages(arr) {
  let unreadeMessages = 0;
  for (let i = 0; i < arr.length; i++) {
    if (!arr[i].isReaded) {
      unreadeMessages = unreadeMessages + 1;
    }
  }
  return unreadeMessages;
}

function Inbox() {
  const user = removeSpecialChar(useSelector(state => state.authentication.user));
  const messages = useSelector(state => state.messages.messages);
  const dispatch = useDispatch();
  const history = useHistory();
  const deleteReq = useHttp();
  const fecthingMailReq = useHttp();
  const handleReadReq = useHttp();

  const handleCompose = (e) => {
    e.preventDefault();
    history.push("/composemail");
  }

  const afterhandleReadReq = () => {
    // console.log("message readed");
  }

  const afterDeleteReq = (data) => {
    alert("deleted successfully")
  }

  const afterFechingMailReq = (data) => {
    // console.log("fetched successfully")
    let newMessageArray = [];
    if (data == null) {
      newMessageArray = [];
      dispatch(messageActions.setMessages(newMessageArray));
      dispatch(messageActions.setUnreadMessages(countUnreadMessages(newMessageArray)));
    } else {
      const keys = Object.keys(data);
      keys.forEach((key) => {
        newMessageArray.unshift({ ...data[key], name: key })
      });
      // console.log(newMessageArray);
      dispatch(messageActions.setMessages(newMessageArray));
      dispatch(messageActions.setUnreadMessages(countUnreadMessages(newMessageArray)));
    }
  }

  const handleReadedMessage = async (msg) => {
    handleReadReq(
      {
        url: `https://react-mailbox-client-8409e-default-rtdb.firebaseio.com/mail/${user}/${msg.name}.json`,
        method: "PATCH",
        body: { "isReaded": true }
      },
      afterhandleReadReq
    );
  }

  const handleDelete = async (msg) => {
    deleteReq(
      {
        url: `https://react-mailbox-client-8409e-default-rtdb.firebaseio.com/mail/${user}/${msg.name}.json`,
        method: "DELETE",
      },
      afterDeleteReq
    );

  }


  useEffect(() => {
    async function fetchMessages() {
      fecthingMailReq(
        {
          url: `https://react-mailbox-client-8409e-default-rtdb.firebaseio.com/mail/${(user)}.json`,
          method: "GET"
        },
        afterFechingMailReq
      );
    }
    let fetching = setTimeout(() => {
      fetchMessages();
    }, 2000);
    return () => {
      clearTimeout(fetching);
    }
  }, [user, afterFechingMailReq, fecthingMailReq])


  return (
    <div>
      <h1 className='text-center'>
        {messages.length !== 0 ? "Inbox" :
          <div className="d-flex align-items-center justify-content-center" style={{ height: "600px" }}>
            <img className='mx-1 my-1' src={emptyimage} alt="Canvas Logo" />
          </div>
        }
      </h1>
      <div className='row my-3'>
        <div className='col-lg-8 col-md-6 col-sm-6 col-7 mx-auto text-start ms-2'>
          {messages.length > 0 && <span className='fs-4'>Unread Messages:{countUnreadMessages(messages)}</span>}
        </div>
        {messages.length > 0 && <div className='col-lg-3 col-md-5 col-sm-5 col-4 mx-auto text-center me-0'>
          <Button variant="primary" className='' onClick={handleCompose}>
            Compose
          </Button>
        </div>}
      </div>

      {
        messages.map((message) => {
          return <div className='row'>
            <div className='col-lg-10 col-md-10 col-sm-9 col-8 ms-2' >
              <Accordion defaultActiveKey="0" onClick={() => handleReadedMessage(message)}>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>
                    From:{message.Sender}
                    {!message.isReaded && <span className="mx-2 fs-6 badge bg-primary">New</span>}
                  </Accordion.Header>
                  <Accordion.Body>
                    <h5>Subject:{message.mailSubject}</h5>
                    <div className="Container" dangerouslySetInnerHTML={{ __html: message.mailContent }}></div>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
            <div className='col-lg-1 col-md-1 col-sm-2 col-3 ms-0 text-center'>
              <Button variant="danger" className='w-100 mx-auto' onClick={() => handleDelete(message)}>
                <Trash3Fill className='p-2' width={"38"} height={"38"} />
              </Button>
            </div>
          </div>
        })
      }

    </div>
  )
}

export default Inbox;









