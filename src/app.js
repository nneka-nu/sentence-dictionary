import React from 'react';
import { render } from 'react-dom';

import Main from './components/Main';
import './style.css';

render(
  <Main {...window.__INITIAL_STATE__} />,
  document.getElementById('root')
);