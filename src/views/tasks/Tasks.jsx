import styles from "./Tasks.module.css";
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

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import Loader from "../../components/loader/Loader";
import DeleteTaskModal from "../../components/modal/DeleteTaskModal";
import CreateTaskModal from "../../components/modal/CreateTaskModal";

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
	const [searchTerms, setSearchTerms] = useState("");
	const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

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
			if (debouncedSearchTerm.trim())
				filters.push(
					`search=${encodeURIComponent(debouncedSearchTerm.trim())}`
				);

			if (filters.length > 0) {
				queryString += "?" + filters.join("&");
			}

			const response = await axios.get(queryString);
			setTasks(response.data);
		} catch (error) {
			console.log(error);
			setTasks([]);
		}
	};

	// Update debounced search term after delay
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchTerm(searchTerms);
		}, 500); // debounce delay

		return () => clearTimeout(handler);
	}, [searchTerms]);

	useEffect(() => {
		gettasks();
	}, [debouncedSearchTerm, searchParams]);

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
						<input
							type="text"
							placeholder="Search"
							value={searchTerms}
							onChange={(e) => {
								setSearchTerms(e.target.value);
							}}
						/>
					</div>
					<div className={styles.filtersBox}>
						<div className={styles.filters}>
							<h3>Filters :</h3>
							<select
								defaultValue={searchParams.get("status") || ""}
								onChange={(e) =>
									handleParamsChange("status", e.target.value)
								}
							>
								<option value="">Status (All)</option>
								<option value="pending">Pending</option>
								<option value="ongoing">Ongoing</option>
								<option value="completed">Completed</option>
								<option value="overdue">Overdue</option>
							</select>
							<select
								defaultValue={
									searchParams.get("priority") || ""
								}
								onChange={(e) =>
									handleParamsChange(
										"priority",
										e.target.value
									)
								}
							>
								<option value="">Priority (All)</option>
								<option value="high">High</option>
								<option value="medium">Medium</option>
								<option value="low">Low</option>
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
												defaultValue={
													item.status || "pending"
												}
												onChange={(e) => {
													e.preventDefault();
													item.status =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											>
												<option value="pending">
													Pending
												</option>
												<option value="ongoing">
													Ongoing
												</option>
												<option value="completed">
													Completed
												</option>
												<option value="overdue">
													Overdue
												</option>
											</select>
										</div>
										<div className={styles.priority}>
											<label>Priority</label>
											<select
												defaultValue={
													item.priority || "low"
												}
												onChange={(e) => {
													e.preventDefault();
													item.priority =
														e.target.value;
													handleEditTaskDetail(item);
												}}
											>
												<option value="high">
													High
												</option>
												<option value="medium">
													Medium
												</option>
												<option value="low">Low</option>
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
									<DeleteTaskModal
										deleteTaskId={deleteTaskId}
										setDeleteTaskId={setDeleteTaskId}
										item={item}
										handleDeleteTask={handleDeleteTask}
									/>
								)}
							</div>
						))}
					</ul>
				</div>
			</section>
			<CreateTaskModal
				createTaskModal={createTaskModal}
				setCreateTaskModal={setCreateTaskModal}
				taskData={taskData}
				handleTaskDataChange={handleTaskDataChange}
				handleCreateTask={handleCreateTask}
				loading2={loading2}
				editTaskModal={editTaskModal}
				setEditTaskModal={setEditTaskModal}
				handleEditTask={handleEditTask}
			/>
		</>
	);
};

export default Tasks;
