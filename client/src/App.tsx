import React from 'react';
import { AuthProvider } from './components/AuthContext';
import { Router } from './components/Router';





// Main App Component
function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Router />
      </div>
    </AuthProvider>
  );
}

export default App;