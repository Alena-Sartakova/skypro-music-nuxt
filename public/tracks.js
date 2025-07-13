const tracks = [
  {
    id: 1,
    title: "Guilt",
    artist: "Nero",
    album: "Welcome Reality",
    duration: "4:44",
    genre: "Electronic",
    year: 2012
  },
  {
    id: 2,
    title: "Elektro",
    artist: "Dynoro, Outwork, Mr. Gee",
    album: "Elektro",
    duration: "2:22",
    genre: "Dance",
    year: 2019
  },
  {
    id: 3,
    title: "I'm Fire",
    artist: "Ali Bakgor",
    album: "I'm Fire",
    duration: "2:22",
    genre: "Pop",
    year: 2020
  },
  {
    id: 4,
    title: "Non Stop (Remix)",
    artist: "Стоункат, Psychopath",
    album: "Non Stop",
    duration: "4:12",
    genre: "Hip-Hop",
    year: 2021
  },
  {
    id: 5,
    title: "Run Run (feat. AR/CO)",
    artist: "Jaded, Will Clarke, AR/CO",
    album: "Run Run",
    duration: "2:54",
    genre: "EDM",
    year: 2022
  },
  {
    id: 6,
    title: "Eyes on Fire (Zeds Dead Remix)",
    artist: "Blue Foundation, Zeds Dead",
    album: "Eyes on Fire",
    duration: "5:20",
    genre: "Dubstep",
    year: 2018
  }
];

// Имитация асинхронного запроса
export const getTracks = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(tracks);
    }, 500); // Имитация задержки запроса
  });
};