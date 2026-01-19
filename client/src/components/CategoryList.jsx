import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const location = useLocation();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);
                setCategories(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchCategories();
    }, []);

    // Helper to check if category is active
    const isActive = (catName) => {
        return location.pathname.includes(`/category/${catName}`) || location.search.includes(`cat=${catName}`);
    };

    return (
        <div className="category-list">
            <div className="container">
                <Link to="/" className={`cat-item ${location.pathname === '/' && !location.search ? 'active' : ''}`}>
                    All
                </Link>
                {categories.map((cat) => (
                    <Link
                        to={`/category/${cat.name}`}
                        key={cat._id}
                        className={`cat-item ${isActive(cat.name) ? 'active' : ''}`}
                    >
                        {cat.name.toUpperCase()}
                    </Link>
                ))}
            </div>
            <style>{`
                .category-list {
                    background-color: #f8f9fa;
                    padding: 10px 0;
                    margin-bottom: 20px;
                    border-bottom: 1px solid #ddd;
                    position: sticky;
                    top: 0;
                    z-index: 99;
                }
                .category-list .container {
                    display: flex;
                    gap: 20px;
                    overflow-x: auto;
                    white-space: nowrap;
                    padding: 0 10px;
                }
                .cat-item {
                    text-decoration: none;
                    color: #555;
                    font-weight: 500;
                    padding: 5px 10px;
                    border-radius: 15px;
                    transition: all 0.3s ease;
                }
                .cat-item:hover, .cat-item.active {
                    background-color: #teal;
                    color: teal;
                    background: #e6fcf5;
                }
            `}</style>
        </div>
    );
};

export default CategoryList;
