/**
 * Frontend application root.
 * Defines public and protected routes for all pages.
 */
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
/**
 * Configures top-level browser router and route tree.
 * @returns {JSX.Element} Application routing structure.
 */
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
