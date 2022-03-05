import { useEffect, useState, useRef } from 'react';
import { useSelector } from "react-redux";
import { selectAvalById } from 'redux/reducers/avalesSlice';

function useUpdatingAval(avalId, onSuccess, onError) {
  const aval = useSelector(state => selectAvalById(state, avalId));
  const [loading, setLoading] = useState(false);
  const lastUpdated = useRef(false);

  useEffect(() => {

    if (aval?.updatedAt && !lastUpdated.current) {
      lastUpdated.current = aval.updatedAt?.getTime();
    }

    if (lastUpdated.current && aval?.updatedAt?.getTime() > lastUpdated.current) {
      lastUpdated.current = aval.updatedAt?.getTime();
      onSuccess(aval);
    }
    
    if (aval?.isUpdating()) { 
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [aval])

  return {
    loading
  }

}

export default useUpdatingAval;