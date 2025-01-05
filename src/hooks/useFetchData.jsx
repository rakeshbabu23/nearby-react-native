import {useState, useEffect} from 'react';
import axios from 'axios';

const useFetchData = ({url}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const makeRequest = async () => {
      try {
        setLoading(true);
        const response = await axios.get(url, {withCredentials: true});
        ch;
        const {result} = response.data;
        if (isMounted) {
          setData(result);
        }
      } catch (e) {
        if (isMounted) {
          setError(e);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    makeRequest();

    return () => {
      isMounted = false;
    };
  }, [url]);

  return {data, error, loading};
};

export default useFetchData;
