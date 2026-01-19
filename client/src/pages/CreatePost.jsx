import { useState, useEffect } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import toast from "react-hot-toast";

const CreatePost = () => {
    const state = useLocation().state;
    const [value, setValue] = useState(state?.desc || "");
    const [title, setTitle] = useState(state?.title || "");
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(state?.cover || null);
    const [cat, setCat] = useState(Array.isArray(state?.cat) ? state.cat : (state?.cat ? [state.cat] : []));
    const [tags, setTags] = useState(state?.tags?.join(',') || "");

    const navigate = useNavigate();

    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/upload`, formData);
            return res.data;
        } catch (err) {
            console.log(err);
        }
    };

    const [cats, setCats] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
                setCats(res.data);

                // Initialize selected categories from state (editing mode)
                if (state?.categories) {
                    setCat(state.categories.map(c => c._id));
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchCats();
    }, [state]);

    const handleCatChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setCat(prev => [...prev, value]);
        } else {
            setCat(prev => prev.filter(c => c !== value));
        }
    };

    const handleClick = async (e, status) => {
        e.preventDefault();

        // Validation: Verify if at least one category is selected
        if (!cat || cat.length === 0) {
            toast.error("Please select at least one category for your post.");
            return;
        }

        // Validation: Verify if an image is selected or exists (edit mode)
        if (!file && !state?.cover) {
            toast.error("Please select a cover image for your post.");
            return;
        }

        const imgUrl = file ? await upload() : "";

        // Process tags: split by comma and trim
        const tagsArray = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()) : tags;

        try {
            if (state) {
                await axios.put(`${import.meta.env.VITE_API_URL}/posts/${state._id}`, {
                    title,
                    summary: value.substring(0, 150), // Extract summary from content
                    content: value,
                    categories: cat,
                    tags: tagsArray,
                    status: status, // draft or published
                    cover: file ? imgUrl : state.cover,
                });
                toast.success("Post Updated Successfully");
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/posts/create`, {
                    title,
                    summary: value.substring(0, 150),
                    content: value,
                    categories: cat,
                    tags: tagsArray,
                    status: status, // draft or published
                    cover: imgUrl,
                });
                toast.success("Post Created Successfully");
            }
            navigate("/");
        } catch (err) {
            console.log(err);
            toast.error("Something went wrong!");
        }
    };

    return (
        <div className="add">
            <h1 className="page-title">Share your thoughts</h1>
            <div className="content">
                <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
                <div className="editorContainer">
                    <ReactQuill className="editor" theme="snow" value={value} onChange={setValue} />
                </div>
            </div>
            <div className="menu">
                <div className="item">
                    <h1>Publish</h1>
                    <span>
                        <b>Status: </b> Draft
                    </span>
                    <span>
                        <b>Visibility: </b> Public
                    </span>
                    <input
                        style={{ display: "none" }}
                        type="file"
                        id="file"
                        accept="image/*"
                        onChange={(e) => {
                            const selectedFile = e.target.files[0];
                            setFile(selectedFile);
                            if (selectedFile) {
                                setImagePreview(URL.createObjectURL(selectedFile));
                            }
                        }}
                    />
                    <label className="file" htmlFor="file">Upload Image</label>
                    {imagePreview && (
                        <div className="image-preview">
                            <img src={imagePreview} alt="Preview" />
                            <button
                                type="button"
                                className="remove-image"
                                onClick={() => {
                                    setFile(null);
                                    setImagePreview(null);
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}

                    <div className="tags-input">
                        <h3>Tags</h3>
                        <input
                            type="text"
                            placeholder="tech, news, art (comma separated)"
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            style={{ width: '100%', padding: '5px' }}
                        />
                    </div>

                    <div className="buttons">
                        <button onClick={(e) => handleClick(e, 'draft')}>Save as a draft</button>
                        <button onClick={(e) => handleClick(e, 'published')}>Publish</button>
                    </div>
                </div>

                <div className="item">
                    <h1>Category</h1>
                    {cats.map((c) => (
                        <div className="cat" key={c._id}>
                            <input
                                type="checkbox"
                                checked={cat.includes(c._id)}
                                name="cat"
                                value={c._id}
                                id={c._id}
                                onChange={handleCatChange}
                            />
                            <label htmlFor={c._id}>{c.name}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
