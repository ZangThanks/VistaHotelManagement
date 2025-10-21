import Footer from "../../../components/Footer";
import Header from "../../../components/Header";
import Dashboard from "../Dashboard";

function BookingManagement() {
  return (
    <div>
      <Header />
      <div className="flex justify-around items-start">
        <Dashboard />
        <div className="content"></div>
      </div>
      <Footer />
    </div>
  );
}

export default BookingManagement;
