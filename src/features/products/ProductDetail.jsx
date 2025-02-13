import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addItemOptimistically, addToCart } from "../cart/cartSlice";
import { addToWishlist } from "../wishlist/wishlistSlice";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [similarProducts, setSimilarProducts] = useState([]);

  const dispatch = useDispatch();
  const user = useSelector((state) => state.users.user);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://cycle-shop-backend-zeta.vercel.app/products/${id}`
        );
        setProduct(response.data);

        if (response.data.reviews && response.data.reviews.length > 0) {
          setRating(response.data.averageRating);
        }

        const similarResponse = await axios.get(
          `https://cycle-shop-backend-zeta.vercel.app/products?type=${response.data.type}`
        );
        setSimilarProducts(
          similarResponse.data
            .filter((p) => p._id !== response.data._id)
            .slice(0, 3)
        );
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }

    dispatch(addItemOptimistically({ productId: product._id, quantity }));

    dispatch(
      addToCart({ productId: product._id, quantity: Number.parseInt(quantity) })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart successfully!");
      })
      .catch((error) => {
        toast.error(error.message || "Failed to add to cart");
      });
  };

  const handleAddToWishlist = async (productId) => {
    if (!user) {
      toast.error("Please login to add items to wishlist");
      return;
    }

    try {
      const resultAction = await dispatch(
        addToWishlist({ userId: user._id, productId })
      );

      if (addToWishlist.fulfilled.match(resultAction)) {
        toast.success("Added to wishlist successfully!");
      } else {
        toast.error("Failed to add to wishlist");
      }
    } catch (error) {
      toast.error(error.message || "Failed to add to wishlist");
    }
  };

  const handleSubmitReview = async () => {
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    if (!rating || !review.trim()) {
      toast.error("Please provide both rating and review");
      return;
    }

    try {
      const response = await axios.post(
        `https://cycle-shop-backend-zeta.vercel.app/products/${id}/ratings`,
        { rating, review, reviewerName: user.name }, // Include user's name
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      // Update the product state with the new review
      setProduct(response.data);
      setRating(0);
      setReview("");
      toast.success("Review submitted successfully!");
    } catch (error) {
      toast.error(
        "Failed to submit review: " +
          (error.response?.data?.error || error.message)
      );
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-5" role="alert">
        Error loading product details: {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="alert alert-warning m-5" role="alert">
        Product not found
      </div>
    );
  }

  return (
    <main className="container my-5">
      <div className="row">
        <div className="col-md-6">
          <div className="mb-3">
            <img
              src={product.imageUrls[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              className="img-fluid rounded shadow-sm"
            />
          </div>
          <div className="d-flex flex-wrap gap-2">
            {product.imageUrls?.map((url, index) => (
              <img
                key={index}
                src={url || "/placeholder.svg"}
                alt={`${product.name} view ${index + 1}`}
                className={`img-thumbnail ${
                  selectedImage === index ? "border-primary" : ""
                }`}
                style={{
                  cursor: "pointer",
                  width: "80px",
                  height: "60px",
                  objectFit: "cover",
                }}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="col-md-6">
          <div className="card border-light shadow-sm p-4">
            <h2 className="fw-bold mb-3">{product.name}</h2>
            <div className="d-flex align-items-center mb-3">
              <div className="text-warning me-2">
                {"★".repeat(Math.round(product.averageRating || 0))}
                {"☆".repeat(5 - Math.round(product.averageRating || 0))}
              </div>
              <span>({product.reviews?.length || 0} reviews)</span>
            </div>

            <p className="h3 text-primary mb-3">₹{product.price}</p>

            <div className="mb-3">
              <p>
                <strong>Brand:</strong> {product.brand}
              </p>
              <p>
                <strong>Model:</strong> {product.model}
              </p>
              <p>
                <strong>Color:</strong> {product.color}
              </p>
              <p>
                <strong>Description:</strong> {product.description}
              </p>
            </div>

            <div className="mb-3">
              <p
                className={
                  product.stockQuantity > 0 ? "text-success" : "text-danger"
                }
              >
                {product.stockQuantity > 0
                  ? `In Stock (${product.stockQuantity} available)`
                  : "Out of Stock"}
              </p>
            </div>

            {product.stockQuantity > 0 && (
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">
                  Quantity:
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="form-control"
                  min="1"
                  max={product.stockQuantity}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.min(
                        Math.max(1, Number.parseInt(e.target.value) || 1),
                        product.stockQuantity
                      )
                    )
                  }
                  style={{ width: "100px" }}
                />
              </div>
            )}

            <div className="d-flex gap-2 mb-3">
              <button
                className="btn btn-primary"
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
              >
                Add to Cart
              </button>
              <button
                className="btn btn-outline-primary"
                onClick={() => handleAddToWishlist(product._id)}
              >
                Add to Wishlist
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <h3 className="mb-4">Reviews</h3>
          {user && (
            <div className="card mb-4 p-3">
              <h5>Write a Review</h5>
              <div className="mb-3">
                <div className="d-flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`btn btn-sm ${
                        star <= rating ? "btn-warning" : "btn-outline-warning"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-3">
                <textarea
                  className="form-control"
                  rows="3"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Write your review here..."
                ></textarea>
              </div>
              <button className="btn btn-primary" onClick={handleSubmitReview}>
                Submit Review
              </button>
            </div>
          )}

          {product.reviews?.length > 0 ? (
            <div className="row">
              {product.reviews.map((review, index) => (
                <div key={index} className="col-md-6 mb-3">
                  <div className="card">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <div className="text-warning me-2">
                          {"★".repeat(review.rating)}
                          {"☆".repeat(5 - review.rating)}
                        </div>
                        <span className="text-muted">
                          by {review.reviewerName}
                        </span>
                      </div>
                      <p>{review.review}</p>
                      <small className="text-muted">
                        Reviewed on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="alert alert-warning" role="alert">
              No reviews yet. Be the first to review!
            </div>
          )}
        </div>
      </div>

      {similarProducts.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="mb-4">Similar Products</h3>
            <div className="row">
              {similarProducts.map((product) => (
                <div key={product._id} className="col-md-4 mb-3">
                  <div className="card" style={{ height: "400px" }}>
                    <img
                      src={product.imageUrls[0] || "/placeholder.svg"}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">₹{product.price}</p>
                      <div className="mt-auto">
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/product/${product._id}`)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ProductDetail;
