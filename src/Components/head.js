import React, { useContext } from "react";

export default function Head() {
    const [state, dispatch] = useContext(UserContext);
  
    return (
      <>
        {!state.isLogin ? <NavbarUnlog dispatch={dispatch} state={state} /> : <NavbarLog dispatch={dispatch} state={state} />}
      </>
    )
  };