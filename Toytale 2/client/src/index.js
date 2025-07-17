import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import WelcomePage from './pages/welcomePage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/homepage';
import App from './App';
import AddItem from './pages/AddItem'; // 
import MessagePage from './pages/MessagePage';
import ChatPage from './pages/chatPage'; // 
import OthersProfile from './pages/OthersProfile';
import VideoCallPage from './pages/VideoCallPage'; // Import VideoCallPage
import ItemDetailPage from './pages/ItemDetailPage'; // Import ItemDetailPage
import CharityPage from './pages/Charity';


const router = createBrowserRouter(
[
  {
    path: "/Profile",
    element: <ProfilePage />,
  },

  
  {
    path: "/", // WelcomePage is now at /welcome
    element: <WelcomePage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  
  {
    path: "/home",
    element: <HomePage />, 
  },
  {
    path: "/AddItem",
    element: <AddItem/>, 
  },

  { path:"/messages",
    element: <MessagePage />,

  },
  {
  path: "/messages/:userId",
  element: <ChatPage />, // 
},
{
  path: "/profile/:userId",
  element: <OthersProfile />, // ProfilePage for viewing other users' profiles
},
  { path: "/videocall/:userId",
    element: <VideoCallPage />, // VideoCallPage for video calls
  },

  {
  path: "/item/:itemId",
  element: <ItemDetailPage />,
},

  { path: "/Charity",
    element: <CharityPage />, // CharityPage for charity requests
  },
]
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
