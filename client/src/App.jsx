import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreatePost from './pages/CreatePost';
import PostDetails from './pages/PostDetails';
import Navbar from './components/Navbar';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:cat" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/write" element={<CreatePost />} />
          <Route path="/posts/post/:id" element={<PostDetails />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
