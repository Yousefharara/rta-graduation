import stepImg from "@/assets/home/home2.png";

const StepHome = () => {
  return (
    <section className="flex flex-col justify-between gap-8 md:flex-row">
      <article className="overflow-hidden w-full h-full relative">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={stepImg}
          alt="stepImg"
        />
        <div className="absolute bg-white rounded-[100px] left-1/2 top-1/2 -translate-1/2 p-2 items-center flex flex-row-reverse gap-2">
          <p style={{ fontSize: "clamp(8px, 3vw, 15px)" }}>
            جاري تسليم 200 طرد في منطقة الرمال...
          </p>
          <svg
            width="16"
            height="20"
            viewBox="0 0 16 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z"
              fill="#006C49"
            />
          </svg>
        </div>
      </article>
      <article className="flex flex-col gap-4">
        <h3
          className="font-semibold"
          style={{ fontSize: "clamp(22px, 5vw, 28px)" }}
        >
          شفافية مطلقة في كل خطوة
        </h3>

        <p>
          نؤمن أن الثقة هي أساس العمل الإنساني. لهذا نوفر لوحة تحكم عامة تعرض
          إحصائيات مباشرة لعمليات التوزيع، والخرائط الحرارية للاحتياجات،لضمان
          أعلى معايير المساءلة والنزاهة.
        </p>

        <section className="flex flex-col items-end gap-4">
          <div className="flex items-center gap-2">
            <p>تقارير يومية مفصلة</p>
            <div className="bg-[#006C49]/10 p-3 flex justify-center items-center rounded-[100px] w-fit">
              <svg
                width="16"
                height="20"
                viewBox="0 0 16 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 16H12V14H4V16ZM4 12H12V10H4V12ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H10L16 6V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H2ZM9 7V2H2V18H14V7H9ZM2 2V7V2V7V18V2Z"
                  fill="#006C49"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <p>بيانات مدققة من جهات خارجية</p>
            <div className="bg-[#006C49]/10 p-3 flex justify-center items-center rounded-[100px] w-fit">
              <svg
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM8.45 18.45L11 17.35L13.6 18.45L15 16.05L17.75 15.4L17.5 12.6L19.35 10.5L17.5 8.35L17.75 5.55L15 4.95L13.55 2.55L11 3.65L8.4 2.55L7 4.95L4.25 5.55L4.5 8.35L2.65 10.5L4.5 12.6L4.25 15.45L7 16.05L8.45 18.45ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z"
                  fill="#006C49"
                />
              </svg>
            </div>
          </div>
        </section>
      </article>
    </section>
  );
};

export default StepHome;
