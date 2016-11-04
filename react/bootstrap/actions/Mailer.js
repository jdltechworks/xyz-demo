import jsonpack from 'jsonpack';
export const sendMail = (payload) => {
  let data = jsonpack.pack(payload.data);
  let { type } = payload;
  let { protocol, host } = location;
  data = btoa(data);
  payload.data = `${protocol}//${host}/share/${type}?data=${data}`;
  return dispatch => {
    dispatch(isSendingMail());
    fetch(`${process.env.MAILER_API}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then((response) => {
      console.log(response);
    }).catch(err=>console.log(err));

  }
};

export const isSendingMail = () => {
  return {
    type: 'IS_SENDING_EMAIL',
    payload: null
  };
};

export const emailSend = (payload) => {
  return {
    type: 'EMAIL_SENT',
    payload
  }
};

export const openMailer = () => {
  return {
    type: 'OPEN_MAILER',
    payload: null
  }
}
export const closeMailer = () => {
  return {
    type: 'MAILER_CLOSED',
    payload: null
  }
}