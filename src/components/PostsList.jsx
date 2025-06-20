import { useGetPostsQuery } from "../services/jsonPlaceholderApi";

const PostsList = () => {
  const { data: posts, error, isLoading } = useGetPostsQuery({limit:5, offset:0});
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error</div>;

  return (
    <div>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostsList;
