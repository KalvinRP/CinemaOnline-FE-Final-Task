import { useContext, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import App from '../src/pages/App';
import { API, setAuthToken } from './config/api';
import { UserContext } from './context/userContext';
import Addfilm from './pages/Add-Film';
import Detail from './pages/Detail';
import MyFilmList from './pages/MyFilmList';
import MyProfile from './pages/MyProfile';
import Transaction from './pages/Transaction';
import Verification from './pages/Verification';
import { PrivateRouteAdmin } from './route/admin';
import { PrivateRouteUser } from './route/user';


if (localStorage.token) {
  setAuthToken(localStorage.token);
}

export default function Routings() {
  //eslint-disable-next-line
  const [state, dispatch] = useContext(UserContext);

  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');
  
      if (response.status === 404) {
        return dispatch({
          type: 'AUTH_ERROR',
        });
      }
  
      let payload = response.data.data;
      payload.token = localStorage.token;
  
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
    } catch (error) {
      console.log("Please login!");
    }
  };
  
  useEffect(() => {
    checkUser();
    // eslint-disable-next-line
  }, []);

  return(
    <Routes>
      {/* Public Route */}
      <Route exact path="/" element={<App />} />
      <Route exact path="/film/:id" element={<Detail />} />
      <Route exact path="/verify/:code" element={<Verification />} />

      {/* Authenticated Route */}
      <Route element={<PrivateRouteUser />}>
        <Route path="/my-films" element={<MyFilmList />} />
        <Route path="/my-films/:filmid" element={<MyFilmList />} />
        <Route path="/profile" element={<MyProfile />} />
      </Route>

      {/* Admin Route */}
      <Route element={<PrivateRouteAdmin />}>
        <Route path="/modify-film/:mode" element={<Addfilm />} />
        <Route path="/trans-list" element={<Transaction />} />
      </Route>
    </Routes>
  )
}