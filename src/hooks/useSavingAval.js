import { useSelector } from "react-redux";
import { selectAvalByClientId } from "redux/reducers/avalesSlice";

const { useEffect, useState, useRef } = require("react");


function useSavingAval(avalClientId, onSuccess, onError) {
  const [loading, setLoading] = useState();
  const prevStatusRef = useRef();
  const savedRef = useRef(false);
  const avalStored = useSelector(state => selectAvalByClientId(state, avalClientId));

  useEffect(() => {
    
    if (avalStored?.isSolicitando()) {
      setLoading(true);
      prevStatusRef.current = "Solicitando";
    }

    if (prevStatusRef.current === "Solicitando" && avalStored?.isSolicitado()) {
      prevStatusRef.current = null;
      setLoading(false);

      if (avalStored?.id) {
        if (!savedRef.current) {
          savedRef.current = true;
          onSuccess();
        }
      }
    }
  }, [avalStored])

  return {
    loading
  }

}

export default useSavingAval;