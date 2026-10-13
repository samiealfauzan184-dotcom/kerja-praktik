export type BrandList = {
  image: string;
  lightimg: string;
  name: string;
};

type BrandSliderProps = {
  brandList: BrandList[];
};

export default function BrandSlider({ brandList }: BrandSliderProps) {
  // Duplikasi list supaya marquee berputar mulus
  const items = [...brandList, ...brandList];

  return (
    <section className="border-y bg-muted/30 py-10">
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Brands we've worked with
      </p>
      <div className="relative mx-auto max-w-5xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee items-center gap-16">
          {items.map((brand, i) => (
            <div key={i} className="flex h-8 shrink-0 items-center">
              <img
                src={brand.image}
                alt={brand.name}
                className="hidden h-6 w-auto dark:block"
              />
              <img
                src={brand.lightimg}
                alt={brand.name}
                className="block h-6 w-auto dark:hidden"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
