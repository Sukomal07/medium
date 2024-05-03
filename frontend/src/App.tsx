import { Routes, Route } from "react-router-dom"
import Blog from "./pages/Blog"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Blogs from "./pages/Blogs"

function App() {
  return (
    <Routes>
      <Route path="/blog/:id" element={<Blog />} />
      <Route path="/" element={<Blogs />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/signin" element={<Signin />} />
    </Routes>
  )
}

export default App
