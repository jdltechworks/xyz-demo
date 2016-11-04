import _ from 'lodash';
import $ from 'jquery';
import { connect } from 'react-redux';
import Sortable from 'react-sortablejs';
import { Link } from 'react-router';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import * as StyleActionCreator from '../actions/Style';
import * as RoomsActionsCreator from '../actions/Room';
import * as PalleteActionCreator from '../actions/Pallete';
import * as CategoryActionCreator from '../actions/Category';
import FlashMessage from '../components/FlashMessage';

let mergedActions = _.merge(
  RoomsActionsCreator,
  StyleActionCreator, 
  PalleteActionCreator, 
  CategoryActionCreator
);



export class TagsTemplate extends Component {
  render() {
    let { props } = this;
    let { tags, name, sorter, update, deleteWarn, modal, isDeleting, addTag, gatheredItems } = props;
    let _qty = (name) => {
      
     if( gatheredItems ) {
      let result = _.filter(gatheredItems, (o) => {
        return _.eq(_.lowerCase(o.name), _.lowerCase(name));
      });
      return(<span>{_.size(result)} </span>)
     } else {
      return(<span>0 </span>);
     }
       
    }  
    let _tags = _.map(tags, (tag, key) => {
      if(tag) {
        return(
          <li key={key} data-id={tag} className="taphover">
            <span className="ui-sortable-handle category-data cat">{tag}</span>
            <span className="category-data cat-item">
              <Link to ={`/inventory/manage/${tag}`}>
                <span>{_qty(tag)}</span>
                <span>
                  ITEMS
                </span>
              </Link>
            </span>
            <div className="manage-controls taphover-action">
              <button type="button" className="edit-btn" 
                onClick={(e) => {
                  let { parentNode: { parentNode } } = e.currentTarget;
                  parentNode.classList.toggle('form-open');
                }}>
                <span className="icon icon-edit"></span>
              </button>
              <button type="button" className="delete-btn" onClick={(e) => {
                deleteWarn({ key, tag });
              }}>
                <span className="icon icon-delete"></span>
              </button>
            </div>
            <form className="clearfix form-edit-acco-item" 
              onSubmit={(e) => {
                e.preventDefault();
                let { refs } = this;
                let name = refs[tag].value;
                let { parentNode } = e.currentTarget;
                update({key, name});
                parentNode.classList.remove('form-open');
              }}>
              <input type="text" ref={tag} defaultValue={tag} className="form-control" />
              <button className="btn btn-warning btn-block">EDIT</button>
            </form>
          </li>
        )
      }
    });
    return(
      <div>
      { modal ? <FlashMessage {...props} /> : null }
      <div className={`accordion-trigger ${_.eq(name, 'categories') ? 'active' : null }`}>
        <h2>
          <span>{_.capitalize(name)} </span>
          <span className="badge">{_.size(tags)}</span>
        </h2>
        <div className="accordion-line">
          <span className="accordion-indicator">
          </span>
        </div>
      </div>
      <div className="accordion-content" style={_.eq(name, 'categories') ? { display: 'block'} : null }>
        <Sortable tag="ul" className="category-list ui-sortable" 
          options={{
            handle: '.ui-sortable-handle'
          }}          
          onChange={(order, sortable) => {
            sorter(order);
          }}>
          {_tags}
        </Sortable>
        {_.lt(_.size(tags), 15) ?
          <ul className="category-list ui-sortable">
            <li className="ui-sortable-handle two-lines li-form-add">
              <button onClick={(e) => {
                let { currentTarget: { parentNode } } = e;
                parentNode.classList.toggle('form-open');
              }}>
                <span className="icon icon-add-2"></span>
                <span>{` ADD ${_.upperCase(name)}`}</span>
              </button>
              <div className="form-group">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    let { refs } = this;
                    let { value } = refs[name];
                    let { parentNode: { parentNode } } = e.currentTarget;

                    parentNode.classList.toggle('form-open');
                    tags.push(_.lowerCase(value));
                    sorter(_.compact(tags));
                  }}>
                  <input ref={name} type="text" className="form-control"/>
                  <button className="btn btn-info btn-block">{` ADD ${_.upperCase(name)}`}</button>
                </form>
              </div>
            </li>
          </ul>
        : null }
        </div>
      </div>
    );
  }
}

