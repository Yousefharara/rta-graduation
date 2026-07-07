import { Link } from "react-router-dom";
import { Frown, Home, ArrowLeft } from "lucide-react";
import Button from "@/components/atoms/button";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4">
      <div className="relative">
        <div className="text-[10rem] font-bold text-primary/10 select-none leading-none">
          404
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Frown size={80} strokeWidth={1} className="text-primary" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-zinc-800">الصفحة غير موجودة</h1>

      <p className="text-zinc-500 text-center max-w-md">
        عذراً، الصفحة التي تبحث عنها غير موجودة أو ربما تم نقلها أو حذفها.
      </p>

      <div className="flex items-center gap-3 mt-2">
        <Link to="/">
          <Button className="flex items-center gap-2">
            <Home size={18} />
            الصفحة الرئيسية
          </Button>
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-zinc-300 text-sm text-zinc-700 hover:bg-zinc-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
          العودة للخلف
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
