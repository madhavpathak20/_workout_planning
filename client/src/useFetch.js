//useFetch.js

import { useEffect, useState } from "react";
import axios from "axios";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(false);
            try {
                // Add base URL if the URL doesn't start with http
                const fullUrl = url.startsWith('http') ? url : `https://shapesync-5rkn.onrender.com/api${url}`;
                const res = await axios.get(fullUrl);
                setData(res.data);
            } catch (err) {
                setError(err);
                console.error("Fetch error:", err);
            }
            setLoading(false);
        };
        fetchData();
    }, [url]);

    const reFetch = async () => {
        setLoading(true);
        setError(false);
        try {
            const fullUrl = url.startsWith('http') ? url : `https://shapesync-5rkn.onrender.com/api${url}`;
            const res = await axios.get(fullUrl);
            setData(res.data);
        } catch (err) {
            setError(err);
            console.error("ReFetch error:", err);
        }
        setLoading(false);
    };

    return { data, loading, error, reFetch };
};

export default useFetch;
