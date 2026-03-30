import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.DEV ? "/api" : import.meta.env.VITE_API_URL || "http://localhost:5000/api"
});

export async function loginRequest(payload) {
  const { data } = await api.post("/users/login", payload);
  return data;
}

export async function registerRequest(payload) {
  const { data } = await api.post("/users/register", payload);
  return data;
}

export async function fetchProfile() {
  const { data } = await api.get("/users/profile");
  return data;
}

export async function fetchUsers() {
  const { data } = await api.get("/users/list");
  return data;
}

export async function fetchCategories() {
  const { data } = await api.get("/categories/list");
  return data;
}

export async function createCategory(payload) {
  const { data } = await api.post("/categories/create", payload);
  return data;
}

export async function deleteCategory(categoryId) {
  const { data } = await api.delete(`/categories/delete/${categoryId}`);
  return data;
}

export async function fetchProducts() {
  const { data } = await api.get("/products/list");
  return data;
}

export async function createProduct(payload) {
  const { data } = await api.post("/products/create", payload);
  return data;
}

export async function updateProduct(productId, payload) {
  const { data } = await api.put(`/products/update/${productId}`, payload);
  return data;
}

export async function deleteProduct(productId) {
  const { data } = await api.delete(`/products/delete/${productId}`);
  return data;
}

export default api;
