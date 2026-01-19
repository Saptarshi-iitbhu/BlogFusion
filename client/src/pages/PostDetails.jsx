import { useEffect, useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import moment from "moment";
import toast from "react-hot-toast";

const PostDetails = () => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
                setPost(res.data);
                setLikes(res.data.likes?.length || 0);
                if (currentUser) {
                    setIsLiked(res.data.likes?.includes(currentUser.id));
                }
            } catch (err) {
                console.log(err);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/comments/post/${postId}`);
                setComments(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
        fetchComments();
    }, [postId, currentUser]);

    const handleLike = async () => {
        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/posts/${postId}/like`);
            setLikes(isLiked ? likes - 1 : likes + 1);
            setIsLiked(!isLiked);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) return;
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/comments`, {
                content: newComment,
                postId,
            });
            setComments([res.data, ...comments]);
            setNewComment("");
            toast.success("Comment Added");
        } catch (err) {
            console.log(err);
            toast.error("Failed to add comment");
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}`);
            toast.success("Post Deleted Successfully");
            navigate("/");
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete post");
        }
    };

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    return (
        <div className="single">
            <div className="content">
                <img src={post?.cover || "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} alt="" />
                <div className="user">
                    {post.author?.img && <img src={post.author.img} alt="" />}
                    <div className="info">
                        <span>{post.author?.username}</span>
                        <p>Posted {moment(post.createdAt).fromNow()}</p>
                    </div>
                    {currentUser?.username === post.author?.username && (
                        <div className="edit">
                            <Link to={`/write?edit=2`} state={post}>
                                <img src="https://cdn-icons-png.flaticon.com/512/1159/1159633.png" alt="edit" style={{ width: '20px', height: '20px' }} />
                            </Link>
                            <img onClick={handleDelete} src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" alt="delete" style={{ width: '20px', height: '20px' }} />
                        </div>
                    )}
                </div>
                <h1>{post.title}</h1>
                <p
                    dangerouslySetInnerHTML={{
                        __html: post.content,
                    }}
                ></p>

                <div className="interactions">
                    <button onClick={handleLike} className={`like-btn ${isLiked ? 'liked' : ''}`}>
                        {isLiked ? '❤️' : '🤍'} {likes} Likes
                    </button>
                </div>

                <div className="comments">
                    <h3>Comments</h3>
                    {currentUser && (
                        <div className="write-comment">
                            <input
                                type="text"
                                placeholder="Write a comment..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                            />
                            <button onClick={handleCommentSubmit}>Send</button>
                        </div>
                    )}
                    {comments.map((comment) => (
                        <div className="comment" key={comment._id}>
                            <p><strong>{comment.author?.username}</strong>: {comment.content}</p>
                            <span>{moment(comment.createdAt).fromNow()}</span>
                        </div>
                    ))}
                </div>
            </div>
            <div className="menu">
                <h2>Other posts you may like</h2>
                {/* Recommended posts */}
            </div>
        </div>
    );
};

export default PostDetails;