@connect((state) => {
  return {
    pallete: state.Pallete,
    categories: state.Category,
    style: state.Style,
    rooms: state.Rooms
  }
}, dispatch => bindActionCreators(mergedActions, dispatch))

export default class ManageCategories extends Component {
  componentDidMount() {
    let { fetchStyle, 
          fetchRooms, 
          fetchPallete, 
          fetchCategories,
          fetchItemsInCategories,
          fetchItemsInStyle,
          fetchItemsInPallete,
          fetchItemsInRoom,
        } = this.props;
    fetchCategories();
    fetchStyle();
    fetchRooms();
    fetchPallete();
    fetchItemsInCategories();
    fetchItemsInStyle();
    fetchItemsInPallete();
    fetchItemsInRoom();

    $('.accordion-trigger').on('click', function(event) {
      event.preventDefault();
      var content = $(this).next();
      if (content.is(':hidden')) {
        $('.accordion-content').slideUp(250);
        $('.accordion-trigger').removeClass('active');
        content.slideDown(250);
        $(this).addClass('active');
      } else {
        content.slideUp(250);
        $(this).removeClass('active');
      }
    });
  }
  render() {
    let { props } = this;
    let {
      sortRooms,
      sortStyle,
      sortPallete,
      sortCategories,
      updateStyle,
      updateRooms,
      updateCategories,
      updatePallete,
      addPallete,
      addRooms,
      closeRoomsModal,
      addStyle,
      closeStyleModal,
      styleDeleteWarning,
      initializeDeleteStyle,
      roomsDeleteWarning,
      initializeDeleteRooms,
      closePalleteModal,
      palleteDeleteWarning,
      initializeDeletePallete,
      categoryDeleteWarning,
      initializeDeleteCategory,
      addCategory,
      closeCategoryModal,
      pallete: { palleteTags, isFetching }, 
      style: { styleTags }, 
      rooms: { roomsTags },
      categories: { categoriesTags } 
    } = props;

    let { pallete, style, rooms, categories } = props;

    let Styles = { 
      name: 'style',
      tags: styleTags, 
      sorter: sortStyle,
      update: updateStyle,
      modal: style.modal,
      deleteWarn: styleDeleteWarning,
      isDeleting: style.isDeleting,
      initializeDelete: initializeDeleteStyle,
      toDelete: style.toDelete,
      isSubmitting: style.isSubmitting,
      message: style.message,
      addTag: addStyle,
      closeModal: closeStyleModal,
      gatheredItems: style.products,
      ...props,
    };


    let Rooms = { 
      name: 'rooms',
      tags: roomsTags,
      sorter: sortRooms,
      update: updateRooms,
      modal: rooms.modal,
      deleteWarn: roomsDeleteWarning,
      isDeleting: rooms.isDeleting,
      initializeDelete: initializeDeleteRooms,
      toDelete: rooms.toDelete,
      isSubmitting: rooms.isSubmitting,
      message: rooms.message,
      addTag: addRooms,
      closeModal: closeRoomsModal,
      gatheredItems: rooms.products,
      ...props
    };

    let Pallete = { 
      name: 'pallete',
      tags: palleteTags,
      sorter: sortPallete,
      update: updatePallete,
      modal: pallete.modal,
      deleteWarn: palleteDeleteWarning,
      isDeleting: pallete.isDeleting,
      initializeDelete: initializeDeletePallete,
      toDelete: pallete.toDelete,
      isSubmitting: pallete.isSubmitting,
      message: pallete.message,
      addTag: addPallete,
      closeModal: closePalleteModal,
      gatheredItems: pallete.products,
      ...props
    }
    
    let Categories = { 
      name: 'categories', 
      tags: categoriesTags,
      sorter: sortCategories,
      update: updateCategories,
      modal: categories.modal,
      deleteWarn: categoryDeleteWarning,
      isDeleting: categories.isDeleting,
      initializeDelete: initializeDeleteCategory,
      toDelete: categories.toDelete,
      isSubmitting: categories.isSubmitting,
      message: categories.message,
      addTag: addCategory,
      closeModal: closeCategoryModal,
      gatheredItems: categories.products,
      ...props
    };
    return(
      <div className="main">
        <div className="main-content">
          <div className="container">
            <div className="accordion">
              <TagsTemplate {...Categories} />
              <TagsTemplate {...Styles} />
              <TagsTemplate {...Rooms} />
              <TagsTemplate {...Pallete} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}