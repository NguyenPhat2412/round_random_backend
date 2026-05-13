const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();

    // Validate input
    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const adminEmail = String(
      process.env.ADMIN_EMAIL || process.env.EMAIL_HOST || "",
    )
      .trim()
      .toLowerCase();
    const adminPassword = String(
      process.env.ADMIN_PASSWORD || process.env.EMAIL_PASSWORD || "",
    ).trim();

    // Prioritize pre-configured account from environment variables
    if (adminEmail && adminPassword) {
      if (normalizedEmail !== adminEmail || password !== adminPassword) {
        return res.status(401).json({
          success: false,
          message: "Email hoặc mật khẩu không chính xác",
        });
      }

      const secret =
        process.env.JWT_SECRET || "your-secret-key-change-in-production";
      const token = jwt.sign({ id: "admin-env", email: adminEmail }, secret, {
        expiresIn: "30d",
      });

      return res.status(200).json({
        success: true,
        message: "Đăng nhập thành công",
        token,
        user: {
          id: "admin-env",
          email: adminEmail,
        },
      });
    }

    // Fallback: only allow existing users in database (no auto registration)
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Tài khoản không tồn tại hoặc chưa được cấp quyền",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Email hoặc mật khẩu không chính xác",
      });
    }

    const secret =
      process.env.JWT_SECRET || "your-secret-key-change-in-production";
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      secret,
      { expiresIn: "30d" },
    );

    return res.status(200).json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
