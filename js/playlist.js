// an array of five songs
const songs = [
  { title: 'Bizarre Love Triangle', artist: 'Frente!' },
  { title: 'Bizarre Love Triangle (Acoustic Remix)', artist: 'Frente!' },
  { title: 'Accidently Kelly Street', artist: 'Frente!' },
  { title: 'Ordinary Angels', artist: 'Frente!' },
  { title: 'Labour of Love', artist: 'Frente!' }
];

const list = document.getElementById('playlist');

// a for...of loop that creates an <li> for each song and appends it
for (const song of songs) {
  const li = document.createElement('li');
  li.textContent = song.title + ' — ' + song.artist;

  // an if inside the loop that marks any song whose title contains "Remix"
  if (song.title.includes('Remix')) {
    li.classList.add('remix');
    li.textContent += ' 🔥';
  }

  list.appendChild(li);
}
