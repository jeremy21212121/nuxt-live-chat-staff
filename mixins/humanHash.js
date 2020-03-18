/**
 * Vue mixin method
 * Makes random strings human-readable by compressing them into 4 english words
 */

const DEFAULT_WORDLIST = [
    'ack', 'alabama', 'alanine', 'alaska', 'alpha', 'angel', 'apart', 'april',
    'arizona', 'arkansas', 'artist', 'asparagus', 'aspen', 'august', 'autumn',
    'avocado', 'bacon', 'bakerloo', 'batman', 'beer', 'berlin', 'beryllium',
    'black', 'blossom', 'blue', 'bluebird', 'bravo', 'bulldog', 'burger',
    'butter', 'california', 'carbon', 'cardinal', 'carolina', 'carpet', 'cat',
    'ceiling', 'charlie', 'chicken', 'coffee', 'cola', 'cold', 'colorado',
    'comet', 'connecticut', 'crazy', 'cup', 'dakota', 'december', 'delaware',
    'delta', 'diet', 'don', 'double', 'early', 'earth', 'east', 'echo',
    'edward', 'eight', 'eighteen', 'eleven', 'emma', 'enemy', 'equal',
    'failed', 'fanta', 'fifteen', 'fillet', 'finch', 'fish', 'five', 'fix',
    'floor', 'florida', 'football', 'four', 'fourteen', 'foxtrot', 'freddie',
    'friend', 'fruit', 'gee', 'georgia', 'glucose', 'golf', 'green', 'grey',
    'hamper', 'happy', 'harry', 'hawaii', 'helium', 'high', 'hot', 'hotel',
    'hydrogen', 'idaho', 'illinois', 'india', 'indigo', 'ink', 'iowa',
    'island', 'item', 'jersey', 'jig', 'johnny', 'juliet', 'july', 'jupiter',
    'kansas', 'kentucky', 'kilo', 'king', 'kitten', 'lactose', 'lake', 'lamp',
    'lemon', 'leopard', 'lima', 'lion', 'lithium', 'london', 'louisiana',
    'low', 'magazine', 'magnesium', 'maine', 'mango', 'march', 'mars',
    'maryland', 'massachusetts', 'may', 'mexico', 'michigan', 'mike',
    'minnesota', 'mirror', 'mississippi', 'missouri', 'mobile', 'mockingbird',
    'monkey', 'montana', 'moon', 'mountain', 'muppet', 'music', 'nebraska',
    'neptune', 'network', 'nevada', 'nine', 'nineteen', 'nitrogen', 'north',
    'november', 'nuts', 'october', 'ohio', 'oklahoma', 'one', 'orange',
    'oranges', 'oregon', 'oscar', 'oven', 'oxygen', 'papa', 'paris', 'pasta',
    'pennsylvania', 'pip', 'pizza', 'pluto', 'potato', 'princess', 'purple',
    'quebec', 'queen', 'quiet', 'red', 'river', 'robert', 'robin', 'romeo',
    'rugby', 'sad', 'salami', 'saturn', 'september', 'seven', 'seventeen',
    'shade', 'sierra', 'single', 'sink', 'six', 'sixteen', 'skylark', 'snake',
    'social', 'sodium', 'solar', 'south', 'spaghetti', 'speaker', 'spring',
    'stairway', 'steak', 'stream', 'summer', 'sweet', 'table', 'tango', 'ten',
    'tennessee', 'tennis', 'texas', 'thirteen', 'three', 'timing', 'triple',
    'twelve', 'twenty', 'two', 'uncle', 'undress', 'uniform', 'uranus', 'utah',
    'vegan', 'venus', 'vermont', 'victor', 'video', 'violet', 'virginia',
    'washington', 'west', 'whiskey', 'white', 'william', 'winner', 'winter',
    'wisconsin', 'wolfram', 'wyoming', 'xray', 'yankee', 'yellow', 'zebra',
    'zulu'
]

const compress = (arr, n = 4, max = 256) => {
/*
   Takes an array of integers and compresses it to n values between 0 and max
*/
  if (arr.length < n) {
    // input array is too short, return array of NaN
    return Array.from(Array(n)).map(ud => NaN)
  }
  let outputArr = []
  let mod = arr.length % n
  while (mod > 0) {
    // pop array until it is evenly divisible by n. We could mix them in instead of throwing them away.
    outputArr.pop()
    mod -= 1
  }
  // compression ratio. This many byte values will be reduced to 1 byte value.
  const ratio = arr.length / n
  if (ratio > 1) {
   // compression is required
    for (let i=0; i<n; i++) {
      outputArr.push(arr.slice(i*ratio, (i+1)*ratio))
    }
    outputArr = outputArr.map(intArr => intArr.reduce((a,b)=>(a+b)%max))
  } else {
    // input array has correct length, no reduction required
    // Make sure no values are over max and return
    outputArr.push(...arr.map(val => val % max))
  }

  return outputArr
}

/*
  Turns a string into an array of character code values
*/
const stringToCharCodeArray = string => string.split('').map(ch => ch.charCodeAt(0))

const HumanHash = (string, outputLength = 4, separator = ' ', wordArray = DEFAULT_WORDLIST ) => {
    const max = wordArray.length
    const charCodeArray = stringToCharCodeArray(string)
    const compressedArray = compress(charCodeArray, outputLength, max)
    const hasNaN = !compressedArray.every(n => !Number.isNaN(n))
    if (hasNaN) {
      throw new Error('HumanHash Compression NaN Error')
    }

    return compressedArray
        .map(n => wordArray[n])
        .reduce((a, b) => a + separator + b)
}

export default {
  methods: {
    humanHash: HumanHash
  }
}
