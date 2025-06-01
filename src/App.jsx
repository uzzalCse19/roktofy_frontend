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


// import { BrowserRouter } from 'react-router-dom';  
// import AppRoutes from './routes/AppRoutes';
// import { AuthProvider } from './context/AuthContext';
// import { Elements } from '@stripe/react-stripe-js';

// function App() {
//   return (
//     <BrowserRouter>  
//       <AuthProvider>
//         <AppRoutes />
//       </AuthProvider>
//     </BrowserRouter>
//   );
// }

// export default App;
