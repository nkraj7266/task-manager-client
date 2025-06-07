import ReactModal from "react-modal";
import modalStyles from "./Modal.module.css";
import PropTypes from "prop-types";

const DeleteTaskModal = ({
	deleteTaskId,
	setDeleteTaskId,
	item,
	handleDeleteTask,
}) => {
	return (
		<>
			<ReactModal
				isOpen={deleteTaskId === item.id}
				onRequestClose={() => {
					setDeleteTaskId(() => null);
				}}
				style={{
					overlay: {
						backgroundColor: "rgba(255, 255, 255, 0.8)",
					},
					content: {
						top: "50%",
						left: "50%",
						right: "auto",
						bottom: "auto",
						marginRight: "-50%",
						transform: "translate(-50%, -50%)",
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
				appElement={document.getElementById("root")}
			>
				<div className={modalStyles.modalWrapper}>
					<div className={modalStyles.modalText}>
						Are you sure you want to Delete?
					</div>
					<div className={modalStyles.modalButton}>
						<div
							className={modalStyles.confirmDelBtn}
							onClick={() => {
								handleDeleteTask(item.id);
								setDeleteTaskId(() => null);
							}}
						>
							Delete
						</div>
						<div
							className={modalStyles.cancelBtn2}
							onClick={() => {
								setDeleteTaskId(() => null);
							}}
						>
							Cancel
						</div>
					</div>
				</div>
			</ReactModal>
		</>
	);
};

DeleteTaskModal.propTypes = {
	deleteTaskId: PropTypes.number,
	setDeleteTaskId: PropTypes.func.isRequired,
	item: PropTypes.object.isRequired,
	handleDeleteTask: PropTypes.func.isRequired,
};

export default DeleteTaskModal;
