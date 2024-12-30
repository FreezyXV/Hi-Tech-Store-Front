// import React from 'react';
// import ReactDOM from 'react-dom/client'; 
// import { Provider } from 'react-redux';
// import { BrowserRouter as Router } from 'react-router-dom';
// import App from './App';
// import store from './store';
// import ErrorBoundary from './components/ErrorBoundary';

// const root = ReactDOM.createRoot(document.getElementById('root')); 


// root.render(
//   <React.StrictMode>
//     <Provider store={store}>
//       <ErrorBoundary>
//         <Router>
//           <App />
//         </Router>
//       </ErrorBoundary>
//     </Provider>
//   </React.StrictMode>
// );
// src/main.jsx
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import store from "./store";
import Loader from "./components/Loader";

function Main() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate a short loading period or handle real async tasks here
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000); // 1 second; adjust as needed

    return () => clearTimeout(timer);
  }, []);

  return (
    <React.StrictMode>
      <Provider store={store}>
        {isLoading ? (
          <Loader />
        ) : (
          <Router>
            <App />
          </Router>
        )}
      </Provider>
    </React.StrictMode>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Main />);
