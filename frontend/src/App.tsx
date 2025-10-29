import './index.css';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';

// import ServiceList from './pages/customer/ServiceList';

function App() {
    return <RouterProvider router={router} />;
}

export default App;
