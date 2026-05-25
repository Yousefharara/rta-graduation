const Footer = () => {
  return (
    <section className="flex flex-col gap-12 bg-[#213145] text-[#B5C6FF] p-8">
      <article
        className="grid gap-4 place-items-center"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))" }}
      >
        <div className="flex flex-col gap-4">
          <h3 className="text-3xl font-semibold">Relife Track Aid</h3>
          <p className="text-sm">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ut
            voluptate ratione blanditiis beatae corporis quae voluptatibus
            aliquid doloribus dolorum ipsa?
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <h3 className="text-white text-2xl font-medium">روابط سريعة</h3>

          <ul className="flex flex-col gap-3">
            <li>كيفيه التبرع</li>
            <li>تقارير الشفافيه</li>
            <li>الأسئله الشائعه</li>
            <li>سياسه الخصوصيه</li>
          </ul>
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-white text-2xl font-medium">تواصل معنا</h4>
          <div>
            {/* <Mail /> */}
            <p>info@rta-relife.org</p>
          </div>
          <div>
            {/* <PhoneCall /> */}
            <p dir="ltr">+970 59 000 0000</p>
          </div>
          <div>
            <div></div>
            <div>{/* <Globe2 /> */}</div>
          </div>
        </div>
      </article>
      <div className="w-full h-0.5 bg-gray-700"></div>
      <article className="text-center w-full">
        <p>
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Illo,
          cumque.
        </p>
      </article>
    </section>
  );
};

export default Footer;
