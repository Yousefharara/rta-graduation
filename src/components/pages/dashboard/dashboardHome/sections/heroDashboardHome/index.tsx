import { HeartHandshake, LayoutPanelTop, UsersRound } from "lucide-react";

const HeroDashboardHome = () => {
    return (
        <section className="flex flex-col gap-8">
            <article className="flex justify-between flex-wrap gap-6">
                <h1 className="text-primary-foreground font-semibold" style={{fontSize: "clamp(22px, 5vw, 32px"}}>لوحة التحكم</h1>
            </article>

            <article className="grid gap-6" style={{gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr)"}}>


                <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
                    <div className="px-4 py-3 rounded-lg bg-primary/20">
                        <UsersRound />
                    </div>
                    <div>
                        <small className="font-medium">إجمالي المستفيدين</small>
                        <p className="text-3xl font-semibold text-primary-foreground">500</p>
                    </div>
                </section>

                <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
                    <div className="px-4 py-3 rounded-lg bg-primary/20">
                        <HeartHandshake />
                    </div>
                    <div>
                        <small className="font-medium">إجمالي المساعدات الموزعة</small>
                        <p className="text-3xl font-semibold text-primary-foreground">200</p>
                    </div>
                </section>

                <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
                    <div className="px-4 py-3 rounded-lg bg-primary/20">
                        <LayoutPanelTop />
                    </div>
                    <div>
                        <small className="font-medium">المنظمات المصغرة</small>
                        <p className="text-3xl font-semibold text-primary-foreground">142</p>
                    </div>
                </section>



            </article>


        </section>
    );
}

export default HeroDashboardHome;
