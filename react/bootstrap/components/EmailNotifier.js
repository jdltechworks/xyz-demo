import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import _ from 'lodash';
import API from '../config';

const _users = API.database().ref('users');

export default class EmailNotifier extends Component {
  state = {
    users: []
  };
  componentDidMount() {
    let { props } = this;
    let { dispatch, initialize, pristine, fetchUsers, fetchNotes, products: {product}, auth: { credentials } } = props;
    let sanitized = [];
    fetchNotes(product);
    
    _users.on('value', snap => {
      _.map(snap.val(), (value, key) => sanitized.push(_.merge(value, { key })));
      this.setState({ users: sanitized});
    }).bind(this);

    if (pristine) {
      initialize(_.merge(product, credentials));
    }


  }
  render() {
    let { props, state } = this;
    let { users } = state;
    let { handleSubmit, pristine, reset, submitting, dispatch, addNote, removeNote, 
          products: { notes, product } } = props;
    return(
      <section className="notes row">
        <div className="heading-bar with-down-arrow">
          <h2>Notes</h2>
        </div>
        <div className="notes-content">
          <div className="comment-form">
            <form className="container" onSubmit={handleSubmit((props) => {
              addNote(props);
            })}>
              <Field name="note" className="form-control" cols="30" rows="3" component="textarea" placeholder="Write something..." required />
              <br />
              <div className="text-right">
                <div className="btn-group">
                  <Field className="btn btn-rounded" name="user" component="select">
                    {_.map(users, (value, index) => {
                      let { email } = value;
                      return <option key={index} value={email}>{_.upperCase(email.replace(/@.*$/,''))}</option>
                    })}
                  </Field>
                  <button disabled={pristine || submitting} type="submit" className="btn btn-rounded"><span className="icon icon-note-white"></span>ADD A NOTE</button>
                </div>
              </div>
            </form>
          </div>
          <div className="comment-content">
            <div className="container">
              {_.map(notes, (note, key) => {
                return (
                  <div key={key} className="comment-content-block">
                    <button type="button" className="remove-item" onClick={(e) => {
                      if (dispatch) {
                        removeNote(key);
                      }
                    }}><span className="icon icon-remove-2"></span></button>
                    <h4><a href="#">Added - BY {note.user}</a></h4>
                    <p>{note.note}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    );
  }
}