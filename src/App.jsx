import { BrowserRouter } from 'react-router-dom';  
import AppRoutes from './routes/AppRoutes';
import { Elements } from '@stripe/react-stripe-js';

function App() {
  return (
    <BrowserRouter>  

      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;


