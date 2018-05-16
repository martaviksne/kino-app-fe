const config = {
  server: (process.env.NODE_ENV === 'production' ? 'https://kino.linnuu.com' : 'http://localhost:9000'),
  monthNames: [
    "Janvāris", "Februāris", "Marts",
    "Aprīlis", "Maijs", "Jūnijs", "Jūlijs",
    "Augusts", "Septembris", "Oktobris",
    "Novembris", "Decembris"
  ],
  monthNames2: [
    "Janvārī", "Februārī", "Martā",
    "Aprīlī", "Maijā", "Jūnijā", "Jūlijā",
    "Augustā", "Septembrī", "Oktobrī",
    "Novembrī", "Decembrī"
  ]
}

module.exports = config;
