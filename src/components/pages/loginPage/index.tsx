import { ShieldCheck } from "lucide-react";
import LoginForm from "../../organisms/loginForm";

const LoginPage = () => {
  return (
    <section
      className="mt-10 mx-auto border rounded-md p-4 border-neutral-300 bg-white"
      style={{ width: "min(500px, 90%)" }}
    >
      <article className="flex justify-center items-center flex-col gap-3">
        <ShieldCheck className="text-[#004AC6]" size={80} strokeWidth={1.5} />
        <h2 className="text-2xl font-semibold text-[#004AC6]">تسجيل الدخول</h2>
      </article>
      <article>
        <LoginForm />
      </article>
    </section>
  );
};

export default LoginPage;
