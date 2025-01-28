import LoginUser from "./components/pages/User/LoginUser"
import RegisterUser from "./components/pages/User/RegisterUser"
import CategoriesComponent from "./components/pages/Worker/Category"
import LoginWorker from "./components/pages/Worker/LoginWorker"
import RegisterWorker from "./components/pages/Worker/RegisterWorker"
import ListTemplate from "./components/pages/Worker/template/ListTemplates"

function App() {

  return (
    <>
    <CategoriesComponent/>
    <ListTemplate/>
    </>
  )
}

export default App
