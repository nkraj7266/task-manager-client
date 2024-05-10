import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const Login = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	if (user) {
		if (user.role === "user") {
			navigate(`/tasks?userId=${user.id}`);
		}
	}

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
				formData
			);
			setUser(response.data.user);
			localStorage.setItem("jwt_token", response.data.token);
			alert("Login Successful");
		} catch (error) {
			console.log(error);
		} finally {
			setFormData({
				email: "",
				password: "",
			});
		}
	};

	return (
		<section className={styles.login}>
			<div className={styles.heading}>
				<h1>Welcome !!!</h1>
				<p>to your own</p>
				<h2>Task Manager</h2>
			</div>
			<div className={styles.loginBox}>
				<h3>Login</h3>
				<form onSubmit={handleSubmit}>
					<div className={styles.inputBox}>
						<label>Email</label>
						<input
							type="email"
							name="email"
							value={formData.email}
							onChange={handleInputChange}
							placeholder="user@email.com"
							required
						/>
					</div>
					<div
						className={
							styles.inputBox + " " + styles.passwordInputBox
						}
					>
						<label>Password</label>
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							value={formData.password}
							onChange={handleInputChange}
							placeholder="password"
							required
						/>
						<FontAwesomeIcon
							className={styles.eyeIcon}
							icon={showPassword ? faEye : faEyeSlash}
							onClick={() => setShowPassword(!showPassword)}
						/>
					</div>
					<p className={styles.desc}>
						Don{"'"}t have an account?{" "}
						<Link to="/register">Register Here</Link>
					</p>
					<button className={styles.loginBtn} type="submit">
						Login
					</button>
				</form>
			</div>
		</section>
	);
};

export default Login;
