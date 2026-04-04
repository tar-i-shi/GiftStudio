import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedProducts from "./components/FeaturedProducts";
import Footer from "./components/Footer";
import OccasionsPage from "./components/OccasionsPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import CustomizedHamper from "./components/CustomizedHamper";
import EngravedWoodCustomization from './components/EngravedWoodCustomization';
import CustomPhotoMug from './components/CustomizedPhotoMug';
import CustomizedCushion from './components/CustomizedCushion';
import PersonalisedProducts from './components/PersonalisedProducts';
import CommonGiftsPage from './components/CommonGiftsPage';
import { CartProvider } from './components/CartContext';
import CartPage from './components/CartPage';
import { AuthProvider } from "./components/AuthContext";
import CheckoutPage from './components/CheckoutPage';
import OrdersPage from './components/OrdersPage';
import SearchResultsPage from "./components/SearchResultsPage";
import Contact from './components/Contact';
import OrderSuccess from './components/OrderSuccess';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          {/* Full page layout with flex column */}
          <div className="flex flex-col min-h-screen bg-white text-gray-800">
            <Navbar />

            <main className="flex-grow">
              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <Categories />
                      <FeaturedProducts />
                    </>
                  }
                />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/occasions" element={<OccasionsPage />} />
                <Route path="/customized-hamper" element={<CustomizedHamper />} />
                <Route path="/engraved-customization" element={<EngravedWoodCustomization />} />
                <Route path="/custom-photo-mug" element={<CustomPhotoMug />} />
                <Route path="/custom-cushion" element={<CustomizedCushion />} />
                <Route path="/personalised-products" element={<PersonalisedProducts />} />
                <Route path="/common-gifts" element={<CommonGiftsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/order-success" element={<OrderSuccess />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
