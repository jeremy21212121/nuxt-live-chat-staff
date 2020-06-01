/*
  encode object key-value pairs into a URL parameter string
*/

const encodeParams = (obj) => !Object.keys(obj).length ? '' :
  ( 
    '?' + 
    Object.keys(obj).map( k => 
      `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`
     )
    .join('&') 
  )

module.exports = encodeParams
