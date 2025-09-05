export async function fetchCurrentUser(): Promise<any> {
  const res = await fetch('http://localhost:3000/api/v1/auth/me', {
    credentials: 'include',
  });

  if (res.status === 200) {
    return await res.json(); // user info
  } else {
    return null; // not logged in
  }
}