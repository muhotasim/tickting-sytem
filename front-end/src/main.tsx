import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './assets/css/index.scss';
import { Provider } from 'react-redux';
import { rootStore } from './store/index.ts';
import ThemeProvider from './components/theme.provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Provider store={rootStore}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>,
)
