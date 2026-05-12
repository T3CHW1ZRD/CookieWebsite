import type { SiteContent } from "../types";

// Resolves a public-folder path under the configured Vite base. Lets us
// reference assets without hardcoding the base path.
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export const seedContent: SiteContent = {
  shop: {
    brandName: "Lailah's Cookies",
    tagline: "made fresh to order, with love.",
    heroHeadline: "Gluten-free cookies worth craving.",
    heroSubcopy:
      "Almond-flour based, hand-baked in small batches with real ingredients. Indulgent, comforting, and made for everyone — gluten-free or not.",
    aboutBody:
      "Hi, I'm Lailah. At the end of 2022, I found out I have celiac disease — and suddenly baking (and eating!) looked very different. Going fully gluten-free was a learning curve, especially with desserts that actually tasted good and didn't feel like a compromise. So I started baking. For myself at first, then for the people around me. And somewhere along the way, it turned into this. Lailah's Cookies was created with one simple intention: to make gluten-free cookies that feel indulgent, comforting, and worth craving. Every cookie is made with almond flour, real ingredients, and a whole lot of care.",
    address: "Made-to-order from a gluten-free home kitchen",
    hours: "48–72 hours notice recommended",
    phone: "",
    email: "",
    orderUrl: "https://www.instagram.com/lailahscookies",
    noticeWindow: "48–72 hours notice recommended",
    fulfillment: "Local pickup · Delivery available (additional fee)",
    allergens:
      "Almond-flour based · Contains nuts, dairy & eggs · Baked in a gluten-free home kitchen",
    socials: {
      instagram: "https://www.instagram.com/lailahscookies",
      tiktok: "",
      facebook: "",
      twitter: "",
    },
  },
  pricing: [
    { id: "p1", label: "Box of 4", size: "4 cookies", price: "$20" },
    { id: "p2", label: "Half-dozen", size: "6 cookies", price: "$30" },
    { id: "p3", label: "Dozen", size: "12 cookies", price: "$60" },
  ],
  menu: [
    {
      id: "m1",
      name: "Classic Chocolate Chip",
      description: "The OG. Golden edges, melty chocolate, soft almond-flour crumb.",
      image: asset("gallery/cookies-classic-plate.jpg"),
      tag: "Classic",
    },
    {
      id: "m2",
      name: "White Chocolate Macadamia",
      description: "Buttery macadamias, creamy white chocolate, a hint of sea salt.",
      image: asset("gallery/cookies-chip-plate.jpg"),
    },
    {
      id: "m3",
      name: "Caramel Crunch Shortbread",
      description: "Crumbly shortbread base with pockets of caramel and crunchy bits.",
      image: asset("gallery/cookies-tray.jpg"),
    },
    {
      id: "m4",
      name: "Salted Sticky Date",
      description: "Caramelly date, brown butter, finishing flake of sea salt.",
      image: asset("gallery/cookies-box-mixed.jpg"),
    },
    {
      id: "m5",
      name: "Stuffed Pistachio",
      description: "Pistachio cream center, toasted nuts, soft chewy crumb.",
      image: asset("gallery/cookies-stuffed.jpg"),
      tag: "Stuffed",
    },
    {
      id: "m6",
      name: "Stuffed Strawberry Cheesecake",
      description: "Strawberry-cheesecake middle, golden cookie shell, ridiculously good.",
      image: asset("gallery/cookies-gift-box.jpg"),
      tag: "Stuffed",
    },
  ],
  gallery: [
    { id: "g1", src: asset("gallery/cookies-box-mixed.jpg"), caption: "A mixed box, ready to go" },
    { id: "g2", src: asset("gallery/cookies-gift-box.jpg"), caption: "Gift-boxed and ribboned" },
    { id: "g3", src: asset("gallery/cookies-stuffed.jpg"), caption: "Stuffed and gooey" },
    { id: "g4", src: asset("gallery/cookies-classic-plate.jpg"), caption: "Classic chocolate chip" },
    { id: "g5", src: asset("gallery/cookies-chip-plate.jpg"), caption: "Fresh off the plate" },
    { id: "g6", src: asset("gallery/cookies-tray.jpg"), caption: "Straight from the oven" },
  ],
  reviews: [],
};
