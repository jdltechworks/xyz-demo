import Auth from './Auth';
import Style from './Style';
import Pallete from './Pallete';
import Products from './Products';
import Projects from './Projects';
import Message from './Message';
import Category from './Category';
import Uploads from './Uploads';
import Images from './Images';
import Rooms from './Rooms';
import User from './User';
import Stats from './Stats';
import Search from './Search';
import Email from './Email';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as form } from 'redux-form';


const mainReducer = combineReducers({
  Auth,
  Email,
  User,
  Products,
  Projects,
  Style,
  Pallete,
  Category,
  Uploads,
  Message,
  Rooms,
  Images,
  Stats,
  Search,
  form,
  routing: routerReducer 
});

export default mainReducer;