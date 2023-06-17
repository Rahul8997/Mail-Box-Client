import React, { useRef } from 'react';
import './Inbox'
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import JoditEditor from 'jodit-react';
import useHttp from '../Hooks/use-http';

function removeSpecialChar(mail) {
    let newMail = "";
    for (let i = 0; i < mail.length; i++) {
        if (mail[i] !== "@" && mail[i] !== ".") {
            newMail += mail[i]
        }
    }
    return newMail;
}

const afterSentMailreq = (data) => {
    // console.log(data);
    // console.log("sent to sent mail")
}

function ComposeMail() {
    const user = removeSpecialChar(useSelector(state => state.authentication.user));
    const receiver = useRef();
    const subject = useRef();
    const mailBody = useRef();
    const sender = useSelector(state => state.authentication.user);
    const sentMailReq = useHttp();

    const handleSendMail = async (e) => {
        e.preventDefault();
        // console.log("sended");
        // console.log(receiver.current.value, subject.current.value, mailBody.current.value, sender);

        const newMail = {
            mailSubject: subject.current.value,
            mailContent: mailBody.current.value,
            Sender: sender,
            isReaded: false
        }

        if (receiver.current.value.length > 0 && mailBody.current.value.length > 0 && subject.current.value.length > 0) {

            try {
                let responce = await fetch(
                    `https://react-mailbox-client-8409e-default-rtdb.firebaseio.com/mail/${removeSpecialChar(receiver.current.value)}.json`,
                    {
                        method: 'POST',
                        body: JSON.stringify(newMail),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                if (responce.ok) {
                    let data = await responce.json();
                    // console.log(data);
                    alert("mail sent successfully");
                    sentMailReq(
                        {
                            url: `https://react-mailbox-client-8409e-default-rtdb.firebaseio.com/sentmail/${user}.json`,
                            method: "POST",
                            body: { ...newMail, receiver: receiver.current.value }
                        },
                        afterSentMailreq
                    );

                } else {
                    throw new Error("Failed to send mail")
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            alert("please fill all the data")
        }
    }

    return (
        <>
            <div className="container">
                <h1 className="text-center">
                    Draft your mail
                </h1>
                <div className='my-2'>
                    <input type="email" className="form-control" id="exampleInputEmail1" placeholder='To' ref={receiver} aria-describedby="emailHelp" />

                </div>
                <div className='my-2'>
                    <input type="email" className="form-control" id="exampleInputSubject" ref={subject} aria-describedby="emailHelp" placeholder='Subject' />
                </div>
                <JoditEditor config={{ placeholder: "Draft your mail here", height: 320, allowResizeX: false }} ref={mailBody} />
            </div>
            <div className='row my-3'>
                <div className='col-lg-3 col-md-4 col-sm-6 col-11 mx-auto text-center'>
                    <Button variant="primary" className='w-100' onClick={handleSendMail}>
                        Send
                    </Button>
                </div>
            </div>
        </>
    )
}

export default ComposeMail;
