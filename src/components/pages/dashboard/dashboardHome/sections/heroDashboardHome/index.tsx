import { HeartHandshake, LayoutPanelTop, UsersRound } from "lucide-react";

const HeroDashboardHome = () => {
    return (
        <section className="flex flex-col gap-8">
            <article className="flex justify-between flex-wrap gap-6">
                <h1 className="text-primary-foreground font-semibold" style={{fontSize: "clamp(22px, 5vw, 32px"}}>لوحة التحكم</h1>
            <button className="bg-primary-foreground rounded-lg px-6 py-4 flex items-center gap-2 text-white font-semibold cursor-pointer text-sm"><svg width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17 19V16H14V14H17V11H19V14H22V16H19V19H17ZM1 16V10H0V8L1 3H16L17 8V10H16V13H14V10H10V16H1ZM3 14H8V10H3V14ZM1 2V0H16V2H1ZM2.05 8H14.95L14.35 5H2.65L2.05 8Z" fill="white" />
            </svg>
            إضافة منظمة
            </button>
            </article>

            <article className="grid gap-6" style={{gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr)"}}>


                <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
                    <div className="px-4 py-3 rounded-lg bg-primary/20">
                        <UsersRound />
                    </div>
                    <div>
                        <small className="font-medium">إجمالي المستفيدين</small>
                        <p className="text-3xl font-semibold text-primary-foreground">1,284,500</p>
                    </div>
                </section>

                <section className="rounded-lg px-6 py-4 border border-zinc-300 bg-white flex items-center gap-3">
                    <div className="px-4 py-3 rounded-lg bg-primary/20">
                        <HeartHandshake />
                    </div>
                    <div>
                        <small className="font-medium">إجمالي المساعدات الموزعة</small>
                        <p className="text-3xl font-semibold text-primary-foreground">$42.8M</p>
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
