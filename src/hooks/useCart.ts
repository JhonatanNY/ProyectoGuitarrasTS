import { useState, useEffect, useMemo } from "react";
import { db } from '../data/db'
import type { Guitar, CartItem } from '../types'


export const useCart = () => {
    
      const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
       
      const [data] = useState(db)
      const [cart, setCart] = useState(initialCart)
      
      const MAX_ITEMS = 5
    
      useEffect(() => {
        localStorage.setItem("cart",JSON.stringify(cart))
      },[cart])
    
      function addToCart(item : Guitar){
    
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id)
    
        if(itemExists >= 0){
          if(cart[itemExists].cantidad >= 5) return 
          const updateCart = [...cart]
          updateCart[itemExists].cantidad++
          setCart(updateCart)
    
        }else{
          const newItem : CartItem = {...item ,cantidad : 1}
          setCart([...cart,newItem])
        }
        
        
      }
    
      function removeFromCart(id : Guitar['id']){
        
        const deleteCart = cart.filter((item) => { return item.id !== id})
        setCart(deleteCart)
    
        // setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
        
      }
    
      function increasequantity(id : Guitar['id']){
        const updateCart = cart.map( item => {
          if(item.id === id && item.cantidad < MAX_ITEMS){
            return {
              ...item,
              cantidad: item.cantidad + 1
            }
          }
          return item
        })
        setCart(updateCart)
      }
    
      function decreasequantities(id : Guitar['id']){
        const udpdateCart = cart.map((item) => {
          if(item.id === id && item.cantidad > 0){
            return {
              ...item,
              cantidad: item.cantidad - 1
            }
          }
          return item
        })
        setCart(udpdateCart)
      }
    
      function cleanCart(){
        setCart([])
      }

       const isEmpty = useMemo(() => cart.length === 0 ,[cart]) 
       const cartTotal = useMemo(() => cart.reduce((total,item) => total + (item.price * item.cantidad), 0 ),[cart])
    

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreasequantities,
        increasequantity,
        cleanCart,
        isEmpty,
        cartTotal
    }
}

