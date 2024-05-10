import styles from "./Tasks.module.css";
import modalStyles from "./Modal.module.css";
// import { useSelector } from "react-redux";
import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPenToSquare,
	faPlus,
	faPowerOff,
	faSearch,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ReactModal from "react-modal";

const TasksData = [
	{
		id: 1,
		title: "Finishing Striver’s Trees Playlist",
		description:
			"Will Complete the playlist by 12 PM tommorrow and will be writing notes along with",
		status: "completed",
		priority: "medium",
		dueDate: "2022-09-30",
	},
	{
		id: 2,
		title: "Finishing Striver’s Trees Playlist",
		description:
			"Will Complete the playlist by 12 PM tommorrow and will be writing notes along with",
		status: "pending",
		priority: "low",
		dueDate: "2022-09-30",
	},
	{
		id: 3,
		title: "Finishing Striver’s Trees Playlist",
		description:
			"Will Complete the playlist by 12 PM tommorrow and will be writing notes along with",
		status: "pending",
		priority: "low",
		dueDate: "2022-09-30",
	},
];

const Tasks = () => {
	// const user = useSelector((data) => data.user.user);
	// console.log(user);
	const [createTaskModal, setCreateTaskModal] = useState(false);
	const [editTaskModal, setEditTaskModal] = useState(false);
	const [deleteTaskId, setDeleteTaskId] = useState("");
	const [taskData, setTaskData] = useState({
		title: "",
		description: "",
		status: "pending",
		priority: "low",
		dueDate: "",
	});

	const handleTaskDataChange = (e) => {
		setTaskData({ ...taskData, [e.target.name]: e.target.value });
	};

	const handleCreateTask = (e) => {
		e.preventDefault;
		try {
			console.log(taskData);
		} catch (error) {
			console.log(error);
		} finally {
			setTaskData({
				title: "",
				description: "",
				status: "pending",
				priority: "low",
				dueDate: "",
			});
			setCreateTaskModal(false);
		}
	};

	const handleEditTaskData = (taskData) => {
		setEditTaskModal(true);
		setTaskData({
			title: taskData.title,
			description: taskData.description,
			status: taskData.status,
			priority: taskData.priority,
			dueDate: taskData.dueDate,
		});
		setCreateTaskModal(true);
	};

	return (
		<>
			<section className={styles.tasks}>
				<div className={styles.header}>
					<div className={styles.heading}>
						<h1>My Tasks</h1>
						<p>
							<FontAwesomeIcon
								icon={faPowerOff}
								style={{ width: "1.25rem", height: "1.25rem" }}
							/>
							<span>Logout</span>
						</p>
					</div>
					<div className={styles.search}>
						<FontAwesomeIcon
							icon={faSearch}
							className={styles.searchIcon}
						/>
						<input type="text" placeholder="Search" />
					</div>
					<div className={styles.filtersBox}>
						<div className={styles.filters}>
							<h3>Filters :</h3>
							<select>
								<option>Status (All)</option>
								<option>Pending</option>
								<option>Ongoing</option>
								<option>Completed</option>
								<option>Overdue</option>
							</select>
							<select>
								<option>Priority (All)</option>
								<option>High</option>
								<option>Medium</option>
								<option>Low</option>
							</select>
							<input
								className={styles.filterDueDate}
								type="date"
							/>
						</div>
						<div className={styles.createTask}>
							<button
								className={styles.addTask}
								onClick={() => {
									setCreateTaskModal(true);
									setEditTaskModal(false);
									setTaskData({
										title: "",
										description: "",
										status: "pending",
										priority: "low",
										dueDate: "",
									});
								}}
							>
								<FontAwesomeIcon icon={faPlus} />
								<span>Create Task</span>
							</button>
						</div>
					</div>
				</div>
				<div className={styles.container}>
					<ul className={styles.tasksList}>
						{TasksData.map((item, idx) => (
							<div key={idx} className={styles.listItem}>
								<div className={styles.textBox}>
									<h2>{item.title}</h2>
									<p>{item.description}</p>
								</div>
								<div className={styles.actionsBox}>
									<div className={styles.props}>
										<div className={styles.status}>
											<label>Status</label>
											<select>
												<option
													selected={
														item.status ===
														"pending"
													}
												>
													Pending
												</option>
												<option
													selected={
														item.status ===
														"ongoing"
													}
												>
													Ongoing
												</option>
												<option
													selected={
														item.status ===
														"completed"
													}
												>
													Completed
												</option>
												<option
													selected={
														item.status ===
														"overdue"
													}
												>
													Overdue
												</option>
											</select>
										</div>
										<div className={styles.priority}>
											<label>Priority</label>
											<select>
												<option
													selected={
														item.priority === "high"
													}
												>
													High
												</option>
												<option
													selected={
														item.priority ===
														"medium"
													}
												>
													Medium
												</option>
												<option
													selected={
														item.priority === "low"
													}
												>
													Low
												</option>
											</select>
										</div>
										<div className={styles.dueDate}>
											<label>Due Date</label>
											<input
												type="date"
												value={item.dueDate}
											/>
										</div>
									</div>
									<div className={styles.actions}>
										<FontAwesomeIcon
											icon={faPenToSquare}
											className={styles.editIcon}
											onClick={() => {
												handleEditTaskData(item);
											}}
										/>
										<FontAwesomeIcon
											icon={faTrash}
											className={styles.deleteIcon}
											onClick={() =>
												setDeleteTaskId(item.id)
											}
										/>
									</div>
								</div>
							</div>
						))}
					</ul>
				</div>
			</section>
			<ReactModal
				isOpen={createTaskModal}
				onRequestClose={() => {
					setCreateTaskModal(false);
					setEditTaskModal(false);
				}}
				style={{
					overlay: {
						backgroundColor: "rgba(255, 255, 255, 0.6)",
					},
					content: {
						top: "50%",
						left: "50%",
						right: "auto",
						bottom: "auto",
						marginRight: "-50%",
						transform: "translate(-50%, -50%)",
						borderWidth: "1px",
						borderColor: "#000",
						borderStyle: "solid",
						borderRadius: "10px",
						width: "800px",
					},
				}}
			>
				<div className={modalStyles.wrapper}>
					{editTaskModal ? <h1>Edit Task</h1> : <h1>Create Task</h1>}
					<form
						className={modalStyles.form}
						onSubmit={(e) => handleCreateTask(e)}
					>
						<div className={modalStyles.formItem}>
							<label>
								Task
								<span className={modalStyles.required}> *</span>
							</label>
							<input
								type="text"
								placeholder="Project Presentation"
								name="task"
								value={taskData.title}
								onChange={handleTaskDataChange}
								required
							/>
						</div>
						<div className={modalStyles.formItem}>
							<label>Description</label>
							<textarea
								type="text"
								name="description"
								value={taskData.description}
								onChange={handleTaskDataChange}
								placeholder="Will be presenting the project in front of the team"
							/>
						</div>
						<div className={modalStyles.taskPropsBox}>
							<div className={modalStyles.status}>
								<label>
									Status
									<span className={modalStyles.required}>
										{" "}
										*
									</span>
								</label>
								<select
									name="status"
									value={taskData.status}
									onChange={handleTaskDataChange}
								>
									<option
										value="pending"
										selected={taskData.status === "pending"}
									>
										Pending
									</option>
									<option
										value="ongoing"
										selected={taskData.status === "ongoing"}
									>
										Ongoing
									</option>
									<option
										value="completed"
										selected={
											taskData.status === "completed"
										}
									>
										Completed
									</option>
									<option
										value="overdue"
										selected={taskData.status === "overdue"}
									>
										Overdue
									</option>
								</select>
							</div>
							<div className={modalStyles.priority}>
								<label>
									Priority
									<span className={modalStyles.required}>
										{" "}
										*
									</span>
								</label>
								<select
									name="priority"
									value={taskData.priority}
									onChange={handleTaskDataChange}
								>
									<option
										value="high"
										selected={taskData.priority === "high"}
									>
										High
									</option>
									<option
										value="medium"
										selected={
											taskData.priority === "medium"
										}
									>
										Medium
									</option>
									<option
										value="low"
										selected={taskData.priority === "low"}
									>
										Low
									</option>
								</select>
							</div>
							<div className={modalStyles.dueDate}>
								<label>
									Due Date
									<span className={modalStyles.required}>
										{" "}
										*
									</span>
								</label>
								<input
									type="date"
									name="dueDate"
									value={taskData.dueDate}
									onChange={handleTaskDataChange}
									required
								/>
							</div>
						</div>
						<div className={modalStyles.btns}>
							<button
								type="submit"
								className={modalStyles.createBtn}
							>
								{editTaskModal ? "Edit Task" : "Create Task"}
							</button>
							<button
								className={modalStyles.cancelBtn}
								onClick={() => setCreateTaskModal(false)}
							>
								Cancel
							</button>
						</div>
					</form>
				</div>
			</ReactModal>
		</>
	);
};

export default Tasks;
