import { useEffect, useState } from "react";
import { useToast } from "../context/ToastContext";
import { createCategory, deleteCategory, fetchCategories } from "../services/api";

function CategoriesPage() {
  const { showToast } = useToast();
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadCategories() {
      try {
        const data = await fetchCategories();

        if (!ignore) {
          setCategories(data.categories || []);
        }
      } catch (requestError) {
        if (!ignore) {
          setError(requestError.response?.data?.message || "Categories could not be loaded");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const data = await createCategory({ name });
      setCategories((current) =>
        [...current, data.category].sort((left, right) => left.name.localeCompare(right.name))
      );
      setName("");
      showToast(data.message || "Category created successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Category could not be created");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(categoryId) {
    const confirmed = window.confirm("Delete this category?");

    if (!confirmed) {
      return;
    }

    setError("");

    try {
      const data = await deleteCategory(categoryId);
      setCategories((current) => current.filter((category) => category._id !== categoryId));
      showToast(data.message || "Category deleted successfully.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Category could not be deleted");
    }
  }

  return (
    <div className="stack">
      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Catalog structure</p>
            <h3>Categories</h3>
            <p className="muted-text">Create categories here and use them in product add/update.</p>
          </div>
        </div>

        <form className="category-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter category name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <button type="submit" className="primary-button" disabled={submitting}>
            {submitting ? "Saving..." : "Add Category"}
          </button>
        </form>

        {error ? <p className="form-error">{error}</p> : null}
      </section>

      <section className="panel">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Saved items</p>
            <h3>Category List</h3>
          </div>
          <span className="ghost-button">Total: {categories.length}</span>
        </div>

        <div className="table-wrap">
          <table className="product-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4">Loading categories...</td>
                </tr>
              ) : categories.length ? (
                categories.map((category, index) => (
                  <tr key={category._id}>
                    <td>{index + 1}</td>
                    <td>{category.name}</td>
                    <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                    <td className="actions-cell">
                      <button
                        type="button"
                        className="danger-button"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No categories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default CategoriesPage;
