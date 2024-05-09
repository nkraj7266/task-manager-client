import { useState } from "react";
import axios from "axios";
import styles from "./Login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

const Login = () => {
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		try {
			const response = axios.post(
				"http://localhost:5000/api/auth/login",
				formData
			);
			alert("Login Successful");
			console.log(response.data);
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
						<a href="/register">Register Here</a>
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
