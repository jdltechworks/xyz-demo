import React, { Component } from 'react';
import { render } from 'react-dom';
import Root from './bootstrap';
import eq from 'lodash/eq';
import runtime from 'serviceworker-webpack-plugin/lib/runtime';
import registerEvents from 'serviceworker-webpack-plugin/lib/browser/registerEvents';
import applyUpdate from 'serviceworker-webpack-plugin/lib/browser/applyUpdate';



render(<Root />, document.getElementById('app'));