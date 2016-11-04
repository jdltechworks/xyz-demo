import { connect } from 'react-redux';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import DashboardProducts from '../components/DashboardProducts';
import TopPanel from '../components/TopPanel';
import * as ProjectActionCreators from '../actions/Project';
import * as ProductActionCreators from '../actions/Product';
import * as StatsActionCreators from '../actions/Stats';
import DashboardFilter from '../components/DashboardFilter';
import DashboardProjects from '../components/DashboardProjects';
import { reduxForm } from 'redux-form';
import $ from 'jquery';

let mergedActions = _.merge(
  ProductActionCreators,
  ProjectActionCreators,
  StatsActionCreators
);

const _graph_animation = ()  => {
  $('.graph li').each(function() {
    let $this = $(this);
    let graphAnim = $this.find('.graph-anim');
    let graphAnimHeight = graphAnim.attr('rel');
    $({ anim: 0 }).animate({
      anim: graphAnimHeight 
    }, {
      duration: 2000,
      easing: 'swing',
      step: function() {
        graphAnim.css('height', this.anim + '%');
      }
    });
  });
}

@connect((state) => {
  return {
    products: state.Products,
    projects: state.Projects,
    stats: state.Stats,
    auth: state.Auth
  }
}, dispatch => bindActionCreators(mergedActions, dispatch))

@reduxForm({
  form: 'toolbox'
})

export default class Dashboard extends Component{
  componentDidMount() {
    let { fetchProducts, getOverAllUsage, dispatch } = this.props;
    getOverAllUsage().then(response => {
      let { overall_usage, usage } = response;
      dispatch({ type: 'USAGE_OVERTIME_CALCULATED', usage });
      _graph_animation();
        $({ count: 0}).animate({
          count: overall_usage
        }, {
          duration: 3000,
          easing: 'swing',
          step: function() {

            let radialValue = this.count;

            if(_.gt(radialValue, 100)) {
              radialValue = 100;
            }

            $('.radial-progress').attr('data-progress', parseInt(_.round(radialValue)));
            $('span[class*="counter"]').text(_.round(this.count));
          }
        });
      return response;
    }).then((_response) => {
      fetchProducts();
    });
  }
  render() {
    let { props } = this;
    let {
      auth: { isLoggedIn },
      products: { collection, isLoading, isFiltered, isSearching }
    } = props;
    if(isLoggedIn) {
      return(
        <div className="main" onMouseEnter={(e) => {
          e.preventDefault();
          document.body.classList.remove('menu-open');
        }}>
          <TopPanel {...props}/>
          <DashboardProjects {...props} />
          <DashboardFilter {...props} />
          <DashboardProducts {...props} />
        </div>
      );
   } else {
    return(
      <div className="main">
        <div className="loading"></div>
      </div>
    );
   }
  }
}