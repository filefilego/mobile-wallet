import BN  from "bn.js";
import numberToBN from "number-to-bn";
const negative1 = new BN(-1);
const zero = new BN(0);

const unitMap = {
  FFGZero: "0",
  FFGOne: "1",
  KFFG: "1000",
  MFFG: "1000000",
  GFFG: "1000000000",
  MicroFFG: "1000000000000",
  MiliFFG: "1000000000000000",
  FFG: "1000000000000000000",
  ZFFG: "1000000000000000000000",
};

function getValueOfUnit(unitInput) {
  const unit = unitInput ? unitInput : "FFG";
  var unitValue = unitMap[unit]; // eslint-disable-line

  if (typeof unitValue !== "string") {
    throw new Error(
      `the unit provided ${unitInput} doesn't exists, please use the one of the following units ${JSON.stringify(
        unitMap,
        null,
        2
      )}`
    );
  }

  return new BN(unitValue, 10);
}

function numberToString(arg) {
  if (typeof arg === "string") {
    if (!arg.match(/^-?[0-9.]+$/)) {
      throw new Error(
        `while converting number to string, invalid number value '${arg}'`
      );
    }
    return arg;
  } else if (typeof arg === "number") {
    return String(arg);
  } else if (
    typeof arg === "object" &&
    arg.toString &&
    (arg.toTwos || arg.dividedToIntegerBy)
  ) {
    if (arg.toPrecision) {
      return String(arg.toPrecision());
    } else {
      return arg.toString(10);
    }
  }
  throw new Error(
    `while converting number to string, invalid number value '${arg}' type ${typeof arg}.`
  );
}

function fromFFGOne(ffgOneInput, unit, optionsInput) {
  var ffgOne = numberToBN(ffgOneInput);
  var negative = ffgOne.lt(zero);
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;
  const options = optionsInput || {};

  if (negative) {
    ffgOne = ffgOne.mul(negative1);
  }

  var fraction = ffgOne.mod(base).toString(10);

  while (fraction.length < baseLength) {
    fraction = `0${fraction}`;
  }

  if (!options.pad) {
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];
  }

  var whole = ffgOne.div(base).toString(10);

  if (options.commify) {
    whole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  var value = `${whole}${fraction == "0" ? "" : `.${fraction}`}`;

  if (negative) {
    value = `-${value}`;
  }

  return value;
}

function toFFGOne(ffgInput, unit) {
  var ffg = numberToString(ffgInput); // eslint-disable-line
  const base = getValueOfUnit(unit);
  const baseLength = unitMap[unit].length - 1 || 1;

  // Is it negative?
  var negative = ffg.substring(0, 1) === "-"; // eslint-disable-line
  if (negative) {
    ffg = ffg.substring(1);
  }

  if (ffg === ".") {
    throw new Error(
      `while converting number ${ffgInput} to ffgOne, invalid value`
    );
  }

  // Split it into a whole and fractional part
  var comps = ffg.split("."); // eslint-disable-line
  if (comps.length > 2) {
    throw new Error(
      `while converting number ${ffgInput} to ffgOne,  too many decimal points`
    );
  }

  var whole = comps[0],
    fraction = comps[1]; // eslint-disable-line

  if (!whole) {
    whole = "0";
  }
  if (!fraction) {
    fraction = "0";
  }
  if (fraction.length > baseLength) {
    throw new Error(
      `while converting number ${ffgInput} to ffgOne, too many decimal places`
    );
  }

  while (fraction.length < baseLength) {
    fraction += "0";
  }

  whole = new BN(whole);
  fraction = new BN(fraction);
  let ffgOne = whole.mul(base).add(fraction); // eslint-disable-line

  if (negative) {
    ffgOne = ffgOne.mul(negative1);
  }

  return new BN(ffgOne.toString(10), 10);
}

export default {
  fromFFGOne,
  toFFGOne,
};
