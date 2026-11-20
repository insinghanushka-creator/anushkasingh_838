
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Users, Package, ShoppingCart,
  Tag, Settings, Search, Bell, RefreshCw, Plus, Pencil, Trash2
} from "lucide-react";
import api from "./services/api";
import "./App.css";

function App() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("Dashboard");
  const [search, setSearch] = useState("");

  const [productForm, setProductForm] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: ""
  });

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error("Customer API error:", error);
    }
  };

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Product API error:", error);
      alert("Could not load products. Check whether Spring Boot is running.");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([loadCustomers(), loadProducts()]);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const resetProductForm = () => {
    setProductForm({
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: ""
    });
    setEditingId(null);
  };

  const saveProduct = async (e) => {
    e.preventDefault();

    const product = {
      name: productForm.name.trim(),
      sku: productForm.sku.trim() || null,
      category: productForm.category.trim(),
      price: Number(productForm.price),
      stock: Number(productForm.stock)
    };

    if (!product.name || productForm.price === "" || productForm.stock === "") {
      alert("Please enter product name, price and stock.");
      return;
    }

    if (product.price < 0 || product.stock < 0) {
      alert("Price and stock cannot be negative.");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await api.put(`/products/${editingId}`, product);
        alert("Product updated successfully!");
      } else {
        await api.post("/products", product);
        alert("Product added successfully!");
      }

      resetProductForm();
      await loadProducts();
    } catch (error) {
      console.error("Save product error:", error);
      alert(error.response?.data?.message || "Could not save product. Check the backend.");
    } finally {
      setSaving(false);
    }
  };

  const editProduct = (product) => {
    setProductForm({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      price: String(product.price ?? ""),
      stock: String(product.stock ?? "")
    });

    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const removeProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      await api.delete(`/products/${id}`);
      alert("Product deleted successfully!");
      await loadProducts();
    } catch (error) {
      console.error("Delete product error:", error);
      alert("Could not delete product.");
    }
  };

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Customers", icon: Users },
    { name: "Products", icon: Package },
    { name: "Orders", icon: ShoppingCart },
    { name: "Discounts", icon: Tag },
    { name: "Settings", icon: Settings }
  ];

  const filteredCustomers = customers.filter((customer) =>
    `${customer.name || ""} ${customer.email || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredProducts = products.filter((product) =>
    `${product.name || ""} ${product.sku || ""} ${product.category || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">R</div>
          <div>
            <h2>RetailMax</h2>
            <span>CRM PLATFORM</span>
          </div>
        </div>

        <p className="menu-label">MAIN MENU</p>

        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.name}
              className={`menu-item ${active === item.name ? "active" : ""}`}
              onClick={() => {
                setActive(item.name);
                setSearch("");
              }}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <div className="profile-avatar">AS</div>
          <div>
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">RetailMax / Overview</span>
            <h1>{active}</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button">
              <Bell size={20} />
            </button>
            <div className="profile-avatar">AS</div>
          </div>
        </header>

        <section className="welcome">
          <div>
            <h2>Welcome back, Admin!</h2>
            <p>Here's what's happening with your retail business today.</p>
          </div>
          <button className="refresh-btn" onClick={refreshData}>
            <RefreshCw size={16} /> Refresh Data
          </button>
        </section>

        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon blue"><Users /></div>
            <p>Total Customers</p>
            <h2>{customers.length}</h2>
            <span>Live database records</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple"><Package /></div>
            <p>Total Products</p>
            <h2>{products.length}</h2>
            <span>Live database records</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange"><ShoppingCart /></div>
            <p>Total Orders</p>
            <h2>—</h2>
            <span>Orders API not connected yet</span>
          </div>

          <div className="stat-card">
            <div className="stat-icon green"><Tag /></div>
            <p>Revenue</p>
            <h2>—</h2>
            <span>Sales data not connected yet</span>
          </div>
        </section>

        {active === "Products" ? (
          <section className="content-card">
            <div className="card-heading">
              <div>
                <h2>Product Management</h2>
                <p>Manage products stored in your MySQL database</p>
              </div>
            </div>

            <form onSubmit={saveProduct} className="product-form">
              <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>

              <div className="product-form-grid">
                <input
                  name="name"
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={handleProductChange}
                  required
                />

                <input
                  name="sku"
                  placeholder="SKU"
                  value={productForm.sku}
                  onChange={handleProductChange}
                />

                <input
                  name="category"
                  placeholder="Category"
                  value={productForm.category}
                  onChange={handleProductChange}
                />

                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={productForm.price}
                  onChange={handleProductChange}
                  required
                />

                <input
                  name="stock"
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Stock quantity"
                  value={productForm.stock}
                  onChange={handleProductChange}
                  required
                />
              </div>

              <div className="product-form-actions">
                <button type="submit" className="refresh-btn" disabled={saving}>
                  <Plus size={16} />
                  {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="refresh-btn"
                    onClick={resetProductForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>

            <div className="card-heading">
              <div>
                <h2>All Products ({products.length})</h2>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <p className="message">Loading products...</p>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td>#{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.sku || "—"}</td>
                        <td>{product.category || "—"}</td>
                        <td>₹{Number(product.price).toFixed(2)}</td>
                        <td>{product.stock}</td>
                        <td>
                          <button
                            type="button"
                            onClick={() => editProduct(product)}
                            title="Edit product"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeProduct(product.id)}
                            title="Delete product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredProducts.length === 0 && (
                      <tr>
                        <td colSpan="7" className="message">
                          No products found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ) : active === "Customers" || active === "Dashboard" ? (
          <section className="content-card">
            <div className="card-heading">
              <div>
                <h2>Customer Management</h2>
                <p>Customer records retrieved from your MySQL database</p>
              </div>
              <div className="search-box">
                <Search size={17} />
                <input
                  placeholder="Search customers..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>City</th>
                    <th>Segment</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>#{customer.id}</td>
                      <td>{customer.name || "Not provided"}</td>
                      <td>{customer.email || "Not provided"}</td>
                      <td>{customer.phone || "—"}</td>
                      <td>{customer.city || "—"}</td>
                      <td>
                        <span className="segment">
                          {customer.segment || "Regular"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="message">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          <section className="content-card">
            <h2>{active}</h2>
            <p>This module will be connected to the backend next.</p>
          </section>
        )}

        <footer>© 2026 RetailMax CRM. All rights reserved.</footer>
      </main>
    </div>
  );
}

export default App;
