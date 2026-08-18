import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AppContextProvider } from './Hooks/AppContext';
import './Styles/app.scss';

function App() {
  return (
    <AppContextProvider>
      <div className="appContainer">
        <RouterProvider router={ router } />
      </div>
    </AppContextProvider>
  )
}

export default App;