import React from "react";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const { cat: paramCat } = useParams();
    const { search } = useLocation();

    // Determine category query string: use route param if available, otherwise fallback to search query
    // If paramCat is present (e.g. "art"), construct "?cat=art". 
    // If search is present (e.g. "?cat=art" or "?search=..."), use it.
    // Ideally, prioritize paramCat if we want clean URLs to be the source of truth when matching that route.

    // Note: search might contain page params too.

    const [catQuery, setCatQuery] = useState("");

    useEffect(() => {
        if (paramCat) {
            setCatQuery(`?cat=${paramCat}`);
        } else {
            setCatQuery(search);
        }
    }, [paramCat, search]);

    // reset page when cat changes
    useEffect(() => {
        setPage(1);
    }, [catQuery]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Construct query string properly
                // If catQuery is empty/null, use ?page=...
                // If catQuery exists (e.g. "?cat=art"), append &page=...
                const query = catQuery ? `${catQuery}&page=${page}` : `?page=${page}`;
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts${query}`);

                // Check if response is array (old) or object (new pagination)
                if (Array.isArray(res.data)) {
                    setPosts(res.data);
                } else {
                    setPosts(res.data.posts);
                    setTotalPages(res.data.totalPages);
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [catQuery, page]);

    const getText = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html")
        return doc.body.textContent
    }

    return (
        <div className="home">
            <div className="posts">
                {posts.map((post) => (
                    <div className="post" key={post._id}>
                        <div className="img">
                            <img src={post.cover || "https://images.pexels.com/photos/7008010/pexels-photo-7008010.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"} alt="" />
                        </div>
                        <div className="content">
                            <Link className="link" to={`/posts/post/${post._id}`}>
                                <h1>{post.title}</h1>
                            </Link>
                            <div className="post-meta">
                                <span className="author">By {post.author?.username}</span>
                                {post.categories && post.categories.length > 0 && (
                                    <span className="categories">
                                        File under: {post.categories.map(c => c.name).join(', ')}
                                    </span>
                                )}
                            </div>
                            <p>{getText(post.summary)}</p>
                            <button>Read More</button>
                        </div>
                    </div>
                ))}
            </div>
            {
                totalPages > 1 && (
                    <div className="pagination">
                        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
                    </div>
                )
            }
        </div >
    );
};

export default Home;
