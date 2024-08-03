import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Login.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/userSlice";

import Loader from "../../components/loader/Loader";
import Loader2 from "../../components/loader/Loader2";

const Login = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);
	const [loading2, setLoading2] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});

	const user = useSelector((state) => state.user.user);

	useEffect(() => {
		if (user) {
			if (user.role === "user") {
				navigate(`/tasks`);
			} else {
				setLoading(false);
			}
		} else {
			setLoading(false);
		}
	}, [user, navigate]);

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			setLoading2(true);
			const response = await axios.post(
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
				formData
			);
			dispatch(login(response.data.user));
			localStorage.setItem("jwt_token", response.data.jwt_token);
		} catch (error) {
			console.log(error);
		} finally {
			setFormData({
				email: "",
				password: "",
			});
			setLoading2(false);
		}
	};

	if (loading) {
		return <Loader />;
	}

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
					{loading2 ? (
						<button
							className={styles.loginBtn}
							type="submit"
							disabled
						>
							Logging In <Loader2 />
						</button>
					) : (
						<button className={styles.loginBtn} type="submit">
							Login
						</button>
					)}
				</form>
			</div>
		</section>
	);
};

export default Login;
