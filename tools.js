module.exports = {
    encodeData: encodeData,
    decodeData: decodeData,
    generateRandomID : generateRandomID,
};

function encodeData(command, dataList) {
    var result = "";
    result = "<" + command + ">";
    for (let i = 0; i < dataList.length; i++) {
        result = result + "<" + dataList[i] + ">";
    }
    const binaryString = stringToBinary(result);
    const swappedBinary = swapBits(binaryString);
    const chunks = swappedBinary.match(/.{1,8}/g);
    const encodedDataBytes = chunks.map(chunk => {
        return parseInt(chunk, 2);
    });
    const encodedString = Buffer.from(encodedDataBytes).toString('base64');
    result = encodedString;
    return result;
}

function decodeData(data) {
    var result = [];
    const regex = /<([^>]*)>/g;
    let match;
    while ((match = regex.exec(data)) !== null) {
        result.push(match[1]);
    }
    return result;
}

function swapBits(data) {
    let swappedBinary = "";
    for (let i = 0; i < data.length; i += 2) {
        if (i + 1 < data.length) {
            swappedBinary += data[i + 1];
            swappedBinary += data[i];
        } else {
            swappedBinary += data[i];
        }
    }
    return swappedBinary;
}

function stringToBinary(data) {
    let binaryString = "";
    for (let i = 0; i < data.length; i++) {
        const binaryChar = data[i].charCodeAt(0).toString(2).padStart(8, '0');
        binaryString += binaryChar + '';
    }
    return binaryString.trim();
}

function generateRandomID(length) {
  let code = '';
  for (let i = 0; i < length; i++) {
    const digit = Math.floor(Math.random() * 10);
    code += digit.toString();
  }
  return code;
}