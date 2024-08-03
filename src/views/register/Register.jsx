import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../login/Login.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/slices/userSlice";

import Loader from "../../components/loader/Loader";
import Loader2 from "../../components/loader/Loader2";

const Register = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);
	const [loading2, setLoading2] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
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
				`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
				formData
			);
			dispatch(login(response.data.user));
			localStorage.setItem("jwt_token", response.data.token);
		} catch (error) {
			console.log(error);
		} finally {
			setFormData({
				name: "",
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
				<h3>Sign Up</h3>
				<form onSubmit={handleSubmit}>
					<div className={styles.inputBox}>
						<label>Name</label>
						<input
							type="text"
							name="name"
							value={formData.name}
							onChange={handleInputChange}
							placeholder="John Doe"
							required
						/>
					</div>
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
						Already have an account?{" "}
						<Link to="/login">Login Here</Link>
					</p>
					{loading2 ? (
						<button
							className={styles.loginBtn}
							type="submit"
							disabled
						>
							Signing Up <Loader2 />
						</button>
					) : (
						<button className={styles.loginBtn} type="submit">
							Sign Up
						</button>
					)}
				</form>
			</div>
		</section>
	);
};

export default Register;
