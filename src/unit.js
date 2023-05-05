import BigNumber from 'bignumber.js';

var Units = {}

var rawUnits =  {
    ffgzero: "0",
    ffgone: "1",
    kffg: "1000",
    mffg: "1000000",
    gffg: "1000000000",
    microffg: "1000000000000",
    miliffg: "1000000000000000",
    ffg: "1000000000000000000",
    zffg: "1000000000000000000000",
  };

var units = {}

Object.keys(rawUnits).map(function (unit) {
  unit = unit.toLowerCase()
  units[unit] = new BigNumber(rawUnits[unit], 10)
})

Units.units = rawUnits

var re = RegExp(/^[0-9]+\.?[0-9]*$/)

Units.convert = function (value, from, to) {
  if (!re.test(value)) {
    throw new Error('Unsupported value')
  }

  from = from.toLowerCase()
  if (!units[from]) {
    throw new Error('Unsupported input unit')
  }

  to = to.toLowerCase()
  if (!units[to]) {
    throw new Error('Unsupported output unit')
  }

  return new BigNumber(value, 10).mul(units[from]).round(0, BigNumber.ROUND_DOWN).div(units[to]).toString(10)
}

Units.lazyConvert = function (value, to) {
  var tmp = value.split(' ')
  if (tmp.length !== 2) {
    throw new Error('Invalid input')
  }
  return Units.convert(tmp[0], tmp[1], to) + ' ' + to
}

export {
    Units
}