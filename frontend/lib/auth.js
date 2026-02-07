const API = typeof window !== 'undefined' ? '' : '';

export function getStored() {
  if (typeof window === 'undefined') return { token: null, role: null };
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return { token, role };
}

export function setStored(data) {
  if (typeof window === 'undefined') return;
  if (data.token) localStorage.setItem('token', data.token);
  if (data.role) localStorage.setItem('role', data.role);
}

export function clearStored() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}

export { API };
