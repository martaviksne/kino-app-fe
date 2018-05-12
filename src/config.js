const config = {
  server: (process.env.NODE_ENV === 'production' ? 'https://kino.linnuu.com' : 'http://localhost:9000'),
  monthNames: [
    "Janvāris", "Februāris", "Marts",
    "Aprīlis", "Maijs", "Jūnijs", "Jūlijs",
    "Augusts", "Septembris", "Oktobris",
    "Novembris", "Decembris"
  ]
}

module.exports = config;
