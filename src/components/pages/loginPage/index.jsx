import LoginForm from "../../organisms/loginForm";

const LoginPage = () => {

  return (
    <section className="mx-auto border rounded-md p-4 border-neutral-300 bg-white" style={{width: "min(500px, 90%)"}}>
      
      <article className="flex justify-center items-center flex-col gap-3">
        <h2>تسجيل الدخول</h2>
      </article>
      <article>
        <LoginForm />
      </article>
      
    </section>
  );
};

export default LoginPage;
