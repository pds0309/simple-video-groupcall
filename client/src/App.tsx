import { Route, Routes } from "react-router";

import { BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import Room from "./pages/Room";
import store from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:id" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
