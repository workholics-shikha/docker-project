function ProductForm({
  form,
  onChange,
  onSubmit,
  submitting,
  title,
  submitLabel,
  categories,
  categoriesLoading
}) {
  return (
    <section className="panel">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Inventory</p>
          <h3>{title}</h3>
        </div>
      </div>

      <form className="form-grid" onSubmit={onSubmit}>
        <label>
          Product Name
          <input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={onChange}
            required
          />
        </label>

        <label>
          Price
          <input
            type="number"
            name="price"
            placeholder="Enter price"
            value={form.price}
            onChange={onChange}
            required
          />
        </label>

        <label className="full-width">
          Category
          <select
            name="category"
            value={form.category}
            onChange={onChange}
            required
            disabled={categoriesLoading || !categories.length}
          >
            <option value="">
              {categoriesLoading ? "Loading categories..." : "Select category"}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <button type="submit" className="primary-button full-width" disabled={submitting}>
          {submitting ? "Saving..." : submitLabel}
        </button>
      </form>
    </section>
  );
}

export default ProductForm;
