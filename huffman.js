const HUFFMAN_SIZE = 8; //number of bits in each huffman node's descriptor
const OUTPUT_SIZE = 8; //number of bits in each output chunk
const CODE_ALPHANUMERIC_EXT = Array(
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '_',
  '-'
);

const lt = Array(
  ' ',
  '!',
  '"',
  '#',
  '$',
  '%',
  '&',
  "'",
  '(',
  ')',
  '*',
  '+',
  ',',
  '-',
  '.',
  '/',
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  ':',
  ';',
  '<',
  '=',
  '>',
  '?',
  '@',
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z',
  '[',
  '\\',
  ']',
  '^',
  '_',
  '`',
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'w',
  'x',
  'y',
  'z',
  '{',
  '|',
  '}',
  '~',
  '¡',
  '¢',
  '£',
  '¤',
  '¥',
  '¦',
  '§',
  '¨',
  '©',
  'ª',
  '«',
  '¬',
  '­',
  '®',
  '¯',
  '°',
  '±',
  '²',
  '³',
  '´',
  'µ',
  '¶',
  '·',
  '¸',
  '¹',
  'º',
  '»',
  '¼',
  '½',
  '¾',
  '¿',
  '×',
  '÷'
);

function grabBin() {
  var values = document.getElementById('input').value;
  var clamps = new Array(values.length);
  for (let i = 0; i < clamps.length; i++) {
    clamps[i] = values.charCodeAt(i);
  }
  return clamps;
}
function intToBin(rawint, len) {
  var returnable = '';
  for (let i = 0; i < len; i++) {
    returnable = (rawint & 1) + returnable;
    rawint = rawint >> 1;
  }
  return returnable;
}
function binToInt(rawBin) {
  var returnable = 0;
  for (let i = 0; i < rawBin.length; i++) {
    returnable = returnable << 1;
    if (rawBin.charAt(i) != '0') {
      returnable++;
    }
  }
  return returnable;
}
function stringByteUTF(input) {
  var returnable = new Uint8ClampedArray(input.length * 4);
  var offset = 0;
  for (let i = 0; i < input.length; i++) {
    var newval = input.charCodeAt(i);
    if (newval < 128) {
      returnable[i + offset] = newval;
    } else if (newval < 2048) {
      returnable[i + offset] = 192 + intChop(newval, 5, 6);
      returnable[i + offset + 1] = 128 + intChop(newval, 6, 0);
      offset += 1;
    } else if (newval < 65536) {
      returnable[i + offset] = 224 + intChop(newval, 4, 12);
      returnable[i + offset + 1] = 128 + intChop(newval, 6, 6);
      returnable[i + offset + 2] = 128 + intChop(newval, 6, 0);
      offset += 2;
    } else {
      returnable[i + offset] = 240 + intChop(newval, 3, 18);
      returnable[i + offset + 1] = 128 + intChop(newval, 6, 12);
      returnable[i + offset + 2] = 128 + intChop(newval, 6, 6);
      returnable[i + offset + 3] = 128 + intChop(newval, 6, 0);
      offset += 3;
    }
  }
  return returnable.slice(0, input.length + offset);
}
function byteStringUTF(input) {
  var returnable = '';
  var offset = 0;
  for (let i = 0; i + offset < input.length; i++) {
    var newval = input[i + offset];
    if (newval >= 192) {
      if (newval < 224) {
        newval = ((newval & 31) << 6) + (input[i + offset + 1] & 63);
        offset += 1;
      } else if (newval < 240) {
        newval =
          ((((newval & 15) << 6) + (input[i + offset + 1] & 63)) << 6) +
          (input[i + offset + 2] & 63);
        offset += 2;
      } else {
        newval =
          ((((((newval & 7) << 6) + (input[i + offset + 1] & 63)) << 6) +
            (input[i + offset + 2] & 63)) <<
            6) +
          (input[i + offset + 3] & 63);
        offset += 3;
      }
    }
    returnable += String.fromCharCode(newval);
  }
  return returnable;
}
function intStringUTF(input) {
  if (input < 128) {
    return String.fromCharCode(input & 127);
  } else if (input < 2048) {
    return (
      String.fromCharCode(192 + intChop(input, 5, 6)) +
      String.fromCharCode(128 + intChop(input, 6, 0))
    );
  } else if (input < 65536) {
    return (
      String.fromCharCode(224 + intChop(input, 4, 12)) +
      String.fromCharCode(128 + intChop(input, 6, 6)) +
      String.fromCharCode(128 + intChop(input, 6, 0))
    );
  } else {
    return (
      String.fromCharCode(240 + intChop(input, 3, 18)) +
      String.fromCharCode(128 + intChop(input, 6, 12)) +
      String.fromCharCode(128 + intChop(input, 6, 6)) +
      String.fromCharCode(128 + intChop(input, 6, 0))
    );
  }
}
function intChop(input, keep, cut) {
  return (input >> cut) & ((1 << keep) - 1);
}
function binToCode(binstr, code) {
  var order = Math.log2(code.length);
  if (order <= 1) {
    return makeSpace(binstr.length, 8) + binstr;
  } else if (order <= 8 && 8 % order == 0) {
    binstr = makeSpace(binstr.length, 8) + binstr;
  } else {
    binstr = makeSpace(binstr.length, order) + binstr;
  }
  var returnable = '';
  for (let i = 0; i < binstr.length; i += order) {
    if (code[binToInt(binstr.substring(i, i + order))] === undefined) {
      console.log(order);
      console.log(binstr.substring(i, i + order));
      console.log(binToInt(binstr.substring(i, i + order)));
    }
    returnable += code[binToInt(binstr.substring(i, i + order))];
  }
  return returnable;
}
function codeToBin(codestr, code) {
  var order = Math.log2(code.length);
  if (order <= 1) {
    return removeSpace(codestr);
  }
  var returnable = '';
  var currchar = '0';
  for (let i = 0; i < codestr.length; i++) {
    currchar = codestr.charAt(i);
    for (let j = code.length; j >= 0; j--) {
      if (code[j] == currchar) {
        returnable += intToBin(j, order);
        break;
      }
    }
  }
  return removeSpace(returnable);
}
function buildCode(order) {
  var returnable = Array(order);
  for (let i = 0; i < order; i++) {
    returnable[i] = String.fromCharCode(i);
  }
  return returnable;
}
function parseCode() {
  switch (document.getElementById('codeselect').value) {
    case '7a':
      return ' ';
    default:
      return lt;
  }
}
function makeSpace(strlen, chunkSize) {
  return '0'.repeat(chunkSize - ((strlen % chunkSize) + 1)) + '1';
}
function removeSpace(input) {
  return input.substring(input.indexOf('1') + 1);
}
//Huffman functions
function huffGo() {
  var textbin = grabHuff();
  var stacked = Array(256).fill(0);
  var tree = new HuffTree();
  for (let i = 0; i < textbin.length; i++) {
    stacked[textbin[i]]++;
  }
  for (let i = 0; i < stacked.length; i++) {
    if (stacked[i] > 0) {
      tree.add(i, stacked[i]);
    }
  }
  tree.combine();
  var huffcode = tree.collect();
  var encoded = huffRead(textbin, huffcode[0]);
  var code = parseCode();
  var output = binToCode(huffcode[4] + encoded, code);
  document.getElementById('huffDeInput').value = output;
}

