export const saveTokenToStorage = async (
  accessToken: string,
  refreshToken: string
) => {
  try {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    console.log(error);
  }
};

export const removeTokenFromStorage = async () => {
  try {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  } catch (error) {
    console.log(error);
  }
};
