import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage/LandingPage';
import SignUp from './pages/SignUpPage/SignUpPage';
import LogIn from './pages/LogInPage/LogInPage';
import AboutusPage from './pages/AboutusPage/AboutusPage';
import MainPage from './pages/MainPage/MainPage';
import InstructionsPage from './pages/InstructionsPage/InstructionsPage';
import ProfilePage from './pages/ProfilePage/Profile';
import MyFridgePage from './pages/MyFridgePage/MyFridge';
import AddIngredientPage from './pages/AddIngredientpage/AddIngredient'
import Valorationpage from './pages/ValorationPage/ValorationPage';
import protected_UserCheck from './protected/UserCheck'
function Router(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={<LandingPage />}/>
        <Route path={"/signup"} element={<SignUp />}/>
        <Route path={"/login"} element={<LogIn />}/>
        <Route path={"/AboutusPage"} element={<AboutusPage />}/>
        <Route path={"/mainpage"} element={<MainPage />}/>
        <Route path={"/DocsPage"} element={<InstructionsPage />}/>
        <Route path={"/Profile"} element={<ProfilePage />}/>
        <Route path={"/MyFridge"} element={<MyFridgePage />}/>
        <Route path={"/valorationspage"} element={<Valorationpage />}/>
        <Route path={"/AddIngredient"} element={<AddIngredientPage />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default Router;