import mongoose from "mongoose";

// Create Task schema
// Fields:
// - title (String, required)
// - description (String)
// - completed (Boolean, default false)
// - owner (ObjectId, ref "User", required)
// - createdAt (default Date.now)

let Task;
if (process.env.NODE_ENV === "test") {
	const tasks = [];
	let idCounter = 1;
	const genId = () => String(idCounter++);

	class MockTask {
		constructor(data = {}) {
			this._id = data._id || genId();
			this.title = data.title;
			this.description = data.description || "";
			this.completed = data.completed || false;
			this.owner = data.owner;
			this.createdAt = data.createdAt || new Date();
		}

		toObject() {
			return {
				_id: this._id,
				title: this.title,
				description: this.description,
				completed: this.completed,
				owner: this.owner,
				createdAt: this.createdAt
			};
		}

		async save() {
			tasks.push(this.toObject());
			return this;
		}

		async deleteOne() {
			const idx = tasks.findIndex((t) => t._id === this._id);
			if (idx > -1) tasks.splice(idx, 1);
		}

		static async find(query) {
			// support query { owner: id }
			if (query && query.owner) {
				return tasks.filter((t) => String(t.owner) === String(query.owner));
			}
			return tasks;
		}

		static async findById(id) {
			return tasks.find((t) => t._id === id) || null;
		}
	}

	Task = MockTask;
} else {
	const taskSchema = new mongoose.Schema({
		title: { type: String, required: true },
		description: { type: String },
		completed: { type: Boolean, default: false },
		owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		createdAt: { type: Date, default: Date.now }
	});

	Task = mongoose.model("Task", taskSchema);
}

export default Task;