import { useEffect, useState } from "react";
import {useCreateOrder} from "../hooks/useCreateOrder"
import ShoppingCart from "../components/ShoppingCart";


export default function CheckoutPage() {
    const {mutate, isLoading, error} = useCreateOrder();

    const [orderSuccess, setOrderSuccess] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [cartItems, setCartItems] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email:"",
        address:""
    })

    // Hämta cart
    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || []

        setCartItems(cart)
    }, [])

    // Total i checkout
    const total = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0)

    // Skicka order
    const handleOrder = () => {
        if(!form.name || !form.email || !form.address) {
            setErrorMessage("Fyll i alla dina uppgifter!")
            return
        }

        const order = {
            customer: form,
            products: cartItems,
            total: total
        }

        mutate(order, {
            onSuccess: () => {
                localStorage.removeItem("cart")
                setOrderSuccess(true)
                setCartItems([])
                setErrorMessage("")
            },
            onError: (error) => {
                setErrorMessage(error.message || "Något gick fel..")
            }
        })
    }


    return (
        <div className="flex flex-col">

            <div className="flex flex-col md:flex-row gap-2">
                <section className="md:w-auto ml-3">
                        <h1>Orderöversikt</h1>

                            <ShoppingCart/>
                    
                </section>

                <section className="flex flex-1 flex-col m-12 gap-6 items-center border-2 border-gray-300 p-8 rounded-xl mt-5 bg-white shadow-md">
                    {orderSuccess ? (
                        <h2>Tack för din order!</h2>
                    ) : (
                        <>
                    <h2>Dina uppgifter</h2>

                     {errorMessage && (
                        <p className="w-full max-w-md mx-auto px-4 py-3 rounded-xl bg-red-50 text-red-500 text-sm font-semibold shadow-sm border border-red-100">{errorMessage}</p>
                    )}
                    
                    <input 
                        className="w-full max-w-md mx-auto px-4 py-1 outline-none border-2 border-gray-300 rounded transition-all duration-200 focus:bg-white focus:shadow-md"
                        type="text"
                        placeholder="NAMN:"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />

                    <input 
                        className="w-full max-w-md mx-auto px-4 py-1 outline-none border-2 border-gray-300 rounded transition-all duration-200 focus:bg-white focus:shadow-md"
                        type="text"
                        placeholder="E-MAIL:"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                    />

                    <input 
                        className="w-full max-w-md mx-auto px-4 py-1 outline-none border-2 border-gray-300 rounded transition-all duration-200 focus:bg-white focus:shadow-md"
                        type="text"
                        placeholder="ADDRESS:"
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                    </>
                )}
                </section>
            </div>

            <button 
                onClick={handleOrder} 
                disabled={isLoading}
                className="bg-gray-500 text-white px-8 py-3 font-semibold mx-auto rounded transition-all duration-200 
                hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 "
            >
                {isLoading ? "Skickar order..." : `Slutför order på ${total} kr`}
            </button>

            {error && <p>Något gick fel!</p>}
        </div>
    )
}