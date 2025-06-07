import ReactModal from "react-modal";
import modalStyles from "./Modal.module.css";
import PropTypes from "prop-types";
import Loader2 from "../loader/Loader2";

const CreateTaskModal = ({
	createTaskModal,
	setCreateTaskModal,
	setEditTaskModal,
	editTaskModal,
	taskData,
	handleTaskDataChange,
	handleEditTask,
	handleCreateTask,
	loading2,
}) => {
	return (
		<>
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
									defaultValue={taskData.status}
									onChange={handleTaskDataChange}
								>
									<option value="pending">Pending</option>
									<option value="ongoing">Ongoing</option>
									<option value="completed">Completed</option>
									<option value="overdue">Overdue</option>
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
									defaultValue={taskData.priority}
									onChange={handleTaskDataChange}
								>
									<option value="high">High</option>
									<option value="medium">Medium</option>
									<option value="low">Low</option>
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

CreateTaskModal.propTypes = {
	createTaskModal: PropTypes.bool.isRequired,
	setCreateTaskModal: PropTypes.func.isRequired,
	setEditTaskModal: PropTypes.func.isRequired,
	editTaskModal: PropTypes.bool.isRequired,
	taskData: PropTypes.object.isRequired,
	handleTaskDataChange: PropTypes.func.isRequired,
	handleEditTask: PropTypes.func.isRequired,
	handleCreateTask: PropTypes.func.isRequired,
	loading2: PropTypes.bool.isRequired,
};

export default CreateTaskModal;
