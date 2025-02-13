import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlistItems, removeFromWishlist } from "./wishlistSlice";
import { addToCart, addItemOptimistically } from "../cart/cartSlice"; // Import cart actions
import { Link, NavLink } from "react-router-dom";
import { toast } from "react-toastify";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems, status } = useSelector((state) => state.wishlist);
  const { isLoggedIn } = useSelector((state) => state.users);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchWishlistItems());
    }
  }, [dispatch, isLoggedIn]);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId))
      .unwrap()
      .then(() => {
        toast.success("Removed from wishlist successfully!");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to remove from wishlist");
      });
  };

  const handleAddToCart = (productId) => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }

    // Optimistically add item to cart
    dispatch(addItemOptimistically({ productId, quantity: 1 }));

    // Dispatch the actual API call
    dispatch(addToCart({ productId, quantity: 1 }))
      .unwrap()
      .then(() => {
        toast.success("Added to cart successfully!");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add to cart");
      });
  };

  if (!isLoggedIn) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Please login to view your wishlist.
        </div>
      </div>
    );
  }

  if (status === "loading") {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <div className="alert alert-info">
          Your wishlist is empty. <Link to="/shop">Continue shopping</Link>
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((item, index) => (
            <div key={index} className="col-md-4 mb-4">
              <div className="card h-100">
                <NavLink to={`/product/${item._id}`} className="nav-link">
                  <img
                    src={item.imageUrls?.[0] || "/placeholder.svg"} // Fallback if imageUrls is undefined
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                </NavLink>
                <div className="card-body d-flex flex-column">
                  <NavLink to={`/product/${item._id}`} className="nav-link">
                    <h5 className="card-title">{item.name}</h5>
                  </NavLink>
                  <p className="card-text">₹{item.price?.toLocaleString()}</p>
                  <p className="card-text">
                    <strong>Brand:</strong> {item.brand}
                  </p>
                  <p className="card-text">
                    <strong>Model:</strong> {item.model}
                  </p>
                  <p className="card-text">
                    <strong>Type:</strong> {item.type}
                  </p>
                  <div className="mt-auto">
                    <button
                      className="btn btn-primary me-2"
                      onClick={() => handleAddToCart(item._id)}
                    >
                      Add to Cart
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemove(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
