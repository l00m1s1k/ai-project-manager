export async function fetchWithAuth(url, options = {}) {
  const accessToken = localStorage.getItem('token');
  const refreshToken = localStorage.getItem('refresh_token');

  const makeRequest = async (token) => {
    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    return fetch(url, { ...options, headers });
  };

  let response = await makeRequest(accessToken);

  if (response.status === 401 && refreshToken) {
    // Спроба оновити токен
    const refreshRes = await fetch(`${process.env.REACT_APP_API_URL}/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const refreshData = await refreshRes.json();

    if (refreshRes.ok && refreshData.access) {
      localStorage.setItem('token', refreshData.access);
      response = await makeRequest(refreshData.access); // Повторний запит з новим токеном
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
  }

  return response;
}
