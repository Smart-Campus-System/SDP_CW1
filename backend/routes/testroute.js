// router.get('/test', authMiddleware, async (req, res) => {
//     try {
//       // Log the user ID from the decoded JWT token
//       console.log('User ID from JWT token:', req.user.id);
  
//       res.status(200).json({
//         msg: 'User ID decoded successfully',
//         userId: req.user.id,  // Send back the decoded user ID
//       });
//     } catch (error) {
//       console.error('Error with user ID:', error);
//       res.status(500).json({ msg: 'Server error' });
//     }
//   });
  