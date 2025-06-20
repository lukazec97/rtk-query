import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import {
  useCreatePostMutation,
  useGetPostsQuery,
} from "./services/jsonPlaceholderApi";
import PostsList from "./components/PostsList";
import Counter from "./components/Counter";

const initialState = {
  title: "",
  body: "",
};

function AppContent() {
  const navigate = useNavigate();
  const [post, setPost] = useState(initialState)
  const { data: posts, error, isLoading } = useGetPostsQuery({limit: 10, offset:0});
  const [ createpost, {error: createError, isLoading: isCreating }] = useCreatePostMutation();

  if (isLoading ) return <h1>Loading...</h1>;
  if (isCreating ) return <h1>Creating...</h1>;
  if (error || createError) return <h1>Something went wrong</h1>;

  console.log(posts);

  const handleCreatepost = async () => {
    await createpost(post);
    setPost(initialState)
  }

  const handleChange = (e) => {
    setPost({...post, [e.target.name]: e.target.value})
  }

  return (
    <div style={{display: 'flex', alignItems:'center'}}>
    <button onClick={() => navigate('/posts')}>Navigate to posts list</button>
    <button onClick={() => navigate('/counter')}>Navigate to counter</button>
    <div className="App">
      <input type="text" name="title" onChange={handleChange} placeholder="title.." value={post.title} />
      <input type="text" name="body" onChange={handleChange}
       placeholder="Name.." value={post.body}/>
      <button onClick={handleCreatepost} disabled={isCreating}>Create Post</button>
    </div>
      <div>
        {posts.map((post, index) => <p key={index}>{index}.{post.title}</p>)}
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppContent />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/counter" element={<Counter />} />
      </Routes>
    </Router>
  );
}

export default App;
