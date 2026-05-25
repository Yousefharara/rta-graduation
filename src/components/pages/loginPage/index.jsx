import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { login, logout } from "../../../redux/slices/authSlice";

const LoginPage = () => {
  const { role } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogin = () => {
    dispatch(
      login({
        role: "user",
        token: "token",
        user: "yousef",
      }),
    );
  };

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <section>
      <h1>Login page role is : {role}</h1>

      <button onClick={handleLogin}>Login button</button>
      <button onClick={handleLogout}>Logout button</button>
    </section>
  );
};

export default LoginPage;
