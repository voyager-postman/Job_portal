export const getAuthData = () => {
  const jobSeeker = JSON.parse(localStorage.getItem("JOBSEEKER_AUTH"));
  const recruiter = JSON.parse(localStorage.getItem("RECRUITER_AUTH"));

  return jobSeeker || recruiter || null;
};

export const getToken = () => {
  return getAuthData()?.token || null;
};

export const getUser = () => {
  return getAuthData()?.user || null;
};

export const getUserRole = () => {
  return getAuthData()?.role || null;
};

export const logout = () => {
  localStorage.removeItem("JOBSEEKER_AUTH");
  localStorage.removeItem("RECRUITER_AUTH");
};
