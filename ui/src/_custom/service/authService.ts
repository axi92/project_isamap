export async function fetchCurrentUser(): Promise<UserAuthJson | null> {
  const API_BASE_URL = __API_BASE_URL__;
  const res = await fetch(API_BASE_URL + '/auth/me', {
    credentials: 'include',
  });

  if (res.status === 200) {
    return await res.json(); // user info
  } else {
    return null; // not logged in
  }
}

export type UserAuthJson = {
  userId: string;
  username: string;
  avatar?: string;
  verified: boolean;
};
