const config = {
  server: (process.env.NODE_ENV === 'production' ? 'http://192.168.134.195:9000' : 'http://localhost:9000'),
  monthNames: [
    "Janvāris", "Februāris", "Marts",
    "Aprīlis", "Maijs", "Jūnijs", "Jūlijs",
    "Augusts", "Septembris", "Oktobris",
    "Novembris", "Decembris"
  ]
}

module.exports = config;
