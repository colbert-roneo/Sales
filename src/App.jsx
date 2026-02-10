import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import MainApp from './components/MainApp';
import './styles/App.css';

function App() {
  return (
    <Provider store={store}>
      <MainApp />
    </Provider>
  );
}

export default App;