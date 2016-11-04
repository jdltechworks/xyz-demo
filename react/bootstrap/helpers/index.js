import React, { Component } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Field } from 'redux-form';
import Dropzone from 'react-dropzone';
import DatePicker from 'react-pikaday-component';
import { Link } from 'react-router';
import CustomInfiniteScroll from '../components/CustomInfiniteScroll';

let currenDate = moment();
let no_image = '//dummyimage.com/420x420/000/fff.png&text=No+Image';

export const renderLogin = (field) => {
  let { username, password } = field;
  return(
    <div>
      <input className="form-control login-user" {...username.input } type="text" autoComplete="off" />
      <div className="divider"></div>
      <input className="form-control login-pass" {...password.input } type="password" />
    </div>
  );
}

/**
 * [description]
 * @param  {[type]} field [description]
 * @return {[type]}       [description]
 */
export const threeColumnfields = (field) => {
  let { tags, name } = field;
  return (
    <div className="enter-item-details">
      <div className="row">
        {field.name.meta.touched && field.name.meta.error && 
          <div className="alert alert-danger">{field.name.meta.error}</div>}
        {field._id.meta.touched && field._id.meta.error && 
         <div className="alert alert-danger">{field._id.meta.error}</div>}
        {field.itemCount.meta.touched && field.itemCount.meta.error && 
          <div className="alert alert-danger">{field.itemCount.meta.error}</div>}
        <div className="col-sm-6">
          <div className="input-with-label">
          <div className="form-group">
            <label className="form-label">{_.upperCase(field.name.input.name)}</label>
            <div className="input-form">
            <input {...field.name.input} type="text" className="form-control"/>
            </div>
          </div>
          </div>
        </div>
         <div className="col-sm-3">
          <div className="input-with-label">
            <div className="form-group">
              <label className="form-label">{_.upperCase(field.itemCount.input.name)}</label>
              <div className="input-form">
                <input {...field.itemCount.input} type="number" min="0" className="form-control"/>
              </div>
            </div>
          </div>
        </div>
        <div className="col-sm-3">
          <div className="input-with-label">
            <div className="form-group">
              <label className="form-label">{_.upperCase(field._id.input.name)}</label>
              <div className="input-form">
                <input {...field._id.input} type="text" className="form-control" disabled={true} />
                <button className="lock-btn" onClick={(e) => {
                  e.preventDefault();
                  let { previousSibling } = e.currentTarget;
                  previousSibling.disabled = _.eq(previousSibling.disabled, true) ? false : true;
                }}><span className="icon icon-lock-2"></span></button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export const twoColumnFields = (field) => {
  let formFields = _.cloneDeep(field);
  let properField = _.omit(formFields, ['names', 'project']);
  let { project } = field;
  return (
    <div className="row">
     {_.map(properField, (_field, key) => (
        <div key={key} className="col-sm-6">
          {_field.meta.touched && _field.meta.error && 
            <div className="alert alert-danger">{_field.meta.error}</div>}
          <div className="form-group">
            <div className="input-with-label">
              <label className="form-label">
                {project && _.eq(key, 'name') ? 'PROJECT NAME' : _.upperCase(key)}
              </label>
              <div className="input-form">
                <input {..._field.input} 
                  type="text" 
                  className="form-control"
                />
              </div>
            </div>
          </div>
        </div>
      ))
      }
    </div>
  );
}

export const oneColumnField = (field) => {
  let formFields = _.cloneDeep(field);
  let properField = _.omit(formFields, 'names');
  return (
    <div className="row">
     {_.map(properField, (_field, key) => {
        let { input: { name }} = _field;
        if (name == 'email' || name == 'password') {
          _field = { type: name, ..._field };
        } else {
          _field = { type: "text", ..._field };
        }
        return  (
          <div key={key} className="col-sm-6">
            {_field.meta.touched && _field.meta.error && 
              <div className="alert alert-danger">{_field.meta.error}</div>}
            <div className="form-group">
              <div className="input-with-label">
                <label className="form-label">
                  {_.upperCase(key)}
                </label>
                <div className="input-form">
                  <input {..._field.input}
                    type={_field.type}
                    className="form-control"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })
      }
    </div>
  );
}

export const renderTags = (field) => {
  let { tags, name, array, input: { value } } = field;
  return(
    <div>{field.meta.touched && field.meta.error && 
    <div className="alert alert-danger">{field.meta.error}</div>}
      <ul className={`tag-list tag-white`}>
        {_.map(tags, (tag, key) => (
          <li id={`${tag}-${key}`} key={key} 
            className={`${
              _.includes(value, tag)
              ? 'active' : ''
            }`} 
            onClick={(e) => {
            e.preventDefault();
            if(_.eq(field.input.value.indexOf(tag, 0), -1)) {
              array.push(name, tag);  
            } else {
              for (var i in field.input.value) {
                if(_.eq(field.input.value[i], tag)) {
                  array.remove(name, i);
                }
              }      
            }
          }}>
            <a href="#" className="btn btn-tag btn-tag-white">
              <span>
                <em>{tag}</em>
                </span>
                <small className="remove-tag">
              </small>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const renderOrphanedField = (field) => {
  return(
    <div className="row">
      <div className="col-sm-12">
        {field.meta.touched && field.meta.error && 
          <div className="alert alert-danger">{field.meta.error}</div>}
        <div className="form-group">
          <textarea placeholder={
            _.upperCase(field.name)} 
            className="form-control description" 
            cols="30" rows="5" 
          {...field.input} />
        </div>
      </div>
    </div>
  );
}

export const renderReleaseDateField = (fields) => {
  let maxQuantity = fields.products.product.itemCount;
  return (
    <div>
      <label className="form-label">Release date</label>
      <input type="date" className="form-control" {...fields.releaseDate.input } required/>
      <label className="form-label">Quantity</label>
      <input type="number" max={maxQuantity} min="1" className="form-control" {...fields.quantity.input } required/>
    </div>
  );
}

export class startEndDate extends Component {
  componentDidUpdate() {
    let { props, pristine } = this;
    let { startDate, endDate } = props;
    let _startDate = new Date(startDate.input.value);
    let _endDate = new Date(endDate.input.value);
    
    if(_startDate >= _endDate) {
      endDate.input.onChange(moment(startDate.input.value).add(1, 'days').format());
    } else if(_endDate <= _startDate) {
      startDate.input.onChange(moment(endDate.input.value).subtract(1, 'days').format());
    }
  }

  render() {
    let { props } = this;
    let fields = _.cloneDeep(props);
    let properFields = _.omit(fields, ['names']);
    return(
      <div className="row">
        {_.map(properFields, (_field, key) => {
          let dateLabel = key.replace('Date', '') + 'Date';
          let { input } = _field;
          return (
            <div key={key} className="col-sm-6">
              <div className="form-group">
                <div className="input-with-label">
                  <div className="input-form ">
                    <DatePicker {...input} 
                      placeholder={_.upperCase(dateLabel)}
                      className="form-control input-cal"
                      format="MMMM Do YYYY"
                      yearRange={[1990, 2020]}
                      minDate={_.eq(input.name, 'endDate') ? new Date(moment(new Date(props['startDate'].input.value)).add(1, 'days').format()) : null }
                      value={new Date(_field.input.value)}
                      autocomplete="off"
                      onChange={(_props) => {
                        input.onChange(moment(_props).format());
                      }}
                      autoComplete="off" />
                  </div>
                </div>
              </div>
            </div>);
        })}
      </div>
    );
 }
}

export const prefixProductFields = (field) => {
  let formFields = _.cloneDeep(field);
  let properFields = _.omit(formFields, 'names');

  return (
    <div className="row">
     {_.map(properFields, (_field, key) => {
      if(/Date/.test(key)) {
        let dateLabel = key.replace('Date', '') + 'Date';
        return (
          <div key={key} className="col-sm-6">
          {_field.meta.touched && _field.meta.error && 
            <div className="alert alert-danger">{_field.meta.error}</div>}
            <div className="form-group">
              <div className="input-with-label">
                <label className="form-label">
                  {_.upperCase(dateLabel)}
                </label>
                <div className="input-form">
                  <DatePicker {..._field.input} 
                    className="form-control"
                    format="MMMM Do YYYY"
                    yearRange={[1990, 2020]}
                    value={new Date(_field.input.value)} 
                    onChange={(props) => {
                      _field.input.onChange(moment(props).format());
                    }}/>
                </div>
              </div>
            </div>
          </div>);
      } else {
        return(
          <div key={key} className="col-sm-6">
          {_field.meta.touched && _field.meta.error && 
            <div className="alert alert-danger">{_field.meta.error}</div>}
            <div className="form-group">
              <div className="input-with-label">
                <div className="form-group">
                  <label className="form-label">
                    {_.upperCase(key)}
                  </label>
                  <div className="input-form">
                    <input {..._field.input} 
                      type="text" 
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }
     })}
    </div>
  );
}


/**
 * Firebase uploader 
 * @param  {obj} prerequisit for the uploads
 * @return {view} React component
 */
export const renderUpload = (field) => {
  let { array,
        name,
        firebaseUpload,
        uploads: {
          files,
          isUploading 
        },
        input: 
        { 
          value,
          onChange
        }
      } = field;
  
  return (
    <div>

    {field.meta.touched && field.meta.error && 
      <div className="container" style={{backgroundColor: '#e7e5e1'}}>
        <div className="alert alert-danger" style={{margin: '15px 0 0 0'}}>{field.meta.error}
        </div>
      </div>}
    <div className="photo-upload" style={{paddingTop: '15px'}}>
      <Dropzone accept="image/gif, image/jpeg, image/png" onDrop={(file, e) => {
        _.map(file, (_file, index) => {
          firebaseUpload(_file).then((image) => {
            array.push(name, image);
          });         
        });
      }} style={{width: '100%', display: 'block'}}>
        <div className="drop-area">
          <div className="valign">
            <div className="valign-content">
              {!isUploading ? 'Drop files here or ' : null} 
              <label>
                {isUploading ? `Uploading...` : `browse existing library`}
              </label>
            </div>
          </div>
        </div>
      </Dropzone>
      <ul className="upload-thumbs">
        {_.map(value, (pic, key) =>(
          <li key={key}><img src={pic} />
            <button type="button" 
              className="remove-item" 
              onClick={(e) => ( array.remove(name, key) )}>
              <span className="icon icon-remove-2"></span>
          </button>
          </li>
        ))}
      </ul>
  </div>
  </div>);
}

export class DisabledToolBox extends Component {
  render() {
    let { props } = this;
    let { product, array, formValues, input: { values }, location: { pathname } } = props;
    let { images, key, _id, project, name } = product;
    return(
      <div className="col-sm-4" style={ { opacity: '.7' } }>
      <div className="thumbnail">
        <div className="thumbnail-image" style={{
          background: "url('" 
          + (images !== undefined ? images[0] : no_image) 
          + "') no-repeat scroll center center #fff",
          width: '100%'
        }}>
      </div>
        <div style={{backgroundColor: '#fff'}} className="thumbnail-desc">
          <p>
            <a href="#">
            <span className="item-title">{name}</span>
            <span className="item-num">{'#' + _id}</span>
            </a>
          </p>
        </div>
      </div>
      </div>
    );
  }
}

export class CommonToolbox extends Component {
  componentDidUpdate() {
    let { props } = this;
    let { fetchProductPreview, product, array, 
          formValues: { items }, 
          images: { thumbnail },
          location: { pathname },
          input: { value },
          pristine } = props;
    fetchProductPreview(value);
  }
  render() {
    let { props } = this;
    let { fetchProductPreview, product, array, 
          formValues: { items }, 
          input: { name, value },
          images: { thumbnail },
          location: { pathname },
          pristine } = props;
    let values = value;
    let { images, key, _id, project } = product;
    return(
      <div className="col-sm-4">
        <div className="thumbnail">
            <div className="thumbnail-image" style={{
              background: "url('" 
              + (images !== undefined ? images[0] : no_image) 
              + "') no-repeat scroll center center #fff",
              width: '100%'
              }}>
            </div>
          <div style={{backgroundColor: '#fff'}} className="thumbnail-desc">
            <p>
              <a href="#">
              <span className="item-title">{product.name}</span>
              <span className="item-num">{'#' + _id}</span>
              </a>
            </p>
          </div>
          <div className="tools-wrap tool-panel">
            <div className="tool-btns">
              <span className="tool-btn check-btn" style={
                _.includes(value, key) ?
                  { display: 'block' } : { display: 'none' }
              }><em className="icon icon-check"></em></span>
              <span className={`tool-btn add-btn`} onClick={(e) => {
                e.preventDefault();

                let { 
                  firstChild: { className }, 
                  previousSibling: { style } 
                } = e.currentTarget;

                e.currentTarget
                  .firstChild
                  .className = _.eq(
                    className, 
                    'icon icon-add'
                  ) 
                    ? 'icon icon-remove'
                      : 
                      'icon icon-add';

                style.display = _.eq(
                  style.display, 
                  'block') 
                    ? 
                    'none' 
                    : 
                    'block';
                if(_.includes(pathname, 'edit')) {
                  if(_.eq(items.indexOf(key, 0), -1)) {
                    array.push(name, key);
                    
                  } else {
                    for( var i in items ) {
                      if(_.eq(items[i], key)) {
                        array.remove(name, i);
                      }
                    }
                  }            
                } else {
                  if(_.eq(values.indexOf(key, 0), -1)) {
                    array.push(name, key);
                  } else {
                    for( var i in values ) {
                      if(_.eq(values[i], key)) {
                        array.remove(name, i);
                      }
                    }
                  }              
                }

              }}>
               <em className={`icon ${_.includes(items, key) ? 'icon-remove' : 'icon-add'}`}></em>
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


export class renderItemsCheckBox extends Component {
  render() {
  let { props } = this;
  let {
    products: { collection, isEndOfProductsList, isLoading, isSearching },
    array,
    name,
    input,
    formValues,
    location: { pathname },
    projects: { project: { key } },
    loadNextProducts
  } = this.props;
  let projectKey = key;
  let toggleIcon = 'icon icon-add';
  
  collection = _.chunk(collection, 3);
    if(formValues) {
      let{ startDate, endDate } = formValues;
      return(
        <div className="project-list products">
          <CustomInfiniteScroll
            loadMore={loadNextProducts.bind(this)}
            hasMore={!isLoading && !isEndOfProductsList && !isSearching}>
            {_.map(collection, (row, key) => (
              <div className="row" key={key}>
                {_.map(row, (product, index) => {
                  let { images, key, _id, project } = product;         
                  if(project && !_.eq(project._id, formValues._id)) {
                    let _startDate = project.startDate;
                    let _endDate = project.endDate;

                    if(_.lte(moment(new Date(_startDate)), moment(new Date(startDate))) && _.gte(moment(new Date(_endDate)), moment(new Date(endDate)))) {
                      return (<DisabledToolBox key={index} product={product} {...props} />);
                    } else {
                      return (<CommonToolbox key={index} product={product} {...props} />);
                    }
                  } else {
                    return (<CommonToolbox key={index} product={product} {...props} />);           
                  }
                })}
              </div>
            ))}
          </CustomInfiniteScroll>
        {!isEndOfProductsList ? <div className="loader">Loading...</div> : null}
        </div>);
    } else {
      return(<div></div>);
    }
  }
};