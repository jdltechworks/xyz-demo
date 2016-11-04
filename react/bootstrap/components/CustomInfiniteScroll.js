import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import InfiniteScroll from 'react-infinite-scroll';
const InfiniteScrollComponent = InfiniteScroll(React);

export default class CustomInfiniteScroll extends InfiniteScrollComponent {
	getDOMNode () {
		return ReactDOM.findDOMNode(this);
	}
}