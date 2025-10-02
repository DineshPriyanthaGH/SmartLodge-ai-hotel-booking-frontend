const hotels = [
  {
    _id: "1",
    name: "Montmartre Majesty Hotel",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/297840629.jpg?k=d20e005d5404a7bea91cb5fe624842f72b27867139c5d65700ab7f69396026ce&o=&hp=1",
    location: "Paris, France",
    rating: 4.7,
    reviews: ["K", "L"],
    price: 160,
  },
  {
    _id: "2",
    name: "Loire Luxury Lodge",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/596257607.jpg?k=0b513d8fca0734c02a83d558cbad7f792ef3ac900fd42c7d783f31ab94b4062c&o=&hp=1",
    location: "Sydney, Australia",
    rating: 4.7,
    reviews: ["K", "L"],
    price: 200,
  },
  {
    _id: "3",
    name: "Tokyo Tower Inn",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/308797093.jpg?k=3a35a30f15d40ced28afacf4b6ae81ea597a43c90c274194a08738f6e760b596&o=&hp=1",
    location: "Tokyo, Japan",
    rating: 4.4,
    reviews: ["K", "L"],
    price: 250,
  },
  {
    _id: "4",
    name: "Sydney Harbor Hotel",
    image:
      "https://cf.bstatic.com/xdata/images/hotel/max1280x900/84555265.jpg?k=ce7c3c699dc591b8fbac1a329b5f57247cfa4d13f809c718069f948a4df78b54&o=&hp=1",
    location: "Sydney, Australia",
    rating: 4.8,
    reviews: ["K", "L"],
    price: 300,
  },
];

const locations = [
  { _id: 0, name: "ALL" },
  { _id: 1, name: "France" },
  { _id: 2, name: "Australia" },
  { _id: 3, name: "Japan" },
];

export { hotels, locations };