import styles from "./Tasks.module.css";
import modalStyles from "./Modal.module.css";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPenToSquare,
	faPlus,
	faPowerOff,
	faSearch,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import ReactModal from "react-modal";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import Loader from "../../components/loader/Loader";
import Loader2 from "../../components/loader/Loader2";

const Tasks = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [loading2, setLoading2] = useState(false);
	const [createTaskModal, setCreateTaskModal] = useState(false);
	const [editTaskModal, setEditTaskModal] = useState(false);
	const [editTaskId, setEditTaskId] = useState("");
	const [deleteTaskId, setDeleteTaskId] = useState("");
	const [tasks, setTasks] = useState([]);
	const [searchParams, setSearchParams] = useSearchParams("");

	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		if (user) {
			if (user.role === "user") {
				setLoading(false);
			} else {
				navigate("/login");
			}
		} else {
			navigate("/login");
		}
	}, [user, navigate]);

	const userId = user?.id;

	const [taskData, setTaskData] = useState({
		title: "",
		description: "",
		status: "pending",
		priority: "low",
		dueDate: "",
		userId: userId,
	});

	const gettasks = async () => {
		try {
			const status = searchParams.get("status");
			const priority = searchParams.get("priority");
			const dueDate = searchParams.get("dueDate");

			let queryString = `${
				import.meta.env.VITE_BACKEND_URL
			}/api/v1/tasks/${userId}`;
			const filters = [];

			if (status) filters.push(`status=${status}`);
			if (priority) filters.push(`priority=${priority}`);
			if (dueDate) filters.push(`dueDate=${dueDate}`);

			if (filters.length > 0) {
				queryString += "?" + filters.join("&");
			}

			const response = await axios.get(queryString);
			setTasks(response.data);
		} catch (error) {
			console.log(error);
			toast.error("Failed to fetch tasks");
			setTasks([]);
		}
	};

	useEffect(() => {
		gettasks();
	}, [searchParams]);

	const handleTaskDataChange = (e) => {
		setTaskData({ ...taskData, [e.target.name]: e.target.value });
	};

	const handleCreateTask = async (e) => {
		e.preventDefault();
		try {
			setLoading2(true);
			await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/create`,
				taskData
			);
			gettasks();
			toast.success("Task Created Successfully");
		} catch (error) {
			console.log(error);
		} finally {
			setTaskData({
				title: "",
				description: "",
				status: "pending",
				priority: "low",
				dueDate: "",
				userId: userId,
			});
			setCreateTaskModal(false);
			setLoading2(false);
		}
	};

	const handleDeleteTask = async (id) => {
		console.log(id);
		try {
			await axios.delete(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/delete/` + id
			);
			gettasks();
			toast.success("Task Deleted Successfully");
		} catch (error) {
			console.log(error);
		} finally {
			setDeleteTaskId(() => null);
		}
	};

	const handleEditTaskData = (data) => {
		setEditTaskModal(true);
		setTaskData({
			title: data.title,
			description: data.description,
			status: data.status,
			priority: data.priority,
			dueDate: new Date(data.dueDate).toISOString().split("T")[0],
			userId: userId,
		});
		setCreateTaskModal(true);
	};

	const handleEditTaskDetail = (data) => {
		axios
			.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/edit/` +
					data.id,
				data
			)
			.then(() => {
				gettasks();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const handleEditTask = async (e) => {
		e.preventDefault();
		try {
			setLoading2(true);
			await axios.put(
				`${import.meta.env.VITE_BACKEND_URL}/api/v1/tasks/edit/` +
					editTaskId,
				taskData
			);
			gettasks();
			toast.success("Task Edited Successfully");
		} catch (error) {
			console.log(error);
		} finally {
			setTaskData({
				title: "",
				description: "",
				status: "pending",
				priority: "low",
				dueDate: "",
				userId: userId,
			});
			setEditTaskModal(false);
			setCreateTaskModal(false);
			setLoading2(false);
		}
	};

	const handleParamsChange = (key, value) => {
		if (!value) {
			searchParams.delete(key);
		} else {
			const currentValue = searchParams.get(key);
			if (currentValue !== value) {
				searchParams.set(key, value);
			}
		}
		setSearchParams(searchParams, { replace: true });
	};

	if (loading) {
		return <Loader />;
	}

	return (
		<>
			<section className={styles.tasks}>
				<div className={styles.header}>
					<div className={styles.heading}>
						<h1>{user?.name.split(" ")[0]}'s Tasks </h1>
						<p
							onClick={() => {
								localStorage.removeItem("jwt_token");
								dispatch(logout());
								navigate("/");
							}}
						>
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
							<select
								onChange={(e) =>
									handleParamsChange("status", e.target.value)
								}
							>
								<option
									value=""
									selected={!searchParams.get("status")}
								>
									Status (All)
								</option>
								<option
									value="pending"
									selected={
										searchParams.get("status") === "pending"
									}
								>
									Pending
								</option>
								<option
									value="ongoing"
									selected={
										searchParams.get("status") === "ongoing"
									}
								>
									Ongoing
								</option>
								<option
									value="completed"
									selected={
										searchParams.get("status") ===
										"completed"
									}
								>
									Completed
								</option>
								<option
									value="overdue"
									selected={
										searchParams.get("status") === "overdue"
									}
								>
									Overdue
								</option>
							</select>
							<select
								onChange={(e) =>
									handleParamsChange(
										"priority",
										e.target.value
									)
								}
							>
								<option
									value=""
									selected={!searchParams.get("priority")}
								>
									Priority (All)
								</option>
								<option
									value="high"
									selected={
										searchParams.get("priority") === "high"
									}
								>
									High
								</option>
								<option
									value="medium"
									selected={
										searchParams.get("priority") ===
										"medium"
									}
								>
									Medium
								</option>
								<option
									value="low"
									selected={
										searchParams.get("priority") === "low"
									}
								>
									Low
								</option>
							</select>
							<input
								className={styles.filterDueDate}
								type="date"
								value={searchParams.get("dueDate") || ""}
								onChange={(e) =>
									handleParamsChange(
										"dueDate",
										e.target.value
									)
								}
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
										userId: userId,
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
						{tasks?.length === 0 && (
							<h1 style={{ textAlign: "center" }}>
								No Tasks Found
							</h1>
						)}
						{tasks?.map((item) => (
							<div key={item.id} className={styles.listItem}>
								<div className={styles.textBox}>
									<h2>{item.title}</h2>
									<p>{item.description}</p>
								</div>
								<div className={styles.actionsBox}>
									<div className={styles.props}>
										<div className={styles.status}>
											<label>Status</label>
											<select
												onChange={(e) => {
													e.preventDefault();
													item.status =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											>
												<option
													value="pending"
													selected={
														item.status ===
														"pending"
													}
												>
													Pending
												</option>
												<option
													value="ongoing"
													selected={
														item.status ===
														"ongoing"
													}
												>
													Ongoing
												</option>
												<option
													value="completed"
													selected={
														item.status ===
														"completed"
													}
												>
													Completed
												</option>
												<option
													value="overdue"
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
											<select
												onChange={(e) => {
													e.preventDefault();
													item.priority =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											>
												<option
													value="high"
													selected={
														item.priority === "high"
													}
												>
													High
												</option>
												<option
													value="medium"
													selected={
														item.priority ===
														"medium"
													}
												>
													Medium
												</option>
												<option
													value="low"
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
												value={
													new Date(item.dueDate)
														.toISOString()
														.split("T")[0]
												}
												onChange={(e) => {
													e.preventDefault();
													item.dueDate =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											/>
										</div>
									</div>
									<div className={styles.actions}>
										<FontAwesomeIcon
											icon={faPenToSquare}
											className={styles.editIcon}
											onClick={() => {
												handleEditTaskData(item);
												setEditTaskId(item.id);
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
								{deleteTaskId === item.id && (
									<ReactModal
										isOpen={deleteTaskId === item.id}
										onRequestClose={() => {
											setDeleteTaskId(() => null);
										}}
										style={{
											overlay: {
												backgroundColor:
													"rgba(255, 255, 255, 0.8)",
											},
											content: {
												top: "50%",
												left: "50%",
												right: "auto",
												bottom: "auto",
												marginRight: "-50%",
												transform:
													"translate(-50%, -50%)",
												width: "400px",
												height: "120px",
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												borderWidth: "1px",
												borderColor: "#000",
												borderStyle: "solid",
												borderRadius: "10px",
											},
										}}
										appElement={document.getElementById(
											"root"
										)}
									>
										<div
											className={modalStyles.modalWrapper}
										>
											<div
												className={
													modalStyles.modalText
												}
											>
												Are you sure you want to Delete?
											</div>
											<div
												className={
													modalStyles.modalButton
												}
											>
												<div
													className={
														modalStyles.confirmDelBtn
													}
													onClick={() => {
														handleDeleteTask(
															item.id
														);
														setDeleteTaskId(
															() => null
														);
													}}
												>
													Delete
												</div>
												<div
													className={
														modalStyles.cancelBtn2
													}
													onClick={() => {
														setDeleteTaskId(
															() => null
														);
													}}
												>
													Cancel
												</div>
											</div>
										</div>
									</ReactModal>
								)}
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
				appElement={document.getElementById("root")}
			>
				<div className={modalStyles.wrapper}>
					{editTaskModal ? <h1>Edit Task</h1> : <h1>Create Task</h1>}
					<form
						className={modalStyles.form}
						onSubmit={(e) =>
							editTaskModal
								? handleEditTask(e)
								: handleCreateTask(e)
						}
					>
						<div className={modalStyles.formItem}>
							<label>
								Task
								<span className={modalStyles.required}> *</span>
							</label>
							<input
								type="text"
								placeholder="Project Presentation"
								name="title"
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
										// selected={taskData.status === "pending"}
									>
										Pending
									</option>
									<option
										value="ongoing"
										// selected={taskData.status === "ongoing"}
									>
										Ongoing
									</option>
									<option
										value="completed"
										// selected={
										// 	taskData.status === "completed"
										// }
									>
										Completed
									</option>
									<option
										value="overdue"
										// selected={taskData.status === "overdue"}
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
										// selected={taskData.priority === "high"}
									>
										High
									</option>
									<option
										value="medium"
										// selected={
										// 	taskData.priority === "medium"
										// }
									>
										Medium
									</option>
									<option
										value="low"
										// selected={taskData.priority === "low"}
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
							{loading2 ? (
								<button
									className={modalStyles.createBtn}
									type="submit"
									disabled
								>
									{editTaskModal ? (
										<>
											Editing Task <Loader2 />
										</>
									) : (
										<>
											Creating Task <Loader2 />
										</>
									)}
								</button>
							) : (
								<button
									className={modalStyles.createBtn}
									type="submit"
								>
									{editTaskModal
										? "Edit Task"
										: "Create Task"}
								</button>
							)}
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
