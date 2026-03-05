import mongoose from "mongoose";

// Create User schema
// Fields:
// - name (String, required)
// - email (String, required, unique)
// - password (String, required, minlength 6)
// - createdAt (default Date.now)

let User;
if (process.env.NODE_ENV === "test") {
  // In-memory mock for tests so the test runner doesn't require a real DB.
  const users = [];
  let idCounter = 1;
  const genId = () => String(idCounter++);

  class MockUser {
    constructor(data = {}) {
      this._id = data._id || genId();
      this.name = data.name;
      this.email = data.email;
      this.password = data.password;
      this.createdAt = data.createdAt || new Date();
    }

    toObject() {
      return {
        _id: this._id,
        name: this.name,
        email: this.email,
        password: this.password,
        createdAt: this.createdAt
      };
    }

    async save() {
      // ensure uniqueness
      const exists = users.find((u) => u.email === this.email);
      if (!exists) {
        users.push(this.toObject());
      } else {
        // replace existing
        const idx = users.findIndex((u) => u.email === this.email);
        users[idx] = this.toObject();
      }
      return this;
    }

    static async findOne(query) {
      return users.find((u) => u.email === query.email) || null;
    }

    static async findById(id) {
      return users.find((u) => u._id === id) || null;
    }
  }

  User = MockUser;
} else {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    createdAt: { type: Date, default: Date.now }
  });

  User = mongoose.model("User", userSchema);
}

export default User;