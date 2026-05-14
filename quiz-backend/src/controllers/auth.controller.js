import { User } from "../models/user.model.js";
import { signToken } from "../services/jwt.service.js";

function tokenForUser(user) {
  const secret = process.env.JWT_SECRET;
  const token = signToken({ sub: String(user._id), role: user.role }, secret);
  return {
    token,
    user: { id: user._id, email: user.email, role: user.role, createdAt: user.createdAt },
  };
}

export async function register(req, res) {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }
    const user = await User.create({ email, password, role: "user" });
    return res.status(201).json(tokenForUser(user));
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    return res.json(tokenForUser(user));
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}

export async function me(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.json({
      id: user._id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || "Server error" });
  }
}
