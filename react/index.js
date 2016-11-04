import React, { Component } from 'react';
import { render } from 'react-dom';
import Root from './bootstrap';
import eq from 'lodash/eq';

render(<Root />, document.getElementById('app'));

module.hot.accept();