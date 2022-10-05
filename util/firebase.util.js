const dotenv = require('dotenv').config({path:'./.env'})
const { initializeApp } = require("firebase/app");


const { getStorage, getDownloadURL, ref,uploadBytes } = require('firebase/storage');
const { ProductImg } = require("../models/productImg.model");


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "beststore-cec1d.firebaseapp.com",
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "397503824686",
  appId: process.env.FIREBASE_APP_ID
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)

const uploadProductImgs = async(imgs,productId)=>{
  const imgsPromise = imgs.map(async (img)=>{
    const [originalName,ext] =  img.originalname.split('.')
    const fileName = `products/${productId}/${originalName}-${Date.now()}.${ext}`
    const imgRef = ref(storage,fileName)
    const result = await uploadBytes(imgRef,img.buffer)
    await ProductImg.create({
      productId,
      imgUrl: result.metadata.fullPath
    })
  })
  await Promise.all(imgsPromise)
}

const getProductsImgsUrl = async(products)=>{
  const productWithImgsPromise =  products.map( async(product)=>{
    const productImgsPromise = product.productsImgs.map(async(productImg)=>{
      const imgRef = ref(storage,productImg.imgUrl)
      const imgUrl = await getDownloadURL(imgRef)
      productImg.imgUrl = imgUrl
      return productImg
    })
    const productImgs = await Promise.all(productImgsPromise)
    product.productImgs = productImgs
    return product
  })
  return await Promise.all(productWithImgsPromise)
}

const getProductImgsUrl = async(product)=>{
  const productImgsPromise = product.productsImgs.map(async(productImg)=>{
    const imgRef = ref(storage,productImg.imgUrl)
    const imgUrl = await getDownloadURL(imgRef)
    productImg.imgUrl = imgUrl
    return productImg
  })
  console.log(productImgsPromise)
  await Promise.all(productImgsPromise)
  return product
}



const storage = getStorage(firebaseApp)


module.exports = {uploadProductImgs,getProductsImgsUrl,getProductImgsUrl}
