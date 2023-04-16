const token = (userData) => {
  return {
    userID: userData._id,
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: userData.role,
  };
};

module.exports = token

