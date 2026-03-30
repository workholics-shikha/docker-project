import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { deleteProduct, fetchProducts } from "../services/api";

const ITEMS_PER_PAGE = 5;

function normalizeProducts(payload) {
  if (Array.isArray(payload?.products)) {
    return payload.products;
  }

  if (Array.isArray(payload)) {
    return payload;
  }

  return [];
}

function ProductsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!location.state?.message) {
      return;
    }

    showToast(location.state.message);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, showToast]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let ignore = false;

    async function loadProducts() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchProducts();

        if (!ignore) {
          const apiProducts = normalizeProducts(data);
          setProducts(apiProducts);
        }
      } catch (requestError) {
        if (!ignore) {
          setProducts([]);
          setError(requestError.response?.data?.message || "Products could not be loaded from API");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      ignore = true;
    };
  }, [token]);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const visibleProducts = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return products.slice(start, start + ITEMS_PER_PAGE);
  }, [page, products]);

  async function handleDelete(productId) {
    if (!productId) {
      return;
    }

    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      await deleteProduct(productId);
      setProducts((current) => current.filter((product) => product._id !== productId));
      showToast("Product deleted successfully.");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message ||
          "Delete request failed. Your current Node delete endpoint may need support for Mongo _id values."
      );
    }
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h3>Product List</h3>
          <p className="muted-text">Showing products returned by `/api/products/list`.</p>
        </div>

        <div className="topbar-actions">
          <span className="ghost-button">Total: {products.length}</span>
          <Link to="/products/add" className="primary-button inline-button">
            Add Product
          </Link>
        </div>
      </div>

      {error ? <p className="form-error">{error}</p> : null}

      <div className="table-wrap">
        <table className="product-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6">Loading products from API...</td>
              </tr>
            ) : visibleProducts.length ? (
              visibleProducts.map((product, index) => (
                <tr key={product._id || `${product.name}-${index}`}>
                  <td>{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                  <td>{product.name || "-"}</td>
                  <td>{product.category || "-"}</td>
                  <td>{product.price ?? "-"}</td>
                  <td>{product.createdAt ? new Date(product.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="actions-cell">
                    <button
                      type="button"
                      className="ghost-button"
                      onClick={() =>
                        navigate(`/products/${product._id}/edit`, { state: { product } })
                      }
                      disabled={!product._id}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger-button"
                      onClick={() => handleDelete(product._id)}
                      disabled={!product._id}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No products found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          type="button"
          className="ghost-button"
          disabled={page === 1}
          onClick={() => setPage((current) => current - 1)}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          type="button"
          className="ghost-button"
          disabled={page === totalPages}
          onClick={() => setPage((current) => current + 1)}
        >
          Next
        </button>
      </div>
    </section>
  );
}

export default ProductsPage;
