const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, check password
      if (user.password !== password) {
        return res.status(401).json({
          success: false,
          message: "Mật khẩu không chính xác",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        user: {
          id: user._id,
          email: user.email,
        },
      });
    } else {
      // User doesn't exist, create new user
      user = new User({
        email,
        password,
      });

      await user.save();

      return res.status(201).json({
        success: true,
        message: "Đăng ký thành công",
        user: {
          id: user._id,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