//Used for DECOMPRESSION
function huffDeGo() {
  var decodetree = new HuffTree();
  var code = parseCode();
  var encoded = codeToBin(document.getElementById('huffDeInput').value, code);
  encoded = decodetree.construct(encoded);
  document.getElementById('huffInput').value = byteStringUTF(
    decodetree.retrieve(encoded)
  );
}

function huffRead(raw, code) {
  var returnable = '';
  for (var i = 0; i < raw.length; i++) {
    returnable += code[raw[i]];
  }
  return returnable;
}
function grabHuff() {
  alert(stringByteUTF(document.getElementById('huffInput').value));
  return stringByteUTF(document.getElementById('huffInput').value);
}
function huffPrint(output) {
  document.getElementById('huffOutput').innerHTML = output;
}
//Huffman Prototypes
function HuffTree() {
  this.low = new HuffNode(null, null, '', 0);
  this.unq = 0;
  this.add = function (descriptor, weight) {
    this.unq++;
    var newnode = new HuffNode(null, null, descriptor, weight);
    this.addnode(newnode);
  };
  this.addnode = function (newnode) {
    var currnode = this.low;
    while (currnode.next !== null && currnode.next.weight < newnode.weight) {
      currnode = currnode.next;
    }
    newnode.next = currnode.next;
    currnode.next = newnode;
  };
  this.combine = function () {
    if (this.unq < 2) {
      this.add(null, 0);
      return this.combine();
    }
    if (this.low.next === null || this.low.next.next === null) {
      return this.low.next;
    }
    var newnode = new HuffNode(
      this.low.next,
      this.low.next.next,
      '',
      this.low.next.weight + this.low.next.next.weight
    );
    this.low.next = this.low.next.next.next;
    this.addnode(newnode);
    return this.combine();
  };
  this.collect = function () {
    var returnable = Array(Array(), Array(), 0, this.unq, '');
    this.low.next.collect(returnable, '');
    returnable[4] = returnable[4].substring(1); //only valid on 2 or more characters
    return returnable;
  };
  this.construct = function (input) {
    this.low = new HuffNode(null, null, '', 0);
    return this.low.construct(input);
  };
  this.retrieve = function (input) {
    var inputarr = Array(input, new Uint8ClampedArray(input.length), '', 0);
    while (inputarr[0].length > 0) {
      inputarr = this.low.retrieve(inputarr);
    }
    return inputarr[1].slice(0, inputarr[3]);
  };
}
function HuffNode(lesser, greater, descriptor, newweight) {
  this.left = lesser;
  this.right = greater;
  this.value = descriptor;
  this.weight = newweight;
  this.next = null;
  this.collect = function (arr, prefix) {
    if (this.value == '') {
      arr[4] += '0';
      this.left.collect(arr, prefix + '0');
      this.right.collect(arr, prefix + '1');
    } else {
      arr[0][this.value] = prefix;
      arr[1][prefix] = this.value;
      arr[2] += this.weight * prefix.length;
      arr[4] += '1' + intToBin(this.value, HUFFMAN_SIZE);
    }
  };
  this.construct = function (input) {
    if (input.charAt(0) == '0') {
      this.left = new HuffNode(null, null, '', 0);
      input = this.left.construct(input.substring(1));
    } else {
      this.left = new HuffNode(
        null,
        null,
        binToInt(input.substring(1, 1 + HUFFMAN_SIZE)),
        0
      );
      input = input.substring(1 + HUFFMAN_SIZE);
    }
    if (input.charAt(0) == '0') {
      this.right = new HuffNode(null, null, '', 0);
      input = this.right.construct(input.substring(1));
    } else {
      this.right = new HuffNode(
        null,
        null,
        binToInt(input.substring(1, 1 + HUFFMAN_SIZE)),
        0
      );
      input = input.substring(1 + HUFFMAN_SIZE);
    }
    return input;
  };
  this.retrieve = function (inputarr) {
    if (this.value != '') {
      inputarr[1][inputarr[3]] = this.value;
      inputarr[0] = inputarr[0].substring(inputarr[2].length);
      inputarr[2] = '';
      inputarr[3]++;
      return inputarr;
    } else {
      inputarr[2] += inputarr[0].charAt(inputarr[2].length);
      if (inputarr[2].charAt(inputarr[2].length - 1) == '0') {
        return this.left.retrieve(inputarr);
      } else {
        return this.right.retrieve(inputarr);
      }
    }
  };
}
