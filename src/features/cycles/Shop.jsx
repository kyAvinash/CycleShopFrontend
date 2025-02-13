import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCycles } from "./cycleSlice";
import { NavLink, useLocation } from "react-router-dom";
import { addToCart, addItemOptimistically } from "../cart/cartSlice"; // Import cart actions
import { addToWishlist } from "../wishlist/wishlistSlice";
import { toast } from "react-toastify";

const Shop = () => {
  const dispatch = useDispatch();
  const cycles = useSelector((state) => state.cycles.cycles);
  const user = useSelector((state) => state.users.user);
  const cartItems = useSelector((state) => state.cart.cartItems); // Subscribe to cartItems

  const [filteredCycles, setFilteredCycles] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedYears, setSelectedYears] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState("");

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search");

  useEffect(() => {
    dispatch(fetchCycles());
  }, [dispatch]);

  useEffect(() => {
    setFilteredCycles(cycles);
  }, [cycles]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = cycles.filter((cycle) =>
        cycle.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCycles(filtered);
    } else {
      setFilteredCycles(cycles);
    }
  }, [searchQuery, cycles]);

  const uniqueBrands = [...new Set(cycles.map((cycle) => cycle.brand))];
  const uniqueModels = [...new Set(cycles.map((cycle) => cycle.model))];
  const uniqueYears = [...new Set(cycles.map((cycle) => cycle.year))];

  const applyFilters = () => {
    let filtered = cycles;

    if (searchQuery) {
      filtered = filtered.filter((cycle) =>
        cycle.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedBrands.length > 0) {
      filtered = filtered.filter((cycle) =>
        selectedBrands.includes(cycle.brand)
      );
    }

    if (selectedModels.length > 0) {
      filtered = filtered.filter((cycle) =>
        selectedModels.includes(cycle.model)
      );
    }

    if (selectedYears.length > 0) {
      filtered = filtered.filter((cycle) => selectedYears.includes(cycle.year));
    }

    if (selectedPrice) {
      filtered = filtered.filter(
        (cycle) => cycle.price <= Number.parseInt(selectedPrice)
      );
    }

    setFilteredCycles(filtered);
  };

  const handleCheckboxChange = (event, type) => {
    const value = event.target.value;

    if (type === "brand") {
      setSelectedBrands((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    } else if (type === "model") {
      setSelectedModels((prev) =>
        prev.includes(value)
          ? prev.filter((item) => item !== value)
          : [...prev, value]
      );
    }
  };

  const handleYearChange = (event) => {
    const value = Number.parseInt(event.target.value);
    setSelectedYears((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handlePriceChange = (event) => {
    setSelectedPrice(event.target.value);
  };

  const handleReset = () => {
    setSelectedBrands([]);
    setSelectedModels([]);
    setSelectedYears([]);
    setSelectedPrice("");
    setFilteredCycles(cycles);
  };

  const handleAddToCart = async (productId) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Optimistically add item to cart
    dispatch(addItemOptimistically({ productId, quantity: 1 }));

    // Dispatch the actual API call
    const resultAction = await dispatch(addToCart({ productId, quantity: 1 }));

    if (addToCart.fulfilled.match(resultAction)) {
      toast.success("Added to cart successfully!");
    } else {
      toast.error("Failed to add to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    const resultAction = await dispatch(
      addToWishlist({ userId: user._id, productId })
    );

    if (addToWishlist.fulfilled.match(resultAction)) {
      toast.success("Added to wishlist successfully!");
    } else {
      toast.error("Failed to add to wishlist");
    }
  };

  useEffect(() => {
    applyFilters();
  }, [
    selectedBrands,
    selectedModels,
    selectedYears,
    selectedPrice,
    cycles,
    searchQuery,
  ]);

  return (
    <main>
      <section
        className="container-fluid p-0 d-flex justify-content-center align-items-center min-vh-50 text-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/free-vector/after-going-tournaments-around-world-cyclists-bring-their-bikes-back-maintenance-workshop-repairs-flat-vector-illustration-design_1150-56747.jpg?size=626&ext=jpg&ga=GA1.1.1919385283.1724278859&semt=ais_hybrid')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1
          className="text-danger fw-bold display-2"
          style={{ padding: "150px 0", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          Our Collection
        </h1>
      </section>

      <section className="container-fluid py-5 bg-light">
        <div className="row">
          <div className="col-md-3">
            <div className="card border-light shadow p-4 rounded">
              <h4 className="card-title fw-bold">Filters</h4>
              <hr />
              <form>
                <div className="mb-3">
                  <label className="fw-bold">Brands</label>
                  {uniqueBrands.map((brand, index) => (
                    <div className="form-check" key={index}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`brand-${index}`}
                        value={brand}
                        checked={selectedBrands.includes(brand)}
                        onChange={(e) => handleCheckboxChange(e, "brand")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`brand-${index}`}
                      >
                        {brand}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="fw-bold">Models</label>
                  {uniqueModels.map((model, index) => (
                    <div className="form-check" key={index}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`model-${index}`}
                        value={model}
                        checked={selectedModels.includes(model)}
                        onChange={(e) => handleCheckboxChange(e, "model")}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`model-${index}`}
                      >
                        {model}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="fw-bold">Years</label>
                  {uniqueYears.map((year, index) => (
                    <div className="form-check" key={index}>
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`year-${index}`}
                        value={year}
                        checked={selectedYears.includes(year)}
                        onChange={handleYearChange}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`year-${index}`}
                      >
                        {year}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mb-3">
                  <label className="fw-bold">Price</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Max Price"
                    value={selectedPrice}
                    onChange={handlePriceChange}
                  />
                </div>

                <button
                  type="button"
                  className="btn btn-secondary w-100"
                  onClick={handleReset}
                >
                  Reset Filters
                </button>
              </form>
            </div>
          </div>

          <div className="col-md-9">
            <div className="row">
              {filteredCycles.map((cycle) => (
                <div
                  key={cycle._id}
                  className="col-lg-4 col-md-6 col-sm-12 mb-4"
                >
                  <div className="card shadow-sm h-100">
                    <NavLink to={`/product/${cycle._id}`} className="nav-link">
                      <img
                        src={cycle.imageUrls[0] || "/placeholder.svg"}
                        className="card-img-top img-fluid"
                        alt={cycle.name}
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                    </NavLink>
                    <div className="card-body d-flex flex-column">
                      <NavLink
                        to={`/product/${cycle._id}`}
                        className="nav-link"
                      >
                        <h5 className="card-title">{cycle.name}</h5>
                      </NavLink>
                      <p className="card-text text-muted">
                        <strong>Brand:</strong> {cycle.brand}
                      </p>
                      <p className="card-text text-muted">
                        <strong>Model:</strong> {cycle.model}
                      </p>
                      <p className="card-text text-muted">
                        <strong>Type:</strong> {cycle.type}
                      </p>
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-warning me-2">
                          {"★".repeat(Math.round(cycle.averageRating || 0))}
                          {"☆".repeat(5 - Math.round(cycle.averageRating || 0))}
                        </div>
                        <span>({cycle.reviews?.length || 0} reviews)</span>
                      </div>
                      <h6 className="text-danger fw-bold">
                        ₹{cycle.price.toLocaleString()}
                      </h6>
                      <div className="d-flex justify-content-between mt-auto">
                        <button
                          className="btn btn-primary"
                          onClick={() => handleAddToCart(cycle._id)}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => handleAddToWishlist(cycle._id)}
                        >
                          Wishlist
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredCycles.length === 0 && (
                <div className="text-center text-light">
                  <h5>No products found</h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Shop;
