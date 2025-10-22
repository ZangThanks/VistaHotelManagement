import "./index.css";

import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeaderHome from "./components/HeaderHome";
import BookingManagement from "./pages/admin/booking/BookingManagement";

function App() {
  return (
    <>
      <div>
        {/* <Header />
        <HeaderHome />
        <Footer /> */}
        <BookingManagement />
      </div>
    </>
  );
}

export default App;
