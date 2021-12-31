import { useSelector } from "react-redux";
import { selectAvalByClientId } from "redux/reducers/avalesSlice";

const { useEffect, useState, useRef } = require("react");


function useSavingAval(avalClientId, onSuccess, onError) {
  const [loading, setLoading] = useState();
  const savedRef = useRef(false);
  const avalStored = useSelector(state => selectAvalByClientId(state, avalClientId));
  
  useEffect(() => {
    if (avalStored?.status?.name === "Error") {
      setLoading(false);
      onError();
    }
    if (avalStored?.status?.name === "Solicitando") {
      setLoading(true);
    }
    if (avalStored?.status?.name === "Solicitado") {
      setLoading(false);

      if (!savedRef.current) {
        savedRef.current = true;
        onSuccess();
      }
    }
  }, [avalStored])

  return {
    loading
  }

}

export default useSavingAval;