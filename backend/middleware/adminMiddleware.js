const adminMiddleware = (req, res, next) => {
    // Check if req.user exists
    if (!req.user) {
      console.log("No user found in request (authentication issue)");
      return res.status(401).json({ msg: "No user found, authorization denied" });
    }
  
    // Log the user object to verify the decoded JWT
    console.log("User found:", req.user);
  
    // Check if the user has an 'admin' role
    if (req.user.role !== "admin") {
      console.log("User is not an admin");
      return res.status(403).json({ msg: "Access denied. Admins only." });
    }
  
    next();
  };
  
  export default adminMiddleware;
  