import { useEffect, useState } from "react";
import {useCreateOrder} from "../hooks/useCreateOrder"
import { getProducts } from "../api/getProducts";


export default function CheckoutPage() {
    const {mutate, isLoading, isError} = useCreateOrder();

    const [cartItems, setCartItems] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email:"",
        address:""
    })

    // Hämta cart + fixa quantity
    useEffect(() => {
        const rawCart = JSON.parse(localStorage.getItem("cart")) || []

        const grouped = Object.values(
            rawCart.reduce((acc, item) => {
                if(!acc[item.id]) {
                    acc[item.id] = {...item, quantity:1}
                } else {
                    acc[item.id].quantity += 1
                }
                return acc
            }, {})
        )

        setCartItems(grouped)
    }, [])

    // Total i checkout
    const total = cartItems.reduce((sum, item) => {
        return sum + item.price * item.quantity
    }, 0)

    // Skicka order
    const handleOrder = () => {
        if(!form.name || !form.email || !form.address) {
            alert("Fyll i alla fält!")
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
                alert("Beställning skickad!") // TEMPORÄR - ska byta sida senare?
            },
            onError: () => {
                alert("Något gick fel..")
            }
        })
    }


    return (
        <div className=" flex flex-col p-6">

            <div className="flex flex-col md:flex-row md:justify-around md:gap-16 items-start">
                <section className="w-full md:w-auto">
                    <h1>Orderöversikt</h1>

                    {cartItems.length === 0 ? (
                        <p>Din kundvagn är tom</p>
                    ) : (
                        <div className="flex flex-col gap-4 text-left w-full">
                            {cartItems.map(item => (
                                <div key={item.id} className="w-full flex flex-col border border-black p-3">
                                 <p>{item.name}</p>
                                 <p className="flex justify-between">
                                    <span>
                                        {item.quantity}st
                                    </span> 
                                    <span>
                                        {item.price}:-
                                    </span>
                                 </p>
                                </div>
                            ))}

                            <h2>Total: {total} :-</h2>
                        </div>
                    )}
                </section>

                <section className="flex-1 flex-col gap-8 border-2 border-blue-500 p-4 rounded mt-5">
                    <h2 className="m-8 min-w-11/12">Dina uppgifter</h2>
                    
                    <input 
                        className="m-8 min-w-11/12 border-2 border-blue-500"
                        type="text"
                        placeholder="NAMN:"
                        value={form.name}
                        onChange={(e) => setForm({...form, name: e.target.value})}
                    />

                    <input 
                        className="m-8 min-w-11/12 border-2 border-blue-500"
                        type="text"
                        placeholder="E-MAIL:"
                        value={form.email}
                        onChange={(e) => setForm({...form, email: e.target.value})}
                    />

                    <input 
                        className="m-8 min-w-11/12 border-2 border-blue-500"
                        type="text"
                        placeholder="ADDRESS:"
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})}
                    />
                </section>
            </div>
            

            <button 
                onClick={handleOrder} 
                disabled={isLoading}
                className="bg-blue-400 text-white px-8 py-3 font-semibold mx-auto mt-7 md:mt-15"
            >
                {isLoading ? "Skickar order..." : `Slutför order på ${total} kr`}
            </button>

            {isError && <p>Något gick fel!</p>}
        </div>
    )
}