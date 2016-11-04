import React, { Component } from 'react';
import $ from 'jquery';
import moment from 'moment';
import _ from 'lodash';

export const _selector = document.querySelector.bind(document);

export const _select_box = function(e) {
  e.preventDefault();
  e.currentTarget.classList.toggle('active');
};

export const _clear_select_box = function(elem) {
  for(var e = 0; e < elem.children.length; e++) {
    elem.children[e].classList.remove('active');
  }
}

export const createGroupedArray = function(arr, chunkSize) {
  var groups = [], i;
  for (i = 0; i < arr.length; i += chunkSize) {
      groups.push(arr.slice(i, i + chunkSize));
  }
  return groups;
};
