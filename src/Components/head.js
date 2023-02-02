import React, { memo } from "react";
import HeadLog from "./headLog";
import HeadUnlog from "./headUnlog";
import { useContext } from "react";
import { UserContext } from "../context/userContext"

function Head() {
    const [state, dispatch] = useContext(UserContext);
  
    return (
      <>
        {!state.isLogin ? <HeadUnlog dispatch={dispatch} state={state} /> : <HeadLog dispatch={dispatch} state={state} />}
      </>
    )
  };

export default memo(Head);