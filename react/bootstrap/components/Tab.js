import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as StyleActionCreator from '../actions/Style';
import * as RoomsActionsCreator from '../actions/Room';
import * as PalleteActionCreator from '../actions/Pallete';
import * as CategoryActionCreator from '../actions/Category';
import { isStatus } from '../actions/Product';
import * as ProductActions from '../actions/Product';
import { isProjectStatus } from '../actions/Project';
import $ from 'jquery';



@connect(state => {
  return {
    pallete: state.Pallete,
    categories: state.Category,
    style: state.Style,
    rooms: state.Rooms,
    products: state.Products
  };
}, dispatch => (bindActionCreators(_.merge(
    RoomsActionsCreator,
    StyleActionCreator, 
    PalleteActionCreator, 
    CategoryActionCreator,
    ProductActions
), dispatch)))

export default class Tabs extends Component {
  filterTags = {};

  componentDidMount() {
    let {
      fetchStyle, 
      fetchRooms, 
      fetchPallete, 
      fetchCategories
    } = this.props;

    fetchStyle(); 
    fetchRooms(); 
    fetchPallete(); 
    fetchCategories();
  }

  filterByTags(value, filterUsingKey, e) {
    let { props } = this;
    let objectValue = 1;
    let $currentTarget = $(e ? e.currentTarget : '<li></li>');
    let $thisTabPane = $currentTarget.closest('.tab-pane');
    let $allEle = $thisTabPane.find('.show-all-parent');

    if (typeof(filterUsingKey) == 'function') {
      objectValue = filterUsingKey;
      filterUsingKey = 'availability';
    } else if (filterUsingKey == 'status') {
      this.filterTags.status = {};
    }

    if (value == 'all') {
      $thisTabPane.find('li.active:not(.show-all-parent)').removeClass('active');
      
      delete this.filterTags[filterUsingKey];
    } else {
      if (!this.filterTags[filterUsingKey]) {
        this.filterTags[filterUsingKey] = {};
      }
      let filterTagKeys = this.filterTags[filterUsingKey];

      value = _.toUpper(value);
      if (filterTagKeys[value]) {
        delete filterTagKeys[value];
      } else {
        filterTagKeys[value] = objectValue;
      }
    }

    $currentTarget.closest('li').toggleClass('active');
    if ($thisTabPane.find('li.active:not(.show-all-parent)').length) {
      $allEle.removeClass('active');
    } else {
      $allEle.addClass('active');
    }

    var filterMethod = props[props.filterType == 'projects' ? 'filterProjects' : 'filterProducts'];
   
    filterMethod(this.filterTags);
  }

  render() {
    let { props } = this;
    let { products: { hasFilters, isLoading, isSearching } } = props;
    let tags = {
      styles: props.style.styleTags,
      rooms: props.rooms.roomsTags,
      palletes: props.pallete.palleteTags,
      categories: props.categories.categoriesTags,
    };

    if (!hasFilters && !isLoading && !isSearching) {
      $('.search-input').val('');
      $('.tag-list li.active:not(.show-all-parent)').removeClass('active');
      this.filterTags = {};
    }

    return(
      <div className="tab-content">
        {_.map(getTabCategories(props.filterType), (category, key) => (
          <div id={`${key}-tab`} className="tab-pane" key={key} onClick={_.isEmpty(category) ? (e) => {this.filterByTags(key, 'status', e)} : null}>
            {_.isEmpty(category) ? null :
              <div className="panel panel-default">
                <div className="panel-body">
                  <ul className="tag-list">
                    <li className="show-all-parent active">
                      <a href="#" className="btn btn-tag show-all" onClick={(e) => {this.filterByTags('all', category[0], e)}}>
                        <span><em>SHOW ALL</em></span>
                      </a>
                    </li>
                    {_.map((category[1] ? category[1] : tags[category[0]]), (subcat, subcatKey) => (
                      <li key={subcatKey}>
                        <a href="#" className="btn btn-tag" onClick={(e) => {this.filterByTags(subcat, category[0], e)}}>
                          <span><em>{_.toUpper(subcat)}</em></span>
                          {typeof(category[0]) == 'string' ?
                            <small className="remove-tag"></small>
                          : null}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            }
          </div>
        ))}
      </div>
    ); 
  }
}

export const getTabCategories = (filterType) => {
  switch(filterType) {
    case 'projects':
      return {
        all: [],
        active: [],
        upcoming: [],
        archived: []
      };
    break;
    default: 
      return {
        availability: [function (product, category) {
          return isStatus(product, category);
        }, [
          'AVAILABLE',
          'CHECKED OUT',
          'ON HOLD',
          'SUGGESTED'
        ]],
        category: ['categories'],
        room: ['rooms'],
        style: ['styles'],
        palette: ['palletes']
      };
    break;
  }
}