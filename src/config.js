const config = {
  server: (process.env.NODE_ENV === 'production' ? 'http://138.197.185.72:5000' : 'http://localhost:9000'),
  monthNames: [
    "Janvāris", "Februāris", "Marts",
    "Aprīlis", "Maijs", "Jūnijs", "Jūlijs",
    "Augusts", "Septembris", "Oktobris",
    "Novembris", "Decembris"
  ]
}

module.exports = config;
