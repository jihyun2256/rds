const API_BASE = "http://YOUR_BACKEND_PUBLIC_DNS_OR_IP:3000";

export const api = {
  register: (data) =>
    fetch(`${API_BASE}/users/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then((r) => r.json()),

  login: (data) =>
    fetch(`${API_BASE}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then((r) => r.json()),

  getProducts: () =>
    fetch(`${API_BASE}/products`).then((r) => r.json()),

  createOrder: (data) =>
    fetch(`${API_BASE}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    }).then((r) => r.json()),
};
