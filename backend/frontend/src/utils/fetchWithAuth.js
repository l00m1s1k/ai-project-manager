export async function fetchWithAuth(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(url, { ...options, headers });
    
    if (response.status === 401) {
      // Обробка розлогінення
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }

    return response;
  } catch (error) {
    console.error('Network error:', error);
    throw error;
  }
}