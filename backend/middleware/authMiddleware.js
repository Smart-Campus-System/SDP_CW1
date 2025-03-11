import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  // Step 1: Extract the token from the Authorization header
  const token = req.header("Authorization");

  // Step 2: If no token is provided, return an error
  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Step 3: Ensure the token starts with "Bearer " and extract the token value
  if (!token.startsWith("Bearer ")) {
    console.log("Invalid token format");
    return res.status(401).json({ msg: "Invalid token format" });
  }

  // Step 4: Remove "Bearer " part of the token and extract the actual token
  const tokenWithoutBearer = token.split(" ")[1];

  try {
    // Step 5: Verify and decode the token
    const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    console.log("Decoded JWT:", decoded);

    // Step 6: Fetch the user from the database using the decoded user ID
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("User not found in DB");
      return res.status(401).json({ msg: "User not found" });
    }

    // Step 7: Attach the authenticated user to the request object
    req.user = decoded;
    console.log("Authenticated User:", req.user);

    // Step 8: Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Step 9: Handle invalid or expired token errors
    console.log("Token verification failed:", error.message);
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

export default authMiddleware;
