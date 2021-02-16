function Timer(d) {
  var s = d.getSeconds();
  var m = d.getMinutes();
  var h = d.getHours();

  return (
    ("0" + h).substr(-2) +
    ":" +
    ("0" + m).substr(-2) +
    ":" +
    ("0" + s).substr(-2)
  );
}

module.exports = { Timer };
