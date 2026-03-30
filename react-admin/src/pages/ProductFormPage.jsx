import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import ProductForm from "../components/ProductForm";
import { createProduct, fetchCategories, updateProduct } from "../services/api";

const initialForm = {
  name: "",
  price: "",
  category: ""
};

function ProductFormPage({ mode }) {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "edit" && location.state?.product) {
      const { name, price, category } = location.state.product;
      setForm({
        name: name || "",
        price: String(price ?? ""),
        category: category || ""
      });
    }
  }, [location.state, mode]);

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
          setCategoriesLoading(false);
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

    const payload = {
      ...form,
      price: Number(form.price)
    };

    try {
      if (mode === "edit") {
        await updateProduct(productId, payload);
        navigate("/products", {
          replace: true,
          state: { message: "Product updated successfully." }
        });
      } else {
        await createProduct(payload);
        navigate("/products", {
          replace: true,
          state: { message: "Product created successfully." }
        });
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Product could not be saved");
    } finally {
      setSubmitting(false);
    }
  }

  if (mode === "edit" && !location.state?.product) {
    return (
      <section className="panel">
        <p className="form-error">
          This edit page expects a product selected from the product list because your current API
          does not reliably return single products by id.
        </p>
        <Link to="/products" className="primary-button inline-button">
          Back to products
        </Link>
      </section>
    );
  }

  return (
    <div className="stack">
      {error ? <p className="form-error">{error}</p> : null}
      <ProductForm
        form={form}
        onChange={(event) => setForm({ ...form, [event.target.name]: event.target.value })}
        onSubmit={handleSubmit}
        submitting={submitting}
        title={mode === "edit" ? "Update Product" : "Add Product"}
        submitLabel={mode === "edit" ? "Update Product" : "Create Product"}
        categories={categories}
        categoriesLoading={categoriesLoading}
      />
    </div>
  );
}

export default ProductFormPage;
