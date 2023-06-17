import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import useHttp from '../Hooks/use-http';
import { messageActions } from '../Store';
import SentMessage from './SentMessage';

function removeSpecialChar(mail) {
    let newMail = "";
    for (let i = 0; i < mail.length; i++) {
        if (mail[i] !== "@" && mail[i] !== ".") {
            newMail += mail[i]
        }
    }
    return newMail;
}

const Sent = () => {
    const user = removeSpecialChar(useSelector(state => state.authentication.user));
    const sentMessages = useSelector(state => state.messages.sentMessages);
    const dispatch = useDispatch();
    const sentMailReq = useHttp();

    const afterFechingSentMailReq = (data) => {
        let newMessageArray = [];
                const keys = Object.keys(data);
                keys.forEach((key) => {
                    newMessageArray.unshift({ ...data[key], name: key })
                });
                // console.log(newMessageArray);
                dispatch(messageActions.setSentMessages(newMessageArray));
    }
    useEffect(() => {
        async function fetchSentMessages() {
            sentMailReq(
                {
                    url: `https://react-mailbox-client-8409e-default-rtdb.firebaseio.com/sentmail/${(user)}.json`,
                    method: "GET"
                },
                afterFechingSentMailReq
            );


        }
        let fetching = setTimeout(() => {
            fetchSentMessages();
        }, 3000);
        return () => {
            clearTimeout(fetching);
        }
    }, [user, dispatch,afterFechingSentMailReq,sentMailReq])



    return (
        <>
            <h1 className='text-center'>{sentMessages.length!==0?"Sent Mails":"Empty Sent Box!!!"}</h1>
            {sentMessages.map((message) => {
                return <div key={message.name}>
                    <div className="container">
                        <div className="row">
                            <div className="col-12">
                                <SentMessage message={message} />
                            </div>
                        </div>
                    </div>
                </div>
            })
            }
        </>
    )
}

export default Sent

